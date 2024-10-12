<template>
  <div class="freyja-article-create">
    <el-form @submit="submit">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题">
            <el-input
              v-model="article.title"
              placeholder="请输入标题"
              @blur="onTitleBlur"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名">
            <el-input
              v-model="article.slug"
              placeholder="请输入别名"
              @blur="onSlugBlur"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item class="editor-container">
            <freyja-md-editor
              v-model="article.content"
              @attachAdd="onAttachAdd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-tree
            ref="categories"
            :data="categoriesTree"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
          />
        </el-col>
        <el-col
          :span="15"
          :offset="1"
        >
          <el-form-item label="标签">
            <freyja-tag-editor
              :tags="tags"
              :selected-tags="article.tags"
              @tag-add="onTagAdd"
              @tag-close="onTagClose"
            />
          </el-form-item>
          <el-form-item style="margin-top: 10px">
            <el-button
              type="primary"
              @click="submit"
            >
              发布
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import {onBeforeRouteLeave, RouteParams, useRoute, useRouter} from 'vue-router'
import {ElMessageBox, ElTree} from 'element-plus'
import FreyjaMdEditor from '../../components/md-editor.vue'
import FreyjaTagEditor from '../../components/tag-editor.vue'
import limax from 'limax'

interface Tree {
  id: string
  label: string
  children?: Tree[]
}

class CategoryResDto {
  _id!: string
  name!: string
  children!: CategoryResDto[]
}

class TagResDto {
  _id!: string
  title!: string
}

class AttachmentResDto {
  _id!: string
  tags!: string[]
  categories!: string[]
  title!: string
  slug!: string
  attachments!: string[]
  content!: string
}

const route = useRoute()
const router = useRouter()
const article = reactive({
  title: '',
  content: '',
  slug: '',
  tags: [] as string[],
  categories: [] as string[],
  attachments: [] as string[],
})
const attachments = ref<string[]>([])
const tags = ref<string[]>([])
const edit = reactive({id: ''})
const categories = ref<InstanceType<typeof ElTree> | null>(null)
const categoryItems = ref<CategoryResDto[]>([])
const autoSlug = ref(true)

onBeforeRouteLeave((_, __, next) => {
  if (article.title || article.content) {
    ElMessageBox.confirm('文章没有保存，是否离开')
      .then(() => next())
      .catch(() => next(false))
  } else {
    return next()
  }
})

const categoriesTree = computed(() => {
  return categoryItems.value.map(walk)

  function walk(root: CategoryResDto): Tree {
    const node: Tree = {
      label: root.name,
      id: root._id,
      children: [],
    }
    if (root.children) {
      node.children = root.children.map(walk)
    }
    return node
  }
})

async function initData(): Promise<void> {
  let resp = await fetch('/api/admin/tag')
  if (resp.status !== 200) {
    await ElMessageBox.alert('获取tag失败', 'Freyja', {type: 'error'})
  }
  const body = await resp.json() as TagResDto[]
  tags.value = body.map((tag: TagResDto) => tag.title)
  resp = await fetch('/api/category/tree')
  if (resp.status !== 200) {
    await ElMessageBox.alert('获取分类失败', 'Freyja', {type: 'error'})
  }
  categoryItems.value = await resp.json() as CategoryResDto[]
}

async function initEdit(routeParams: RouteParams): Promise<void> {
  const resp = await fetch(`/api/admin/article/${routeParams['id'].toString()}`)
  const articleData = await resp.json() as AttachmentResDto
  articleData.tags = articleData.tags || []
  Object.assign(article, articleData)
  edit.id = articleData._id
  ;(
    categories.value as InstanceType<typeof ElTree>
  ).setCheckedKeys(articleData.categories)
}

async function submit(): Promise<void> {
  const data = {...article}
  data.attachments = attachments.value
  data.categories = (
    categories.value as InstanceType<typeof ElTree>
  ).getCheckedKeys() as string[]
  let resp
  if (edit.id) {
    resp = await fetch(`/api/admin/article/${edit.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
  } else {
    resp = await fetch('/api/admin/article', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
  }
  if (resp.status === 201 || resp.status === 200) {
    await ElMessageBox.alert('保存成功', 'Freyja')
    await router.push({name: 'article.list'})
  } else {
    const body = await resp.json() as { message?: string; msg?: string }
    await ElMessageBox.alert(body.msg || body.message, 'Freyja')
  }
}

function onAttachAdd({id}: { id: string }): void {
  attachments.value.push(id)
}

function onTagClose(tag: string): void {
  const index = article.tags.indexOf(tag)
  article.tags.splice(index, 1)
}

async function onTagAdd(value: string): Promise<void> {
  const resp = await fetch(`/api/admin/tag/${value}`, {method: 'PUT'})
  if (resp.status !== 201 && resp.status !== 200) {
    await ElMessageBox.alert('添加tag失败', 'Freyja', {type: 'error'})
  }
  article.tags.push(value)
}

function onTitleBlur(): void {
  if (autoSlug.value) {
    article.slug = limax(article.title)
  }
}

function onSlugBlur(): void {
  autoSlug.value = !article.slug
  onTitleBlur()
}

onMounted(async () => {
  await initData()
  if (route.name === 'article.edit') {
    await initEdit(route.params)
  }
})
</script>

<style lang="scss" scoped>
.freyja-article-create {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
