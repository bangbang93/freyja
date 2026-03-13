# Freyja AI Agent Guide

Freyja 是一个基于 Vue SSR + NestJS 的轻量级博客系统，采用 npm workspaces monorepo 结构。本指南帮助 AI Agent 快速掌握核心架构和开发模式。

## 核心架构

### Monorepo 结构与数据流

```
server (NestJS) ← 配置系统
  ├─ Express middleware → Vike SSR renderer → home 包
  ├─ API 路由 → 前端请求
  └─ 数据库 (MongoDB) + Redis (sessions)

home (Vue 3 SSR/SPA) ← Pinia store + asyncData 数据预取
└─ 服务端渲染首屏 → Vite HMR → 客户端路由

admin (Vue 3 SPA) → Element Plus UI
└─ 纯 SPA，通过 /admin 路径独立部署
```

**关键流程**：服务端接收请求 → 路由匹配 home 页面 → 调用匹配组件的 `asyncData()` 方法 → 序列化状态到 HTML → 客户端水合 → 后续导航由 Vue Router 处理

### 配置系统（config/index.js）

配置分三层加载，后面覆盖前面：
1. `config/default/{database,freyja,logger,session}.{js,json}`
2. `config/{development,production}/*` (按 `NODE_ENV` 或 `CONFIG_ENV` 选择)

MongoDB URI、Redis session、日志级别等通过此系统配置。

## 关键代码模式

### NestJS 模块模式（packages/server/src/app/*）

每个功能模块遵循此结构（以 article 为例）：

```
article/
  article.model.ts          # Mongoose 模型（mongoose-typescript）
  article.dto.ts            # DTO 定义
  article.service.ts        # 业务逻辑
  article-api.controller.ts # 公开 API (/api/article/*)
  article-admin.controller.ts # 管理接口 (/api/admin/article/*, @UseGuards)
  article.module.ts         # 模块注册
```

**Mongoose 模型示例**：使用装饰器定义，`@model("collection", options)` 装饰类，`@id()/@prop()/@ref()/@refArray()` 修饰字段。关系字段使用 `Ref<T>` 类型。

**控制器约定**：
- Admin 控制器 **必须** 使用 `@UseGuards(AdminGuard)` 保护
- 路由参数验证使用 `@MongoIdParam('id')` 装饰器（自动验证 ObjectId）
- ID 路由使用正则约束：`@Get(':id(\\w{24})')`

### Vue 前端数据预取（packages/home）

**SSR 数据预取流程** (`_default.page.server.ts`)：
1. 路由匹配后获取当前路由的所有组件
2. 遍历组件，调用其静态方法 `asyncData({ store, route, origin })`
3. 将返回的数据存入 Pinia store
4. 渲染 HTML 时通过 `@nuxt/devalue` 序列化状态
5. 客户端接收序列化状态并水合 store

**组件数据预取示例**：
```typescript
export default {
  async asyncData({ store, route, origin }) {
    // 调用 store action 获取数据
    await store.dispatch('article/fetchArticle', route.params.id)
    return { /* 可选的本地状态 */ }
  }
}
```

**Admin 表单模式** (`packages/admin/src/pages/article/article-create.vue`)：
- 使用 `limax` 库自动生成 URL slug：`article.slug = limax(article.title)`
- 用户手动修改 slug 后，`autoSlug` 标志自动停用自动转换
- 离开页面前使用 `onBeforeRouteLeave` + `ElMessageBox.confirm` 提示未保存修改

### SSR 缓存策略（packages/server/src/middleware/create-server-render.mts）

- 生产环境使用 **LRU 缓存**：最多 1000 条，单条 30s TTL
- 缓存 URL 维度（`req.url`）判断命中/未命中
- 排除缓存路径：`/api`, `/admin`, `/feed`
- 通过 HTTP header `x-ssr-cache: hit|miss` 标识缓存状态

## 开发工作流

### 启动开发环境

```bash
# 启动后端 server + home SSR（带 Vite HMR）
npm run dev

# 单独启动 admin SPA 开发服务器（另一个终端）
npm -w @bangbang93/freyja-admin run dev
```

### 构建与部署

```bash
npm run build      # 构建所有 workspaces（server + home + admin）
npm start          # 生产环境启动 server
npm run pm2        # 通过 PM2 部署（process.json 配置）
npm run migrate    # 执行数据库迁移（umzug）
npm run lint       # ESLint flat config (v9+)
```

### Node 版本要求

严格要求 Node 18-22（package.json `engines` 字段），不支持 23+。

## 集成与外部服务

| 组件 | 库/服务 | 用途 | 配置 |
|------|--------|------|------|
| ORM | mongoose-typescript | MongoDB 数据建模 | `config/*/database.json` |
| Session 存储 | connect-redis | Redis 会话存储 | `config/*/session.json` |
| 全文搜索 | MeiliSearch | 文章全文索引 | `packages/server/src/app/meilisearch` |
| 动态渲染 | markdown-it + markdown-it-lozad | Markdown 解析 + 图片懒加载 | `packages/home` |
| 代码高亮 | Prism.js | 代码块着色 | vite-plugin-prismjs |
| UI 组件 (Admin) | Element Plus | 管理后台界面 | `packages/admin` |

## ESLint 特殊规则

项目使用 ESLint flat config (v9+)，分区域配置规则：

| 区域 | 特殊规则 |
|------|--------|
| Frontend (admin/home) | `@typescript-eslint/no-unsafe-*` 设为 warn（类型安全不那么严格） |
| Backend (server) | 禁用 `@typescript-eslint/no-magic-numbers` 和 `no-require-imports` |
| Vue 文件 | 禁用 `@typescript-eslint/no-unused-vars`（支持 template 中的隐式用法） |

## 常见任务速查

### 添加新功能模块

1. 在 `packages/server/src/app/{功能名}/` 创建文件
2. 定义 model（@model + @prop）→ dto → service → 两个 controller
3. 在 module 中导入 MongooseModule 和其他依赖
4. 注册到 freyja.module.ts 的 imports

### 修改数据库模型

1. 编辑 `model.ts` 中的装饰器定义
2. 创建迁移脚本：`packages/server/src/migrations/{timestamp}-{描述}.ts`（umzug 格式）
3. 执行 `npm run migrate` 应用变更

### 前端页面 SSR 集成

1. 在 `packages/home/src/pages/` 下创建 `.page.vue` 页面组件
2. 定义静态 `asyncData()` 方法进行数据预取
3. 使用 useRootStore/useArticleStore 等获取预取数据
4. 点击导航时 Vue Router 会自动更新（客户端转换到 SPA 模式）

### 管理员认证

- 所有 Admin 控制器方法必须使用 `@UseGuards(AdminGuard)`
- 会话通过 Redis 存储（connect-redis）
- 登录页面：`packages/admin/src/pages/login.vue`

## 调试提示

1. **SSR 缓存问题**：生产环境 SSR 使用 30s LRU 缓存，修改模板后需清缓存或等待 TTL 过期
2. **环境配置**：设置 `CONFIG_ENV=production npm start` 强制使用 production 配置
3. **MongoDB 调试**：开发环境自动启用 mongoose debug（见 app.module.ts）
4. **前端日志**：检查浏览器控制台的 Pinia DevTools（开发模式）
5. **API 请求**：frontend 使用原生 fetch API（不依赖 axios）

---

**关键文件导航**：
- 架构入口：`packages/server/src/main.ts`、`packages/home/src/entries/index.ts`
- SSR 渲染管道：`packages/server/src/middleware/create-server-render.mts`
- 全局配置：`config/index.js`
- 类型定义：`packages/api/`

