---
applyTo: "packages/home/src/**/*.vue,packages/admin/src/**/*.vue"
description: "Vue 3 前端开发规范"
---

# Vue 3 前端开发指南

## 单文件组件结构

- 使用 `<template>`、`<script setup>`、`<style scoped>` 三部分组织组件
- `<script setup>` 中使用 TypeScript 明确标注 props、emits 和暴露的方法
- 样式使用 `scoped` 确保隔离，避免全局污染
- 复杂业务逻辑提取为可组合函数（composables）而非写在组件中

## Props 与 Emits 设计

- 使用 TypeScript interface 为 props 定义类型和默认值
- Props 应保持最小化，仅传递必要的数据
- 使用 `emit` 处理子组件向父组件的事件，避免直接修改 props
- 自定义事件名使用 kebab-case，如 `@update-item`

## 组件通信

- 父子通信使用 Props（向下）和 Emit（向上）
- 跨组件状态管理使用 Pinia store（见下节）
- 避免深层 props 钻透，使用 Provide/Inject 处理共享上下文

## Pinia Store 集成

- 在 `packages/home/src/store/` 或 `packages/admin/src/store/` 定义 stores
- 每个业务域（article、comment、home 等）对应一个 store 文件
- 使用 `defineStore` 采用组合式 API 定义 state、getters、actions
- State 存储原始数据，Getters 提供衍生数据，Actions 封装业务操作和 API 调用

## Home 包的 SSR 数据预取（asyncData）

**SSR 数据流程**：
1. 路由匹配后，收集所有匹配组件
2. 调用各组件的静态方法 `asyncData({ store, route, origin })`（仅在服务端执行）
3. 返回的数据存入相应 Pinia store
4. 服务端渲染 HTML，通过 `@nuxt/devalue` 序列化 store 状态到 `<script id="__INITIAL_STATE__">`
5. 客户端接收并水合 store，后续路由导航由 Vue Router 接管

**asyncData 实现要求**：
- 定义为组件的静态方法：`static async asyncData({ store, route, origin })`
- 只能访问路由信息和 store，不能访问组件实例（`this`）
- 返回值可选，主要副作用是修改 store 状态
- 支持 Promise，框架等待所有 asyncData 完成后再渲染

## Admin 表单特殊处理

- 使用 Element Plus UI 组件库构建表单界面
- 使用 `limax` 库自动生成 URL slug（例：`article.slug = limax(article.title)`）
- 实现 `autoSlug` 标志：用户手动编辑 slug 后自动停用自动转换
- 使用 `onBeforeRouteLeave` 钩子检测未保存修改，弹出确认框提示用户

## API 请求

- 使用原生 `fetch` API，不依赖 axios
- 封装 fetch 调用在 `utils/fetch.ts` 中，提供统一的错误处理和请求/响应拦截
- 请求/响应使用共享的 TypeScript 类型（来自 `packages/api/`）
- 在组件的 `onMounted` 钩子或 `asyncData` 中调用，确保类型安全

## 样式与主题

- 使用 SCSS 预处理（见 `packages/home/src/scss/style.scss`）
- 定义项目全局 CSS 变量，如色彩、字体、间距
- 组件样式使用 `scoped` 限制作用域
- 响应式设计优先考虑移动设备（mobile-first）

## 路由与导航

- 路由配置在 `packages/home/src/router/index.ts` 或 Vike 的 `.page.route.ts` 文件
- 使用路由懒加载优化首屏加载时间
- 动态路由段（如 `/article/[id]`）对应 `pages/article/[id].page.vue`
- 使用 `useRouter` 和 `useRoute` composables 访问路由信息

## Vike SSR 框架集成

- Vike（原 vite-plugin-ssr）是 SSR 的核心框架，集成在 NestJS server 中
- Page 文件放在 `packages/home/src/pages/` 目录，使用 `.page.vue` 后缀
- Server-side hooks 在 `_default.page.server.ts` 中定义，用于全局 SSR 逻辑
- 避免在 Page 组件中访问浏览器只有的 API（window、document），或包裹在 `onMounted` 中

## 性能优化

- 使用 `v-if` 而非 `v-show` 进行条件渲染（避免 DOM 堆积）
- 图片懒加载使用 lozad.js（已集成到 Markdown 渲染）
- 避免在模板中执行复杂计算，使用 computed 或 getter 缓存
- 使用 `key` 属性帮助 Vue 跟踪列表渲染，特别是列表排序/过滤变更时

## 代码复用

- 通用逻辑提取为 composables（放在 `composables/` 目录）
- 通用 UI 组件放在 `components/` 目录，按模块分组
- 工具函数放在 `utils/` 目录，并导出 TypeScript 类型

