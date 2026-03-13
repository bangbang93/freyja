---
agent: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'githubRepo', 'search']
description: '代码审查和 GitHub Pull Request 评论指导'
---

# 代码审查快速指南

帮助审查者提供高质量、建设性的代码审查反馈。

## 审查前准备

1. **理解变更背景**
   - 阅读 PR 标题和描述，理解变更目的
   - 查看 PR 关联的 Issue（如有），理解需求背景
   - 检查修改的文件列表，识别影响范围

2. **建立审查框架**
   - 这是新功能（feat）、修复（fix）、重构（refactor）还是其他？
   - 涉及哪些核心模块（controller、service、model 或 component、store）？
   - 是否涉及跨包改动或数据库迁移？

## 审查清单

### 功能正确性（必审）

- [ ] 代码是否按照 Issue/PR 描述的需求实现？
- [ ] 是否处理了边界情况（空值、异常、并发）？
- [ ] 错误处理是否完善（自定义异常、适当的 HTTP 状态码）？
- [ ] 数据库操作是否安全（无 N+1 查询、使用了索引）？
- [ ] 异步操作是否正确处理（Promise、错误捕获、超时）？

**问题示例反馈**：
```
找到一个潜在的 N+1 查询：在 findAllComments() 中遍历文章时
调用了 populate()。建议使用 lean() 提高查询性能，或在控制器
层进行批量加载。
参考：{link to db query best practices}
```

### 代码质量（必审）

- [ ] 代码通过了 `npm run lint`（无 ESLint 错误）？
- [ ] TypeScript 类型标注完整，无 `any` 类型（必要情况除外）？
- [ ] 变量和函数命名是否清晰、遵循 camelCase？
- [ ] 复杂逻辑是否有清晰的注释或使用了自解释的代码？
- [ ] 代码重复是否应该提取为公用函数？

**问题示例反馈**：
```
suggestion: 这个格式化 slug 的逻辑在 article-create.vue 和
article-edit.vue 中重复了。建议提取为一个 composable
（如 useSlugFormatter）来复用。
```

### 架构与设计（必审 for 大改动）

#### 后端（NestJS）
- [ ] Service 中是否只有业务逻辑（没有 HTTP 层逻辑）？
- [ ] Controller 是否只负责 HTTP 和验证（没有业务逻辑）？
- [ ] DTO 是否正确分离（CreateDTO、UpdateDTO、ResponseDTO）？
- [ ] 数据库模型是否合理（索引、关联字段、约束）？
- [ ] 新模块是否在 `freyja.module.ts` 中注册？
- [ ] Admin 控制器是否有 `@UseGuards(AdminGuard)`？

**问题示例反馈**：
```
必需改进：ArticleController 直接调用了 MeiliSearch。
建议在 ArticleService 中封装 MeiliSearch 操作，保持控制器
对于 HTTP 层的关注点隔离。
参考：packages/server/src/app/article/article.service.ts L25-30
```

#### 前端（Vue）
- [ ] 组件是否只负责 UI 展示（业务逻辑提取到 composable/store）？
- [ ] 是否合理使用 Pinia store（避免过度中央化）？
- [ ] Props 和 Emits 是否有明确的类型定义和默认值？
- [ ] asyncData 中是否只做数据预取（不访问 window/document）？
- [ ] 样式是否使用了 `scoped` 以避免全局污染？

**问题示例反馈**：
```
suggestion: 对于复杂的表单验证和格式化逻辑，建议提取为
一个 composable（useArticleForm）。这样可以在其他组件中
复用，也便于单独测试。
```

### 测试覆盖（必审）

- [ ] 新功能是否编写了相应的测试？
- [ ] 测试是否覆盖了主要代码路径和错误场景？
- [ ] 测试名称（中文）是否清晰描述被测内容？
- [ ] Mock 设置是否正确（Mock 外部依赖，不 Mock 被测类）？
- [ ] 是否遗漏了边界值或异常场景测试？

**问题示例反馈**：
```
建议补充：ArticleService.create() 的测试缺少"title 为空时
应抛出 BadRequestException"的测试用例。这是一个常见的
错误处理场景。
```

### 文档与说明（建议）

- [ ] PR 描述是否清晰说明了变更内容和为什么做这个改动？
- [ ] 新 API 是否有清晰的 JSDoc 注释？
- [ ] 大型变更是否更新了相关的 `.github/copilot-instructions.md`？
- [ ] 如有架构变更，是否更新了 ARCHITECTURE.md 或 AGENTS.md？

**问题示例反馈**：
```
建议添加说明：为什么从 X 迁移到 Y？这个决策的权衡是什么？
在 PR 描述中补充一下，便于日后的维护者理解这个选择。
```

### 性能与安全（必审 for 关键路径）

- [ ] 是否引入了明显的性能问题（同步阻塞、无限循环）？
- [ ] 数据库查询是否有 N+1 问题或缺少索引？
- [ ] 前端是否有不必要的重新渲染或事件监听泄漏？
- [ ] API 是否正确保护（认证、授权、输入验证）？
- [ ] 是否暴露了敏感信息（密码、Token、内部错误）？

**问题示例反馈**：
```
必需改进：这个 API 端点没有 @UseGuards(AdminGuard) 保护。
查看 POST /api/admin/article 的示例。
参考：security.instructions.md
```

## 评论技巧

### 建议性反馈（Nice-to-have）
使用 `suggestion:` 前缀或"可以考虑"的语气：
```
suggestion: 这里可以用 Object.entries() 简化循环逻辑
```

### 必需改进（Must-fix）
明确指出问题和改进方向：
```
必需改进：Admin 控制器缺少 @UseGuards(AdminGuard)
```

### 问题澄清（Question）
用问题启发讨论：
```
问题：这里为何需要查询两次数据库？是否可以合并一次查询？
```

### 提供上下文
引用具体文件、行号和相关规范：
```
packages/server/src/app/article/article.service.ts:45
参考 nestjs.instructions.md 中的"Service 层设计"部分
```

## 特殊审查场景

### monorepo 跨包改动
- 是否需要同步更新 `packages/api/` 中的类型定义？
- 是否打破了包间的依赖约定（仅通过 api 包通信）？
- 前后端是否有类型不一致的风险？

### 数据库迁移（.ts files in migrations/)
- up() 和 down() 逻辑是否对称（可回滚）？
- 大规模数据改动是否分批处理？
- 是否添加了必要的索引？

### SSR 相关变更（pages 和 _default.page.server.ts）
- asyncData 中是否访问了浏览器 API？
- 状态序列化是否正确（@nuxt/devalue 兼容）？
- 客户端水合是否会导致 hydration mismatch？

## 批准与请求变更

### 使用 Approve
- 代码符合项目规范，没有关键问题
- 允许作者做出微小改动后自行合并

### 使用 Request Changes
- 发现必需修复的问题
- 等待作者修改后重新审查

### 建议用语

**请求修改时**：
```
请修改：在通过之前，请解决上述 3 个问题。修改完成后
请 re-request review，我会再过一遍确保都解决了。
```

**批准时**：
```
看起来不错！代码质量和设计都符合我们的标准。
@author 可以在所有检查通过后合并。
```

## 后续改进

- 定期回顾代码审查记录，识别常见问题
- 将重复出现的建议纳入 instructions 文件
- 组织团队讨论新的最佳实践
- 为新成员提供审查示例和 onboarding

