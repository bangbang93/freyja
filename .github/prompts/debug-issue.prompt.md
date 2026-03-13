---
agent: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'githubRepo', 'search', 'web/fetch']
description: '调试问题和分析错误'
---

# 问题调试指南

帮助开发者系统地分析和解决项目中的问题。

## 调试需求收集

如果用户未提供完整信息，请依次询问：

1. **问题症状** — 报错信息、异常行为还是性能问题？
2. **问题环境** — 开发模式还是生产模式？涉及哪个 package？
3. **复现步骤** — 如何才能复现问题？
4. **相关日志** — 是否有错误堆栈、浏览器控制台输出或服务端日志？

## 后端调试 (NestJS)

### 常见错误类型

#### 1. 数据库连接错误
**症状**：`MongooseError: Cannot connect to MongoDB`

**调试步骤**：
```bash
# 1. 检查 MongoDB 是否运行
mongo --version  # 确认已安装
mongod --version

# 2. 检查连接配置
# 查看 config/default/database.json 或 config/development/database.json
cat config/default/database.json

# 3. 测试连接
# 使用 mongo client 连接测试
mongo "mongodb://localhost:27017"

# 4. 检查 NestJS 日志
# 在 logger.js 配置 debug 级别查看连接细节
NODE_ENV=development npm run dev | grep -i mongo
```

**解决方案**：
- 确认 MongoDB URI 正确（含用户名、密码、数据库名）
- 确认 MongoDB 服务运行中
- 检查防火墙/网络连接

#### 2. 模块未注册错误
**症状**：`Unknown module reference 'ArticleModule'`

**调试步骤**：
```typescript
// 检查 freyja.module.ts
// packages/server/src/app/freyja.module.ts

// 确认模块已在 imports 数组中
@Module({
  imports: [
    ArticleModule, // ✓ 已注册
    // CommentModule, // ✗ 未注册
  ],
})
export class FreyjaModule {}
```

**解决方案**：
- 在 freyja.module.ts 的 imports 中添加新模块
- 确保模块的 @Module 装饰器正确配置
- 检查 Service 是否在 providers 中声明

#### 3. TypeError: Cannot read property 'xxx'
**症状**：在 Service 或 Controller 中访问未定义的属性

**调试步骤**：
```typescript
// ❌ 不安全
const slug = data.slug.toLowerCase() // 如果 data.slug 未定义会报错

// ✓ 安全做法 1：可选链
const slug = data.slug?.toLowerCase()

// ✓ 安全做法 2：默认值
const slug = data.slug || 'default'

// ✓ 安全做法 3：类型验证
if (!data.slug) throw new BadRequestException('slug 不能为空')
```

**使用调试器**：
```typescript
// 在 VS Code 中添加断点
service.findById(id) // 在此行设置断点
// 检查变量的实际值

// 或使用 console.log（开发模式）
console.log('data:', data)
console.log('type:', typeof data)
```

#### 4. N+1 查询问题
**症状**：一个请求发送了多个数据库查询（性能缓慢）

**识别方法**：
```bash
# 启用 Mongoose debug 模式
# 在 app.module.ts 中
const mongooseModule = MongooseModule.forRoot(
  process.env.MONGODB_URI,
  {
    debug: process.env.NODE_ENV !== 'production' // 开发模式启用
  }
)

# 观察日志中的查询语句
npm run dev | grep "Mongoose: "
```

**解决方案**：
```typescript
// ❌ 问题代码：N+1 查询
const articles = await this.articleModel.find()
for (const article of articles) {
  article.comments = await this.commentModel.find({ articleId: article._id })
}

// ✓ 解决方案：使用 populate
const articles = await this.articleModel.find().populate('comments')
```

### 调试工具

**使用 NestJS Logger**：
```typescript
import { Logger } from '@nestjs/common'

@Injectable()
export class ArticleService {
  private logger = new Logger(ArticleService.name)

  async findById(id: string) {
    this.logger.debug(`Finding article with id: ${id}`)
    // ...
    this.logger.error(`Failed to find article: ${error.message}`, error.stack)
  }
}
```

**HTTP 客户端测试**（使用 curl 或 Postman）：
```bash
# 测试 API 端点
curl -X GET http://localhost:3000/api/articles

# 测试 Admin 接口（需认证）
curl -X POST http://localhost:3000/api/admin/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}'

# 检查响应头
curl -i http://localhost:3000/api/articles
```

## 前端调试 (Vue)

### 常见错误类型

#### 1. hydration mismatch
**症状**：浏览器控制台警告 `Hydration mismatch`

**原因**：SSR 服务端渲染的 HTML 与客户端水合后的 DOM 不一致

**调试步骤**：
```vue
<script setup>
// ❌ 问题：在模板中使用浏览器 API（只在客户端可用）
const isMobile = window.innerWidth < 768

// ✓ 解决方案 1：在 onMounted 中使用
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
})

// ✓ 解决方案 2：或在 asyncData 中处理（仅限 home 包）
static async asyncData({ route }) {
  // 服务端执行，返回初始数据
  return {}
}
</script>
```

#### 2. asyncData 未执行
**症状**：页面初始数据为空，需要点击才能加载

**调试步骤**：
```typescript
// 检查组件是否正确定义 asyncData（仅适用 home 包）

export default {
  // ❌ 错误：asyncData 是实例方法，不是静态方法
  asyncData() { /* ... */ }

  // ✓ 正确：asyncData 必须是静态方法
  static asyncData() { /* ... */ }
}

// 检查 _default.page.server.ts 是否正确调用
// packages/home/src/_default.page.server.ts
```

**检查组件是否匹配**：
```bash
# 查看路由匹配情况
# 浏览器控制台中查看 Pinia DevTools
# 确认 store 中的数据是否被正确填充
```

#### 3. Pinia store 数据未同步
**症状**：修改 store 后，组件未更新；或多个组件间的数据不一致

**调试步骤**：
```typescript
// ❌ 问题：直接修改 state
store.articles = []
store.articles[0].title = 'New Title'

// ✓ 解决方案：使用 actions
await store.updateArticle(id, newData)

// 或使用 patchState
store.$patch({
  articles: newArray,
  currentArticle: newArticle
})
```

**使用 Pinia DevTools**（开发模式）：
```
浏览器 DevTools → Vue → Pinia
查看 state 的实时变化和 action 历史
```

#### 4. 组件未渲染或渲染异常
**症状**：页面空白或样式混乱

**调试步骤**：
```bash
# 1. 检查浏览器控制台错误
# 打开 Chrome DevTools → Console 标签页

# 2. 检查网络请求
# Network 标签 → 查看 API 响应和加载时间

# 3. 检查 Vue DevTools
# 浏览器扩展 Vue DevTools → 查看组件树和 props

# 4. 检查页面源码（SSR 内容）
# 右键 → 查看页面源代码 → 搜索关键词
```

**常见原因和修复**：
```vue
<script setup>
// ❌ 问题 1：未导入组件
// <MyComponent /> 无法渲染

// ✓ 修复：导入组件
import MyComponent from './MyComponent.vue'

// ❌ 问题 2：列表项未设置 key
<div v-for="item in items">{{ item.name }}</div>

// ✓ 修复：添加唯一 key
<div v-for="item in items" :key="item.id">{{ item.name }}</div>

// ❌ 问题 3：异步数据未加载完成
<div>{{ article.title }}</div> <!-- 初始为 undefined -->

// ✓ 修复：添加加载状态
<div v-if="loading">加载中...</div>
<div v-else>{{ article.title }}</div>
</script>
```

### 性能调试

**使用 Chrome DevTools Performance**：
```
1. 打开 DevTools → Performance 标签
2. 点击 "Record" 开始录制
3. 执行用户操作（点击、滚动等）
4. 停止录制
5. 分析：
   - FCP（First Contentful Paint）
   - LCP（Largest Contentful Paint）
   - 是否有长任务（>50ms）
```

**识别性能瓶颈**：
```typescript
// 使用 performance API
const start = performance.now()
// ... 执行操作
const end = performance.now()
console.log(`操作耗时：${end - start}ms`)

// 或使用 console.time
console.time('operation')
// ... 执行操作
console.timeEnd('operation')
```

## SSR 调试

### 调试 SSR 缓存

```typescript
// 在浏览器中检查缓存状态
// Network 标签 → 选择页面请求 → Response Headers

// 查看 x-ssr-cache header
// 值为 'hit' 表示命中缓存，'miss' 表示未命中

// 查看 x-ssr-time header（渲染耗时）
```

### 调试 SSR 状态序列化

```typescript
// 检查序列化的状态
// 页面源代码 → 搜索 __INITIAL_STATE__

// 应该看到类似这样的脚本：
// <script id="__INITIAL_STATE__" type="application/json">
//   {"article":{"articles":[],...}}
// </script>
```

## 常用调试命令

```bash
# 开启详细日志
DEBUG=* npm run dev

# 针对特定模块的日志
DEBUG=article:* npm run dev

# 使用 Node.js 调试器
node --inspect=9229 packages/server/dist/main.js
# 然后在 Chrome 中打开 chrome://inspect

# 监控内存使用
node --expose-gc packages/server/dist/main.js
# 在代码中调用 global.gc() 手动触发垃圾回收
```

## 问题排查清单

### 后端问题
- [ ] 检查数据库连接和配置
- [ ] 查看服务端日志（logger 配置）
- [ ] 验证 API 响应（使用 curl 或 Postman）
- [ ] 检查数据库查询（启用 Mongoose debug）
- [ ] 验证认证和授权

### 前端问题
- [ ] 打开浏览器 DevTools → Console 查看错误
- [ ] 检查 Network 标签的 API 请求和响应
- [ ] 使用 Vue DevTools 检查组件状态
- [ ] 检查 SSR 源码中的初始状态
- [ ] 性能分析使用 Chrome DevTools Performance

### 通用
- [ ] 检查环境变量配置（.env 文件）
- [ ] 清理 node_modules 和 dist（`rm -rf node_modules && npm install`）
- [ ] 检查依赖版本（package-lock.json）
- [ ] 查看最近的代码变更
- [ ] 隔离问题：禁用或注释可疑代码

## 获取帮助

如果上述步骤未能解决问题：
1. 收集完整的错误堆栈和日志
2. 提供复现步骤
3. 提交带标签的 Issue
4. 参考 `.github/instructions/code-review.instructions.md` 寻求审查者帮助

