---
applyTo: "**/*.test.ts,**/*.spec.ts"
description: "测试编写规范和最佳实践"
---

# 测试指南

## 测试框架与工具

- 使用 Vitest 作为单元测试框架（支持 TypeScript 和 Vue 组件测试）
- 使用 `@testing-library/vue` 进行 Vue 组件集成测试
- 使用 `supertest` 进行 NestJS API 端到端测试
- 使用 `jest-mock-extended` 进行复杂 Mock 和 Spy 操作

## 测试结构 — AAA 模式

所有测试遵循 Arrange-Act-Assert（AAA）模式：
- **Arrange**：准备测试环境、初始化数据、Mock 依赖
- **Act**：执行被测试的代码
- **Assert**：验证期望结果

## 测试命名规范

- 测试文件名：`{componentName}.test.ts` 或 `{functionName}.spec.ts`
- 测试用例名（测试名称）使用中文，清晰描述被测试功能和期望行为
- 示例：`describe('article service', () => { it('应该根据ID查询文章') })`

## 单元测试

**NestJS 服务测试**：
- 为 Service 创建独立的单元测试
- Mock 所有外部依赖（数据库、外部 API、其他服务）
- 测试核心业务逻辑，验证返回值和异常处理
- 使用 `TestingModule` 进行依赖注入测试

**Vue 组件单元测试**：
- 为需要复杂逻辑的组件编写单元测试
- Mock 子组件和外部 API 调用
- 验证 Props、Emits 和本地状态变化
- 不测试依赖库的行为（如 Element Plus 组件）

## 集成测试

- 测试多个组件或模块之间的协作
- 对于 NestJS，使用 `TestingModule` 加载完整的模块（包含依赖）
- 对于 Vue 应用，测试实际的 store 操作和组件交互
- 使用真实或 in-memory 数据库进行测试

## API 端到端测试

- 使用 supertest 对 NestJS API 端点进行测试
- 测试请求/响应格式、状态码、错误处理
- 模拟认证和授权（Admin 接口需测试 AdminGuard）
- 清理测试数据，确保测试隔离

## Mock 和 Fixture

- 使用 `jest.fn()` 创建 mock 函数，使用 `jest.spyOn()` 监听实际函数
- 集中管理测试数据（fixtures），放在 `fixtures/` 或 `__mocks__/` 目录
- 避免在测试之间共享 mock 状态，每个测试独立设置
- 为复杂对象使用工厂函数生成 fixture

## 覆盖率要求

- 核心业务逻辑单元测试覆盖率目标：**>80%**
- 公开 API 端点覆盖率目标：**>70%**
- Vue 组件逻辑覆盖率目标：**>60%**（UI 交互可从覆盖率排除）
- 使用 `vitest --coverage` 生成覆盖率报告

## 异步操作测试

- 对于 Promise 和 async/await，显式返回 Promise 或使用 `await` 等待完成
- 使用 `beforeEach` 和 `afterEach` 钩子清理异步资源（定时器、连接）
- 对于超时操作，设置合理的 timeout 参数

## 错误场景测试

- 为每个公开方法至少编写一个错误路径的测试
- 验证异常类型和错误消息的准确性
- 测试边界情况和无效输入处理

## 测试隔离

- 每个测试应独立运行，不依赖执行顺序或其他测试的结果
- 使用 `beforeEach` 初始化，`afterEach` 清理
- 避免在全局作用域修改状态，使用局部变量

## 文档化

- 复杂测试添加注释说明测试意图
- 使用 `describe` 分组相关测试，提高可读性
- 为团队成员维护测试文档，说明如何运行和维护测试套件

