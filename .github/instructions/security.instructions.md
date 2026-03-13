---
applyTo: "packages/server/src/**/*.ts"
description: "安全最佳实践和防护措施"
---

# 安全指南

## 认证与授权

- 所有后台接口（`-admin.controller.ts`）必须使用 `@UseGuards(AdminGuard)` 装饰保护
- AdminGuard 通过会话（Redux via connect-redis）验证用户身份
- 避免在 URL 或客户端暴露敏感令牌，使用 HttpOnly Cookie 存储会话
- 前端使用原生 fetch API 并自动发送 Cookie（设置 `credentials: 'include'`）

## 密码与凭证管理

- 密码使用 bcrypt 或类似的自适应哈希算法，应用多轮迭代
- 不在日志、错误消息或版本控制中暴露密码或秘密
- 使用环境变量管理敏感配置（数据库 URI、API 密钥等）
- 敏感数据在数据库中加密存储，使用专用的加密库

## 输入验证与 SQL 注入防护

- 所有用户输入使用 `class-validator` DTO 进行验证，在控制器层拒绝无效请求
- 数据库操作使用 mongoose 的查询 API，避免手动拼接字符串（天然防止 NoSQL 注入）
- 对于动态查询，明确指定允许的字段和操作符
- 验证上传文件的类型和大小，防止文件上传攻击

## 跨站脚本（XSS）防护

- Vue 模板中的用户数据自动 HTML 转义，使用 `v-text` 或 `{{ }}` 插值
- 避免使用 `v-html` 渲染用户输入，除非数据来自可信来源且已清理
- Markdown 内容使用 `markdown-it` 解析，配置合理的 sanitize 规则
- CSP（Content Security Policy）Header 由服务端设置，限制资源加载来源

## 跨站请求伪造（CSRF）防护

- 使用 SameSite Cookie 属性防止跨站请求（值为 `Strict` 或 `Lax`）
- 对于状态改变操作（POST、PUT、DELETE）验证来源和 Origin header
- 表单提交包含 CSRF Token（由框架自动生成和验证）

## 敏感信息暴露防护

- API 响应不包含不必要的系统信息（数据库类型、框架版本等）
- 错误消息对用户展示通用错误，技术细节仅在日志中记录
- 禁用目录浏览和通用错误页面，返回 404 而非 403 以隐藏资源存在
- 避免在 URL 参数中传输敏感信息，使用 POST 请求体

## 依赖安全

- 定期审查项目依赖的安全漏洞（使用 `npm audit` 或 `snyk`）
- 更新包时始终运行测试，确保兼容性
- 使用锁定文件（`package-lock.json`）确保依赖版本一致性
- 限制依赖权限，仅安装必要的包而非开发时的全部依赖

## 日志与监控

- 日志记录业务事件和错误，不包含敏感信息（密码、Token、个人数据）
- 日志级别配置（logger.js 配置文件）根据环境调整：development 为 DEBUG，production 为 WARN/ERROR
- 监控异常登录、API 限流、数据库连接错误等安全事件
- 定期审查日志，识别异常模式和潜在攻击

## 数据库安全

- MongoDB 连接使用强密码，启用认证
- 数据库备份定期执行，恢复过程测试
- 数据库用户权限最小化（应用用户仅读写应用数据库，不创建/删除数据库）
- 敏感数据字段（如密码、API 密钥）标记为 `select: false`，避免不必要地查询

## 通信安全

- 生产环境使用 HTTPS 加密通信
- 使用安全的 Cookie 标志：`HttpOnly`（防止 XSS 访问）、`Secure`（仅 HTTPS）、`SameSite`
- API 通信使用 JSON 格式，避免敏感数据序列化为 JavaScript

## 第三方服务集成

- 对接 MeiliSearch、Redis 等外部服务时验证连接身份
- API 密钥存储在环境变量或密钥管理服务，不提交到版本控制
- 定期审查第三方服务的安全政策和隐私声明

