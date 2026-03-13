---
agent: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'githubRepo']
description: '重构现有代码，改进质量、性能和可维护性'
---

# 重构指南

帮助开发者进行有计划的代码重构，提高代码质量、性能和可维护性，同时保持功能不变。

## 重构需求收集

如果用户未提供，请依次询问：

1. **重构目标** — 改进性能、提高可读性、降低复杂度还是技术债务？
2. **重构范围** — 整个模块、单个文件还是特定函数？
3. **约束条件** — 是否需要保持 100% 向后兼容？
4. **优先级** — 哪些部分最需要重构？

## 重构前准备

### 1. 分析现状
- 理解现有代码的功能和设计
- 识别代码味道：重复代码、复杂函数、长参数列表等
- 检查现有的测试覆盖率

### 2. 制定计划

**后端重构示例计划**：
```
1. 提取重复的 Service 业务逻辑为公用方法
   - 在 ArticleService 和 PageService 中有重复的 slug 生成逻辑
   - 建议：创建 UtilService 并注入到两个 Service

2. 拆分过大的 Controller
   - ArticleController 有 15+ 个方法
   - 建议：按功能域拆分为 ArticleReadController 和 ArticleEditController

3. 简化复杂查询
   - findArticleWithComments() 中 N+1 查询问题
   - 建议：使用 populate() 或分页加载评论
```

**前端重构示例计划**：
```
1. 提取 composables
   - article-create.vue 中的表单验证逻辑复杂（200+ 行）
   - 建议：提取为 useArticleForm composable

2. 简化组件层级
   - comment-list.vue → comment-item.vue → comment-meta.vue（嵌套过深）
   - 建议：扁平化为 comment-list.vue + comment-item.vue

3. 优化状态管理
   - 多个页面直接修改 store 状态
   - 建议：统一使用 actions，避免直接修改
```

## 重构实施

### 后端（NestJS）

#### 1. 提取重复业务逻辑
**Before**：
```typescript
// ArticleService
private generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').slice(0, 50)
}

// PageService
private generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').slice(0, 50)
}
```

**After**：
```typescript
// util.service.ts
@Injectable()
export class UtilService {
  generateSlug(title: string, maxLength = 50): string {
    return title.toLowerCase().replace(/\s+/g, '-').slice(0, maxLength)
  }
}

// 在 ArticleService 和 PageService 中注入使用
```

**变更清单**：
- [ ] 创建新的 UtilService 并添加公用方法
- [ ] 在模块中注册 UtilService
- [ ] 在两个 Service 中注入 UtilService
- [ ] 删除重复代码
- [ ] 为提取的方法编写单元测试
- [ ] 验证现有测试仍通过

#### 2. 优化数据库查询
**Before（N+1 查询）**：
```typescript
const articles = await this.articleModel.find().limit(10)
const result = articles.map(article => ({
  ...article.toObject(),
  comments: await this.commentModel.find({ articleId: article._id }) // N+1
}))
```

**After（使用 populate）**：
```typescript
const articles = await this.articleModel
  .find()
  .populate('comments') // 一次查询获取关联数据
  .limit(10)
  .lean() // 返回普通对象，不可修改但更快
```

#### 3. 拆分过大的 Service
如果 Service 超过 300 行且有多个不相关的方法：
```typescript
// 原始 ArticleService 分解为：
// - article-read.service.ts (查询、搜索、获取详情)
// - article-write.service.ts (创建、更新、删除、发布)
// - article.service.ts (依赖注入两个子 Service，暴露统一接口)
```

### 前端（Vue）

#### 1. 提取 Composables
**Before（组件中杂糅了多个关注点）**：
```vue
<script setup>
const articleForm = reactive({ title: '', content: '' })
const autoSlug = ref(true)

watch(() => articleForm.title, (newTitle) => {
  if (autoSlug.value) {
    articleForm.slug = limax(newTitle)
  }
})

const validateForm = () => {
  if (!articleForm.title) return { valid: false, errors: ['标题不能为空'] }
  // ... 更多验证逻辑
}

const handleSubmit = async () => {
  const validation = validateForm()
  if (!validation.valid) {
    // ... 显示错误
  }
  // ... 提交逻辑
}
</script>
```

**After（提取为 composable）**：
```typescript
// composables/useArticleForm.ts
export function useArticleForm() {
  const articleForm = reactive({ title: '', content: '' })
  const autoSlug = ref(true)
  const errors = ref({})

  watch(() => articleForm.title, (newTitle) => {
    if (autoSlug.value) {
      articleForm.slug = limax(newTitle)
    }
  })

  const validateForm = () => {
    errors.value = {}
    if (!articleForm.title) errors.value.title = '标题不能为空'
    // ... 更多验证
    return Object.keys(errors.value).length === 0
  }

  return { articleForm, autoSlug, errors, validateForm }
}
```

**在组件中使用**：
```vue
<script setup>
const { articleForm, validateForm } = useArticleForm()

const handleSubmit = async () => {
  if (!validateForm()) return
  // ... 提交逻辑
}
</script>
```

#### 2. 简化组件通信
**Before（Props drilling）**：
```vue
<!-- ParentComponent.vue -->
<ChildComponent :article="article" :loading="loading" @update="handleUpdate" />

<!-- ChildComponent.vue -->
<GrandchildComponent :article="article" :loading="loading" @update="$emit('update', $event)" />
```

**After（使用 Provide/Inject）**：
```typescript
// ParentComponent.vue
const article = ref({})
const loading = ref(false)

provide('article', article)
provide('loading', loading)
provide('updateArticle', (newArticle) => { /* update */ })

// ChildComponent.vue 和 GrandchildComponent.vue
const article = inject('article')
const updateArticle = inject('updateArticle')
```

#### 3. 优化 Store 使用
**Before（混合修改 state）**：
```typescript
// 某个组件中
store.articles = []
store.articles.push(newArticle)
store.currentArticle = newArticle
```

**After（统一使用 actions）**：
```typescript
// store/article.ts
const actions = {
  async createArticle(article) {
    const result = await api.createArticle(article)
    this.articles.push(result)
    this.currentArticle = result
    return result
  }
}

// 在组件中使用
await store.createArticle(newArticle)
```

## 重构验证

### 1. 测试验证
```bash
# 运行现有测试确保功能未变
npm test

# 生成覆盖率报告
npm run test:cov

# 如需要，补充新测试
npm test -- setup-refactored-feature.spec.ts
```

### 2. 性能验证
- 对于数据库查询优化：比较重构前后的查询次数和耗时
- 对于前端：使用 Chrome DevTools 检查渲染性能和内存使用
- 使用 `npm run build` 对比构建体积和时间

### 3. 手动验证
- 在开发环境运行功能，确保行为无变化
- 在多个浏览器和设备上测试
- 验证边界情况和错误处理

## 提交重构改动

### 分离提交
将重构与功能改动分开提交：
```bash
# 第一个 PR：纯重构，不改变功能
git commit -m "refactor(article): 提取 slug 生成逻辑到 UtilService"

# 第二个 PR：在重构基础上的新功能（如需要）
git commit -m "feat(article): 支持自定义 slug 长度"
```

### PR 描述模板
```markdown
## 重构目的
- [ ] 提高可读性
- [ ] 改进性能
- [ ] 降低复杂度
- [ ] 其他：_____

## 重构内容
- 从 ArticleService 和 PageService 提取重复的 slug 生成逻辑
- 创建 UtilService 作为共用工具库

## 验证方法
- [x] 所有现有测试通过 (`npm test`)
- [x] 新增测试覆盖提取的逻辑
- [x] 手动测试关键功能

## 性能影响
- 无性能变化（纯重构）
- 或：数据库查询从 N+1 降低为 1 次

## 注意事项
- 无破坏性改动，完全向后兼容
```

## 常见重构模式

### 后端
| 问题 | 解决方案 |
|------|--------|
| 重复的业务逻辑 | 提取为 Service 或工具类 |
| N+1 查询 | 使用 populate() 或批量加载 |
| 过长的方法 | 拆分为多个小方法 |
| 复杂的控制流 | 使用 guard clauses 简化条件 |
| 硬编码的值 | 提取为常量或配置 |

### 前端
| 问题 | 解决方案 |
|------|--------|
| 组件过大 | 拆分子组件或提取 composables |
| Props drilling | 使用 Provide/Inject 或 store |
| 混乱的状态管理 | 统一使用 store actions |
| 重复的逻辑 | 提取为 composables |
| 性能问题 | 代码分割、懒加载、虚拟滚动 |

## 后续改进建议

在重构完成后：
1. 更新相关的 instructions（如 nestjs.instructions.md、vue.instructions.md）
2. 在代码审查中强调新的最佳实践
3. 定期代码审查，识别新的重构机会
4. 为团队成员分享重构的收获和教训

