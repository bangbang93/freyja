# Freyja Copilot 指令

## 项目架构

Freyja 是一个使用 Vue SSR + NestJS 的博客系统，采用 npm workspaces 的 monorepo 结构：

- **packages/server**: NestJS 后端服务器（Node.js 18-22）
  - 处理 API 请求、SSR 渲染、数据库操作
  - 使用 mongoose-typescript 进行 MongoDB ORM
  - 集成 Vike (原 vite-plugin-ssr) 实现 Vue SSR
  - 开发模式下集成 Vite middleware 实现 HMR
- **packages/home**: Vue 3 前端主站 (Vike + Vue Router + Pinia)
  - 使用 Vike 框架进行 SSR/SPA 混合渲染
  - 首屏服务端渲染，后续请求浏览器端路由
  - 组件通过 `asyncData` 方法预取数据
- **packages/admin**: Vue 3 管理后台 (Element Plus)
  - 纯 SPA 应用，使用 Element Plus UI 组件库
  - 通过 `/admin` 路径访问，使用 `connect-history-api-fallback`
- **packages/api**: 共享的 TypeScript API 类型定义
- **config/**: 分环境配置文件系统（通过 `NODE_ENV` 加载）

## 关键开发工作流

### 启动开发服务器

```bash
npm run dev  # 仅启动 server (带 Vite HMR)
# Admin 前端需单独启动: npm -w @bangbang93/freyja-admin run dev
```

### 构建与部署

```bash
npm run build      # 构建所有 workspaces
npm start          # 生产环境启动
npm run pm2        # 使用 PM2 部署
npm run migrate    # 运行数据库迁移
```

### Linting

```bash
npm run lint  # 使用 ESLint flat config (v9+)
```

## 代码约定

### NestJS 后端模式 (packages/server)

1. **模块结构**: 每个功能模块包含 `-api.controller.ts` (公开接口) 和 `-admin.controller.ts` (管理接口)

   ```
   article/
     article-api.controller.ts      # 路由: /api/article/*
     article-admin.controller.ts    # 路由: /api/admin/article/* + @UseGuards(AdminGuard)
     article.service.ts
     article.model.ts
     article.dto.ts
     article.module.ts
   ```

2. **Mongoose 模型**: 使用 `mongoose-typescript` 装饰器风格

   ```typescript
   @model("article", { timestamps: true })
   export class Article {
     @id() public _id!: ObjectId;
     @prop() @required() @unique() public slug!: string;
     @refArray(Category, ObjectId) public categories!: Ref<Category>[];
   }
   ```

3. **控制器**:
   - Admin 控制器必须使用 `@UseGuards(AdminGuard)`
   - 使用 `@MongoIdParam('id')` 装饰器自动验证 MongoDB ObjectId
   - 路由参数使用正则约束: `@Get(':id(\\w{24})')`

4. **SSR 渲染**: 在 `src/middleware/create-server-render.ts` 中实现
   - 使用 LRU 缓存策略 (30s, max 1000 items)
   - 通过 `x-ssr-cache` header 标识缓存命中
   - 排除 `/api`, `/admin`, `/feed` 路径

### Vue 前端模式 (packages/home & admin)

1. **Admin 表单模式** ([article-create.vue](packages/admin/src/pages/article/article-create.vue))
   - 使用 `limax` 库自动生成 URL slug: `article.slug = limax(article.title)`
   - 提供 `autoSlug` 标志，用户手动编辑后自动停用
   - 离开页面前使用 `onBeforeRouteLeave` + `ElMessageBox.confirm` 提示未保存

2. **Home SSR 数据预取** ([\_default.page.server.ts](packages/home/src/_default.page.server.ts))
   - 组件定义 `asyncData` 静态方法进行数据预取
   - 在服务端渲染前调用所有匹配组件的 `asyncData`
   - 使用 `@nuxt/devalue` 序列化状态到客户端

3. **API 调用**: 使用原生 `fetch` API，不使用 axios

### ESLint 配置特点

- 使用 ESLint flat config (v9+)
- Frontend 特定规则: `@typescript-eslint/no-unsafe-*` 设为 `warn`
- Backend 禁用 `@typescript-eslint/no-magic-numbers` 和 `no-require-imports`
- Vue 文件使用 `vue-eslint-parser` + `@typescript-eslint/parser` 组合

## 配置系统

配置通过 `config/index.js` 加载，支持按环境覆盖：

- 基础配置: `config/default/*.{js,json}`
- 环境配置: `config/{development,production}/*.{js,json}`
- 通过 `NODE_ENV` 或 `CONFIG_ENV` 环境变量选择

## 集成点

- **数据库**: MongoDB (mongoose) + Redis (connect-redis for sessions)
- **搜索**: MeiliSearch 集成 (packages/server/src/app/meilisearch)
- **Markdown**: 使用 `markdown-it` + `markdown-it-lozad` (懒加载图片)
- **代码高亮**: Prism.js (通过 `vite-plugin-prismjs`)
- **图片懒加载**: lozad.js

## 特别注意

- **Node 版本**: 严格要求 18-22 (见 package.json engines)
- **TypeScript**: 不要在 `.vue` 文件中使用 `@typescript-eslint/no-unused-vars` (已禁用)
- **SSR**: `/admin` 路径不参与 SSR，直接返回 SPA 入口
- **迁移**: 使用 umzug，迁移文件位于 `packages/server/src/migrations/`
