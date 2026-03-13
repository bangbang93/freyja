---
agent: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'githubRepo']
description: '生成和更新项目文档'
---

# 文档生成指南

帮助开发者快速生成高质量的项目文档，包括 API 文档、架构说明、使用指南等。

## 文档需求收集

如果用户未提供，请依次询问：

1. **文档类型** — API 文档、架构设计、快速开始、开发指南还是其他？
2. **文档范围** — 覆盖整个项目还是特定模块？
3. **目标读者** — 贡献者、用户、部署人员还是其他？
4. **现有文档** — 是否有需要更新的文档？

## 文档模板

### API 文档 (docs/api.md)

**部分 1：API 概述**
```markdown
# API 文档

## 基本信息
- **基础 URL**: `http://localhost:3000/api`
- **认证**: 无（公开接口）
- **请求格式**: JSON
- **响应格式**: JSON

## 错误响应
所有错误响应遵循以下格式：
\`\`\`json
{
  "statusCode": 400,
  "message": "验证失败",
  "error": ["title 不能为空"]
}
\`\`\`

## 状态码
- 200: 成功
- 201: 创建成功
- 400: 请求验证失败
- 404: 资源不存在
- 500: 服务器错误
```

**部分 2：端点文档**

为每个端点提供：
- HTTP 方法和路径
- 认证要求
- 请求参数（Query、Path、Body）
- 响应示例
- 可能的错误

**模板**：
```markdown
### GET /api/articles

获取文章列表（分页）。

#### 请求参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认 1 |
| limit | number | 否 | 每页条数，默认 10 |
| keyword | string | 否 | 搜索关键词 |

#### 响应示例

\`\`\`json
{
  "data": [
    {
      "_id": "63f8e1a2b4d5e6f7g8h9i0j1",
      "title": "Vue 3 最佳实践",
      "slug": "vue-3-best-practices",
      "published": true,
      "createdAt": "2024-03-01T10:00:00Z"
    }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 10
}
\`\`\`

#### 可能的错误

- 400: page 或 limit 参数无效
```

### 架构文档 (ARCHITECTURE.md)

**内容结构**：
```markdown
# Freyja 架构设计

## 系统概览

- ASCII 或 Mermaid 图表展示整体架构
- 主要组件和它们的关系
- 数据流向

## 核心组件

### packages/server (NestJS 后端)
- 职责：API 提供、SSR 渲染、数据库操作
- 关键技术：Express、Mongoose、Vike
- 模块结构：article、comment、user 等

### packages/home (Vue 3 SSR 前端)
- 职责：服务端渲染首屏、客户端路由
- 关键技术：Vike、Vue Router、Pinia
- 数据预取：asyncData 机制

### packages/admin (Vue 3 SPA 后台)
- 职责：管理员界面
- 关键技术：Element Plus、Vue Router、Pinia

### packages/api (共享类型)
- 职责：后端和前端通用的 TypeScript 类型定义
- 内容：DTO、Model 接口、API 响应类型

## 数据流

### SSR 数据流
1. 用户请求 URL → 服务端路由
2. 匹配对应的 Vue 组件
3. 调用组件的 asyncData() 方法
4. 预取数据存入 Pinia store
5. 序列化 store 状态到 HTML
6. 客户端接收 HTML 并水合

### API 数据流
1. 前端调用 fetch() 发送 API 请求
2. 后端 Controller 接收请求
3. 调用 Service 执行业务逻辑
4. Service 操作数据库
5. 返回结果给 Controller
6. Controller 返回 JSON 响应

## 关键设计决策

### 为什么使用 monorepo？
- 促进代码共享（packages/api）
- 简化开发工作流（统一的 npm scripts）
- 便于应用级的变更跟踪

### 为什么同时使用 SSR 和 SPA？
- SSR：改进首屏加载性能和 SEO
- SPA：提高后续页面导航的流畅度
- Admin 包纯 SPA：管理界面不需要 SEO，简化部署

## 部署架构

- 单一 Node.js 进程运行 server
- home 和 admin 在开发模式通过 Vite dev server 提供
- 生产模式：home 预构建到 server 的 dist，admin 独立部署或集成

## 性能优化策略

- SSR 缓存：LRU 缓存（30s TTL，max 1000 items）
- 数据库查询优化：索引、populate、lean()
- 前端代码分割：路由级别的动态 import
- 图片懒加载：lozad.js 集成

## 安全设计

- Admin 接口：@UseGuards(AdminGuard) 保护
- 会话存储：connect-redis
- 输入验证：class-validator DTO
- 敏感信息：环境变量管理
```

### 快速开始指南 (docs/GETTING_STARTED.md)

```markdown
# 快速开始

## 前置条件
- Node.js 18-22（见 package.json engines）
- MongoDB 本地或远程实例
- Redis（用于 session 存储）

## 本地开发

### 1. 克隆和安装
\`\`\`bash
git clone https://github.com/bangbang93/freyja.git
cd freyja
npm install
\`\`\`

### 2. 配置环境
复制 `.env.example` 为 `.env.local`：
\`\`\`bash
cp .env.example .env.local
# 编辑 .env.local 配置数据库和 Redis
\`\`\`

### 3. 运行迁移
\`\`\`bash
npm run migrate
\`\`\`

### 4. 启动开发服务器
\`\`\`bash
# 终端 1：启动 server + home SSR
npm run dev

# 终端 2：启动 admin SPA（可选）
npm -w @bangbang93/freyja-admin run dev
\`\`\`

访问：
- 主站：http://localhost:3000
- 后台：http://localhost:5173（admin dev server）或 http://localhost:3000/admin（生产模式）

## 常见任务

### 生成新模块
\`\`\`bash
# 使用 Copilot 快速生成
# 或参考 .github/prompts/setup-component.prompt.md
\`\`\`

### 运行测试
\`\`\`bash
npm test
npm run test:cov  # 覆盖率报告
\`\`\`

### 代码检查
\`\`\`bash
npm run lint
\`\`\`

### 生产构建
\`\`\`bash
npm run build
npm start  # 启动生产服务器
\`\`\`

## 遇到问题？

- 查看 [架构文档](./ARCHITECTURE.md)
- 查看 [代码审查指南](./.github/instructions/code-review.instructions.md)
- 提交 Issue 或联系维护者
```

### 开发指南 (DEVELOPMENT.md)

```markdown
# 开发指南

遵循 `.github/copilot-instructions.md` 中的架构说明和 `.github/instructions/` 中的编码规范。

## 工作流

1. **创建 feature 分支**: `git checkout -b feat/description`
2. **实施功能**：遵循对应的规范（nestjs.instructions.md、vue.instructions.md 等）
3. **编写测试**：参考 testing.instructions.md
4. **提交 PR**：提供清晰的描述和 changlog
5. **代码审查**：参考 code-review.instructions.md
6. **合并**：确保所有检查通过

## 模块开发模板

见 `.github/prompts/setup-component.prompt.md` 获取自动生成的模块骨架。

## 关键命令

\`\`\`bash
npm run dev         # 开发服务器
npm test            # 运行测试
npm run lint        # 代码检查
npm run build       # 生产构建
npm run migrate     # 数据库迁移
\`\`\`

## 文档与规范

- **编码规范**: `.github/instructions/*.instructions.md`
- **代码示例**: `.github/prompts/*.prompt.md`
- **AI 代理角色**: `.github/agents/*.agent.md`
```

## 文档维护

### 1. 更新触发点
当以下情况发生时，更新相应文档：
- API 端点变更 → 更新 docs/api.md
- 架构调整 → 更新 ARCHITECTURE.md
- 新增编码规范 → 更新 instructions 文件
- 依赖或配置变更 → 更新 DEVELOPMENT.md

### 2. 版本标记
```markdown
## 3.0.0 (2024-03-15)

### Added
- 新的搜索 API 端点
- asyncData 数据预取机制

### Changed
- 重构 ArticleService 架构
- 优化 SSR 缓存策略

### Fixed
- 修复 N+1 数据库查询问题

### Deprecated
- 旧的 `/api/search` 端点（2024-06-15 移除）
```

### 3. 链接维护
- 定期检查文档中的链接是否有效
- 使用相对路径便于文件移动
- 为代码添加永久链接（GitHub permalink）

## 文档生成工具

对于 API 文档，可考虑使用 Swagger/OpenAPI：
```typescript
// 在 main.ts 中配置
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

const config = new DocumentBuilder()
  .setTitle('Freyja API')
  .setDescription('The Freyja blog API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('docs', app, document)
```

访问 http://localhost:3000/docs 查看交互式 API 文档。

## 验证清单

生成文档后，检查：
- [ ] 语言和语调一致（中文或英文）
- [ ] 代码示例都能独立运行
- [ ] 所有链接都有效
- [ ] API 示例与实际实现一致
- [ ] 文档路径和文件名符合规范
- [ ] 大型文档有目录索引

