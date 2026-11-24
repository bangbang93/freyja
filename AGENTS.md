# Freyja AI Agent Guide

Freyja 是一个基于 Vue SSR + NestJS 的轻量级博客系统，采用 pnpm workspaces monorepo 结构。本指南帮助 AI Agent 快速掌握核心架构和开发模式。

## 核心架构

### Monorepo 结构与数据流

```
server (NestJS) ← 配置系统
  ├─ Express middleware → Vike SSR renderer → home 包
  ├─ API 路由 → 前端请求
  └─ 数据库 (MongoDB)

home (Vue 3 SSR/SPA) ← Pinia store + asyncData 数据预取
└─ 服务端渲染首屏 → Vite HMR → 客户端路由

admin (Vue 3 SPA) → Element Plus UI
└─ 纯 SPA，通过 /admin 路径独立部署
```

**关键流程**：服务端接收请求 → 路由匹配 home 页面 → 调用匹配组件的 `asyncData()` 方法 → 序列化状态到 HTML → 客户端水合 → 后续导航由 Vue Router 处理

### 配置系统（packages/server/src/config）

加载逻辑（`packages/server/src/config/index.ts`）和内置默认值（`packages/server/src/config/defaults.ts`）都在 server 源码里、随 `dist` 发布；仓库根目录的 `config/` 只放覆盖值，整目录挂载进容器也不受其中旧文件影响。

生效值 = 内置默认值 深合并 `config/<env>/<段>.{js,json}`（`<env>` 取 `CONFIG_ENV`，其次 `NODE_ENV`，默认 `development`）：

- 覆盖文件只替换它写到的键，数组整体替换；环境文件可以只注入 `jwt.secret`
- 段固定为 `database`、`jwt`、`freyja`，其它文件忽略；同名时 `.js` 优先于 `.json`
- 覆盖文件不存在就跳过；存在但解析失败，启动时报错并在信息里带文件路径
- 新增配置键先在 `defaults.ts` 给出默认值

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
- Express 5（path-to-regexp v8）不支持 `:id(\w{24})` 内联正则，启动时会抛 PathError；同一位置需区分 ID 与 slug/name 时用单个动态路由 + `isMongoId()` 运行时分派（见 `article-api.controller.ts` 的 `:idOrSlug`），字面量路由（如 `search`）必须注册在动态路由之前

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

### 生产模式 SSR 入口（packages/server/src/middleware/create-server-render.mts）

- 生产模式下 server 不经 Vite 构建，启动时手动加载 vike 的服务端构建入口 `packages/home/dist/server/entry.mjs`，之后才能调用 `renderPage`
- 入口文件名由 vike 决定，升级 vike 后若变动需同步这里；路径以字符串拼接避免被 tsc 解析，失配在编译期查不出来

### SSR 缓存策略（packages/server/src/middleware/create-server-render.mts）

- 生产环境使用 **LRU 缓存**：最多 1000 条，单条 30s TTL
- 缓存 URL 维度（`req.url`）判断命中/未命中
- 排除缓存路径：`/api`, `/admin`, `/feed`
- 通过 HTTP header `x-ssr-cache: hit|miss` 标识缓存状态

## 开发工作流

### 启动开发环境

```bash
# 启动后端 server + home SSR（带 Vite HMR）
pnpm run dev

# 单独启动 admin SPA 开发服务器（另一个终端）
pnpm --filter @bangbang93/freyja-admin run dev
```

### 构建与部署

```bash
pnpm run build      # 构建所有 workspaces（server + home + admin）
pnpm start          # 生产环境启动 server
pnpm run pm2        # 通过 PM2 部署（process.json 配置）
pnpm run migrate    # 执行数据库迁移（umzug）
pnpm run lint       # ESLint flat config (v9+)
```

### Node 版本要求

严格要求 Node 18+（package.json `engines` 字段），已验证支持到 Node 26。

## 集成与外部服务

| 组件 | 库/服务 | 用途 | 配置 |
|------|--------|------|------|
| ORM | mongoose-typescript | MongoDB 数据建模 | `config/<env>/database.json` |
| 后台认证 | jsonwebtoken | HttpOnly Cookie 携带 JWT（7 天滑动续期） | `config/<env>/jwt.json` |
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
3. 执行 `pnpm run migrate` 应用变更

### 前端页面 SSR 集成

1. 在 `packages/home/src/pages/` 下创建 `.page.vue` 页面组件
2. 定义静态 `asyncData()` 方法进行数据预取
3. 使用 useRootStore/useArticleStore 等获取预取数据
4. 点击导航时 Vue Router 会自动更新（客户端转换到 SPA 模式）

### 管理员认证

- 所有 Admin 控制器方法必须使用 `@UseGuards(AdminGuard)`
- 登录态为 HttpOnly Cookie 携带的 JWT（`AdminGuard` 验签挂到 `req.user`，`@AdminId()` 取 `sub`，每个已认证请求滑动续签）；无服务端吊销，logout 验签通过后清 cookie
- jwt secret 不入仓库：development 由 `config/development/jwt.json` 提供，生产由 `config/<env>/jwt.json` 注入，启动时缺失或为空即失败；生产 cookie 附加 `Secure`
- 公开评论接口挂 `OptionalAdminGuard`：有效 token 时填 `req.user`（站长以作者身份评论），匿名评论不受影响
- 登录页面：`packages/admin/src/pages/login.vue`

## 调试提示

1. **SSR 缓存问题**：生产环境 SSR 使用 30s LRU 缓存，修改模板后需清缓存或等待 TTL 过期
2. **环境配置**：设置 `CONFIG_ENV=production pnpm start` 强制使用 production 配置
3. **MongoDB 调试**：开发环境自动启用 mongoose debug（见 app.module.ts）
4. **前端日志**：检查浏览器控制台的 Pinia DevTools（开发模式）
5. **API 请求**：frontend 使用原生 fetch API（不依赖 axios）

---

**关键文件导航**：
- 架构入口：`packages/server/src/main.ts`、`packages/home/src/entries/index.ts`
- SSR 渲染管道：`packages/server/src/middleware/create-server-render.mts`
- 配置加载：`packages/server/src/config/index.ts`
- 类型定义：`packages/api/`

