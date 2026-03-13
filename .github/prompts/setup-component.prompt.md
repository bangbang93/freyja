---
agent: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'githubRepo']
description: '为 Freyja 项目创建一个新的 NestJS 模块或 Vue 组件'
---

# 新建组件/模块快速指南

你正在帮助开发者快速创建 Freyja 项目中的新功能模块。根据选择的类型（NestJS 模块或 Vue 组件），生成符合项目规范的完整代码骨架。

## 收集需求

如果用户未提供，请依次询问：

1. **功能类型** — NestJS 模块还是 Vue 组件/页面？
2. **功能名称** — 清晰的英文名称（如 `comment`、`notification`）
3. **核心职责** — 该模块/组件主要功能是什么？
4. **数据模型** — 涉及的主要数据字段（如有）
5. **相关依赖** — 依赖其他模块还是服务？

## 生成规范

### 对于 NestJS 模块 (packages/server)

**生成以下文件骨架**（按顺序）：

1. **`{name}.model.ts`** — mongoose-typescript 模型定义
   - 使用 `@model` 装饰器定义集合名
   - 包含 `@id()`、常用 `@prop()` 字段
   - 为关键字段添加 `@required()`、`@unique()` 等约束

2. **`{name}.dto.ts`** — Create 和 Update DTO
   - 使用 `class-validator` 装饰器定义验证规则
   - 分离 CreateDTO、UpdateDTO 和响应 DTO

3. **`{name}.service.ts`** — 业务逻辑
   - 注入 MongooseModule，获取模型
   - 实现 `create()`、`findAll()`、`findById()`、`update()`、`remove()` 基础方法
   - 返回明确的业务异常

4. **`{name}-api.controller.ts`** — 公开 API
   - 注入 Service
   - 实现 GET、POST、PUT、DELETE 端点
   - 路径前缀 `@Controller('api/{name}')`

5. **`{name}-admin.controller.ts`** — 管理接口
   - 复制 API 控制器，添加 `@UseGuards(AdminGuard)`
   - 路径前缀 `@Controller('api/admin/{name}')`

6. **`{name}.module.ts`** — NestJS 模块
   - 导入 MongooseModule
   - 注册 Service 和两个 Controller

### 对于 Vue 组件 (packages/home | packages/admin)

**针对 Home 包（SSR）**：
- 生成 `pages/{name}/[id].page.vue` 组件
- 包含静态 `asyncData()` 方法预取数据
- 注入相应 Pinia store 并使用 `useRootStore()`

**针对 Admin 包（SPA）**：
- 生成 `pages/{name}/list.vue` 列表页
- 生成 `pages/{name}/create.vue` 创建/编辑表单
- 使用 Element Plus 组件库
- 在列表页通过 `onBeforeRouteLeave` 提示未保存

**共通要求**：
- 使用 `<script setup>` 和 TypeScript
- Props 和 Emits 明确标注类型
- 样式使用 `<style scoped>`
- 分离模板逻辑到 composables（如复杂）

## 验证清单

生成代码后，提醒用户检查：

- [ ] 导入语句完整（Service、DTO、装饰器）
- [ ] 类和方法名称遵循命名规范（camelCase）
- [ ] 数据库操作有异常处理
- [ ] API 路由前缀正确
- [ ] Admin 控制器有 `@UseGuards(AdminGuard)`
- [ ] Vue 组件的 props 和 emits 类型正确
- [ ] asyncData 方法仅在服务端执行（不访问浏览器 API）
- [ ] 导入相应的 Pinia store 和组合函数

## 后续步骤提示

- 编写单元测试（参考 testing.instructions.md）
- 在 `freyja.module.ts` 中注册新模块（后端）
- 在路由中添加新页面（前端）
- 更新 `packages/api/` 中的共享类型（如有 API 定义）
- 为新 API 或组件编写文档

