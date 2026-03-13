---
applyTo: "packages/server/src/app/**/*.ts"
description: "NestJS 后端开发规范"
---

# NestJS 后端开发指南

## 模块架构规范

遵循每个功能模块的标准结构：
- `{name}.model.ts` — mongoose-typescript 装饰器定义的数据模型
- `{name}.dto.ts` — 请求/响应数据传输对象
- `{name}.service.ts` — 业务逻辑和数据操作
- `{name}-api.controller.ts` — 公开 REST API 接口（路由：`/api/{name}/*`）
- `{name}-admin.controller.ts` — 后台管理接口（路由：`/api/admin/{name}/*`，必须使用 `@UseGuards(AdminGuard)`）
- `{name}.module.ts` — NestJS 模块注册

## Mongoose 模型定义

使用 mongoose-typescript 装饰器风格：
- `@model("collectionName", { timestamps: true })` 装饰类定义集合
- `@id()` 标注主键字段（MongoDB ObjectId）
- `@prop()` 标注普通属性，`@required()` 设置必填，`@unique()` 设置唯一约束
- `@ref(RefType)` 单文档引用，`@refArray(RefType)` 数组引用，使用 `Ref<T>` 类型
- 关键字段添加索引装饰器优化查询性能

## 控制器与路由设计

- API 控制器处理公开接口，Admin 控制器处理后台操作
- 所有 Admin 控制器方法必须使用 `@UseGuards(AdminGuard)` 装饰
- ObjectId 参数使用 `@MongoIdParam('id')` 装饰器自动验证，或在路由中使用正则 `@Get(':id(\\w{24})')`
- 分离关注点：控制器仅负责 HTTP 层（请求/响应），业务逻辑交由 Service
- 使用适当的 HTTP 状态码（201 for POST/create，204 for DELETE，400 for validation errors）

## 服务层设计

- 一个 Service 对应一个数据模型和业务域
- 方法名使用动词开头表达操作（`findById`、`create`、`update`、`delete` 等）
- 返回明确的业务异常而非裸 Error，使用 `BadRequestException`、`NotFoundException` 等 NestJS 异常
- 注入依赖通过构造函数而非属性，便于测试

## DTO 与数据验证

- 使用 `class-validator` 装饰器在 DTO 类上标注验证规则
- 创建 Controller 和 Service 之间的中间层 DTO，避免暴露内部模型结构
- 分离 CreateDTO、UpdateDTO 和响应 DTO（ResponseDTO），遵循最小权限原则

## 错误处理

- 业务逻辑错误抛出 NestJS 异常（`NotFoundException`、`BadRequestException` 等）
- 数据库错误在 Service 中捕获并转换为业务异常，避免泄露内部错误细节
- 记录错误日志便于问题诊断，但避免在响应中返回技术细节

## 数据库迁移

- 使用 umzug 框架管理数据库迁移脚本
- 迁移文件位于 `packages/server/src/migrations/`，命名格式 `{timestamp}-{description}.ts`
- 每个迁移脚本应包含 `up()` 和 `down()` 方法，支持前向和回滚操作
- 大型数据库变更应拆分为多个小迁移，便于故障恢复

## 依赖注入与模块注册

- 在模块的 `imports` 中声明依赖的其他模块和 MongooseModule
- 在 `providers` 中注册 Service 和其他可注入的类
- 在 `controllers` 中注册该模块的 Controller
- 主应用模块 `app.module.ts` 中导入所有功能模块

## 中间件与拦截器

- 使用中间件处理请求级别的关注点（日志、性能监控）
- 使用拦截器统一处理响应格式、错误转换、性能计时
- SSR 相关的中间件在 `packages/server/src/middleware/` 目录维护

