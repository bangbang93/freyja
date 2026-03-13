---
applyTo: "packages/**/*.ts,packages/**/*.vue"
description: "性能优化指南"
---

# 性能优化指南

## 后端性能优化

### 数据库查询优化
- 使用 MongoDB 索引优化查询，为频繁查询的字段创建索引
- 避免全表扫描，使用 lean() 方法减少文档大小（当不需要修改文档时）
- 使用分页处理大量数据，而非一次性加载
- 使用 select() 方法仅查询需要的字段，减少网络传输

### 缓存策略
- SSR 页面使用 LRU 缓存（30s TTL，最多 1000 条），cache key 为 `req.url`
- 排除缓存的路径：`/api`、`/admin`、`/feed`
- 数据库查询结果可使用 Redis 缓存，设置合理的 TTL
- 缓存失效时机：数据修改（create、update、delete）时清理相关缓存

### 异步与并发
- 利用 Node.js 事件循环，避免同步阻塞操作
- 使用 Promise.all() 并发执行独立的异步操作
- 数据库操作超时配置合理的 timeout，防止长时间挂起
- 异步错误使用 try-catch 捕获，避免未捕获的 Promise rejection

### 响应优化
- API 响应使用 gzip 压缩（Express middleware）
- 减少响应体大小：仅返回必要的字段，避免深层嵌套对象
- 使用 HTTP 缓存头（Cache-Control、ETag）减少重复请求

## 前端性能优化

### 包体积优化
- 使用动态 import() 实现路由级别的代码分割
- 避免导入未使用的库，定期审查依赖
- 生产构建启用 tree-shaking 和 minification
- 使用 CDN 加载第三方库（如 Element Plus），减少构建体积

### 首屏加载
- 首屏关键内容使用 SSR 服务端渲染
- 必要的 CSS 内联到 HTML 头部，避免渲染阻塞
- 延迟非关键的 JavaScript 加载：使用 `defer` 或 `async` 属性
- 预连接第三方域名：`<link rel="preconnect" href="...">`

### 运行时性能
- Vue 组件使用 computed 和 watch 缓存派生状态，避免重复计算
- 虚拟滚动用于长列表（`v-virtual-scroller` 或类似库）
- 防抖和节流处理频繁事件（输入、滚动、resize）
- 避免在模板中执行方法调用，改用 computed 属性

### 图片优化
- 使用 WebP 或现代格式，兼容旧浏览器使用 fallback
- 图片懒加载使用 lozad.js（已集成到 Markdown 渲染）
- 响应式图片：不同屏幕宽度使用不同尺寸
- 压缩图片文件大小，去除不必要的 metadata

### 样式与渲染
- 避免过深的 CSS 选择器，降低匹配复杂度
- 使用 CSS Grid 或 Flexbox 替代 float/position 布局
- 防止布局抖动（layout thrashing）：批量读写 DOM
- GPU 加速：使用 `transform` 和 `opacity` 做动画而非修改 width/height

## 监控与度量

### 性能指标
- 首字节时间（TTFB）：服务端响应性能
- 首内容绘制（FCP）：首个内容出现
- 最大内容绘制（LCP）：主要内容加载完成
- 累积布局偏移（CLS）：视觉稳定性
- 使用 Web Vitals 库监控这些指标

### 日志和告警
- 记录慢查询（>100ms）和慢 API 响应（>500ms）
- 监控数据库连接池和 Redis 缓存命中率
- 前端错误追踪和性能监控使用专用工具
- 设置告警，当性能指标超出阈值时通知开发团队

## 工具与实践

- 使用 Chrome DevTools Performance 和 Network 标签分析性能
- 定期运行 Lighthouse 审计，改进性能评分
- 压力测试和负载测试评估生产环境容量
- 持续集成中集成性能测试，防止性能回归

