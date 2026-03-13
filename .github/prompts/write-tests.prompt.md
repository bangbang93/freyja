---
agent: 'agent'
model: Claude Sonnet 4
tools: ['codebase', 'githubRepo']
description: '为 Freyja 项目编写单元测试和集成测试'
---

# 测试编写快速指南

帮助开发者为 Freyja 的 NestJS 服务、Vue 组件和 API 端点编写高质量测试。

## 收集需求

1. **测试类型** — 单元测试、集成测试还是 API 端到端测试？
2. **被测试对象** — 具体的 Service、Component 还是 Controller？
3. **测试场景** — 覆盖哪些业务场景和错误路径？
4. **依赖关系** — 需要 Mock 哪些外部依赖？

## 生成测试代码

### NestJS 服务单元测试 (packages/server)

**文件命名**：`{name}.service.spec.ts`

**模板结构**：
```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { {Name}Service } from './{name}.service'
import { {Name}Model } from './{name}.model'

describe('{Name}Service', () => {
  let service: {Name}Service
  let mockModel: jest.Mocked<typeof {Name}Model>

  beforeEach(async () => {
    // Arrange: 初始化测试模块
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {Name}Service,
        {
          provide: getModelToken({Name}Model),
          useValue: {
            // Mock 模型方法
            findById: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<{Name}Service>({Name}Service)
    mockModel = module.get(getModelToken({Name}Model))
  })

  describe('应该创建', () => {
    it('service 实例应该被定义', () => {
      // Assert
      expect(service).toBeDefined()
    })
  })

  describe('findById', () => {
    it('应该根据 ID 返回 {Name} 实例', async () => {
      // Arrange
      const id = 'test-id'
      const expected = { _id: id, title: 'Test' }
      mockModel.findById.mockResolvedValue(expected)

      // Act
      const result = await service.findById(id)

      // Assert
      expect(result).toEqual(expected)
      expect(mockModel.findById).toHaveBeenCalledWith(id)
    })

    it('应该在 ID 不存在时抛出 NotFoundException', async () => {
      // Arrange
      mockModel.findById.mockResolvedValue(null)

      // Act & Assert
      await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundException)
    })
  })

  // 为每个 Service 方法编写测试...
})
```

**测试用例规范**：
- 使用 AAA 模式（Arrange、Act、Assert）分组注释
- 为成功路径和错误路径各编写测试
- Mock 所有外部依赖（数据库、其他服务）
- 验证异常类型和错误消息

### Vue 组件单元测试 (packages/home | packages/admin)

**文件命名**：`{name}.spec.ts` 或 `{name}.test.ts`

**模板结构**：
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import {Name}Component from './{name}.vue'

describe('{Name}Component', () => {
  let wrapper

  beforeEach(() => {
    // Arrange
    wrapper = mount({Name}Component, {
      props: {
        title: 'Test Title',
      },
      global: {
        stubs: {
          // Stub 子组件
          ChildComponent: true,
        },
      },
    })
  })

  it('应该正确渲染标题', () => {
    // Assert
    expect(wrapper.text()).toContain('Test Title')
  })

  it('应该在点击时发出事件', async () => {
    // Act
    await wrapper.find('button').trigger('click')

    // Assert
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  // 为每个交互和计算属性编写测试...
})
```

**测试用例规范**：
- 为 Props、Emits、computed、methods 各编写测试
- Mock 外部 API 调用和 Pinia store
- 避免测试依赖库的行为（Element Plus 组件已测试）
- 测试用户交互和状态变化

### API 端到端测试

**文件命名**：`{name}-api.e2e-spec.ts`

**模板结构**：
```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../app.module'

describe('{Name} API (e2e)', () => {
  let app: INestApplication
  let createdId: string

  beforeAll(async () => {
    // Arrange
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })

  afterAll(async () => {
    // 清理测试数据
    await app.close()
  })

  describe('POST /api/{name}', () => {
    it('应该创建新 {Name}', () => {
      // Act & Assert
      return request(app.getHttpServer())
        .post('/api/{name}')
        .send({
          title: 'New {Name}',
          content: 'Test content',
        })
        .expect(201)
        .then((res) => {
          createdId = res.body._id
          expect(res.body).toHaveProperty('title', 'New {Name}')
        })
    })

    it('应该在缺少必填字段时返回 400', () => {
      // Act & Assert
      return request(app.getHttpServer())
        .post('/api/{name}')
        .send({ title: 'Incomplete' }) // 缺少 content
        .expect(400)
    })
  })

  describe('GET /api/{name}/:id', () => {
    it('应该获取已创建的 {Name}', () => {
      // Act & Assert
      return request(app.getHttpServer())
        .get(`/api/{name}/${createdId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id', createdId)
        })
    })

    it('应该在 ID 无效时返回 404', () => {
      return request(app.getHttpServer())
        .get('/api/{name}/invalid-id')
        .expect(404)
    })
  })

  // 为每个端点编写测试...
})
```

**测试用例规范**：
- 测试所有 HTTP 方法和路径参数
- 验证状态码（201/200/404/400 等）
- 测试请求验证和错误响应
- 测试认证和授权（Admin 接口）

## 覆盖率要求

- 服务层：>80%
- 公开 API：>70%
- 组件：>60%（UI 交互可排除）

在 package.json 中配置覆盖率报告：
```json
{
  "scripts": {
    "test": "vitest",
    "test:cov": "vitest --coverage"
  }
}
```

## 最佳实践提示

- **隔离性**：每个测试独立运行，不依赖其他测试
- **清晰命名**：测试用例名称清晰描述被测内容和期望结果
- **Mock 粒度**：Mock 外部依赖，不 Mock 被测试的类
- **数据清理**：使用 `beforeEach` 初始化，`afterEach` 清理
- **异常测试**：为每个业务方法至少写一个错误路径测试

## 验证清单

- [ ] 导入语句完整（Test、mount、describe 等）
- [ ] Mock 设置正确，覆盖所有外部依赖
- [ ] 每个测试包含 Arrange、Act、Assert 三个阶段
- [ ] 异常情况有相应测试
- [ ] 测试名称使用中文，清晰描述
- [ ] 没有 `skip` 或 `todo` 的测试
- [ ] 覆盖率达到目标值

