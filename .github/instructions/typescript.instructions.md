---
applyTo: "**/*.ts,**/*.tsx"
description: "TypeScript 开发规范和最佳实践"
---

# TypeScript 开发指南

## 类型安全原则

- 启用 TypeScript 严格模式（strict mode），禁止隐式 any 类型
- 使用 `@typescript-eslint/no-explicit-any` 规则强制类型显式声明
- 优先使用接口（interface）定义数据结构，而非类型别名（type）
- 对所有函数参数和返回值明确标注类型，避免类型推断的歧义

## 类型定义组织

- 共享的 TypeScript 类型定义位于 `packages/api/` 目录
- 后端服务类型定义在 `packages/server/src/types.ts` 和具体模块的 `.dto.ts` 文件
- 前端类型定义在各自 package 的类型文件中（可通过 TypeScript path alias 引用）
- 使用 `Ref<T>` 类型表示 MongoDB 关联字段

## 函数与方法签名

- 异步操作始终返回 `Promise<T>` 而非回调形式
- 使用函数重载处理多态行为，避免联合类型参数
- 工厂函数和创建器模式中使用泛型保持类型灵活性
- 对象选项参数使用专用接口而非扁平参数列表

## 可空性与错误处理

- 区分 `null` 和 `undefined` 的语义：`null` 表示显式"无值"，`undefined` 表示"未设置"
- 使用可选链操作符 (`?.`) 和空值合并操作符 (`??`) 而非传统的 `&&` 和 `||` 逻辑
- 使用 `never` 类型标记不可达的代码路径和穷尽检查

## 枚举与常量

- 优先使用字符串字面类型联合而非字符串枚举（避免 JavaScript 编译后的额外代码）
- 数字常量使用 `const as const` 断言确保类型为字面值而非宽泛的 number
- 集中管理业务常量在专用的 `constants.ts` 文件

## 导入与导出

- 使用 ES modules 语法（`import/export`），避免 CommonJS（除非必要）
- 默认导出仅用于主要导出类/函数；其他情况使用命名导出便于重构
- 使用相对路径导入同包内文件，使用路径别名导入跨包文件

## 装饰器与元数据

- 后端使用 TypeScript 装饰器进行依赖注入和元数据标注（NestJS/mongoose-typescript）
- 装饰器应保持精简，复杂逻辑放在运行时方法中
- 在装饰器工厂中清晰标注参数类型和行为

