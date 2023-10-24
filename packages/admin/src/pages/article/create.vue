<template>
  <div class="freyja-article-create">
    <el-form @submit="submit">
      <!--<el-form-item style="float: right">-->
      <!--<el-button type="primary" @click="submit">发布</el-button>-->
      <!--</el-form-item>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题">
            <el-input
              v-model="article.title"
              placeholder="请输入标题"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名">
            <el-input
              v-model="article.slug"
              placeholder="请输入别名"
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

<script lang="ts">
import {ElMessageBox, ElTree} from 'element-plus'
import {defineComponent} from 'vue'
import {RouteParams} from 'vue-router'
import FreyjaMdEditor from '../../components/md-editor.vue'
import FreyjaTagEditor from '../../components/tag-editor.vue'

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

export default defineComponent({
  name: 'FreyjaArticleCreate',
  components: {
    FreyjaTagEditor,
    FreyjaMdEditor,
  },
  beforeRouteLeave(_, __, next) {
    if (this.article.title || this.article.content) {
      ElMessageBox.confirm('文章没有保存，是否离开')
        .then(() => next())
        .catch(() => next(false))
    } else {
      return next()
    }
  },
  data() {
    return {
      article: {
        title: '',
        content: '',
        slug: '',
        tags: [] as string[],
        categories: [] as string[],
        attachments: [] as string[],
      },
      attachments: [] as string[],
      tags: [] as string[],
      tagInput: '',
      edit: {
        id: '',
      },
      categories: [] as CategoryResDto[],
    }
  },
  computed: {
    categoriesTree() {
      return this.categories.map(walk)

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
    },
  },
  mounted() {
    this.initData()
    if (this.$route.name === 'article.edit') {
      this.initEdit(this.$route.params)
    }
  },
  methods: {
    async initData() {
      let resp = await this.$fetch.get('/api/admin/tag')
      if (resp.status !== 200) {
        await ElMessageBox.alert('获取tag失败', 'Freyja', {type: 'error'})
      }
      const body = await resp.json() as TagResDto[]
      this.tags = body.map((tag: TagResDto) => tag.title)
      resp = await this.$fetch.get('/api/category/tree')
      if (resp.status !== 200) {
        await ElMessageBox.alert('获取分类失败', 'Freyja', {type: 'error'})
      }
      this.categories = await resp.json() as CategoryResDto[]
    },
    async initEdit(routeParams: RouteParams) {
      const resp = await this.$fetch.get(`/api/admin/article/${routeParams['id'].toString()}`)
      const article = await resp.json() as AttachmentResDto
      article.tags = article.tags || []
      this.article = article
      this.edit.id = article._id
      ;(this.$refs.categories as typeof ElTree).setCheckedKeys(article.categories)
    },
    async submit() {
      const data = {...this.article}
      data.attachments = this.attachments
      data.categories = (this.$refs.categories as typeof ElTree).getCheckedKeys() as string[]
      let resp
      if (this.edit.id) {
        resp = await this.$fetch.put(`/api/admin/article/${this.edit.id}`, data)
      } else {
        resp = await this.$fetch.post('/api/admin/article', data)
      }
      if (resp.status === 201 || resp.status === 200) {
        await ElMessageBox.alert('保存成功', 'Freyja')
        await this.$router.push({name: 'article.list'})
      } else {
        const body = await resp.json() as {message?: string; msg?: string}
        await ElMessageBox.alert(body.msg || body.message, 'Freyja')
      }
    },
    onAttachAdd({id}: {id: string}) {
      this.attachments.push(id)
    },
    onTagClose(tag: string) {
      const index = this.article.tags.indexOf(tag)
      this.article.tags.splice(index, 1)
    },
    async onTagAdd(value: string) {
      const resp = await this.$fetch.put(`/api/admin/tag/${value}`)
      if (resp.status !== 201 && resp.status !== 200) {
        await ElMessageBox.alert('添加tag失败', 'Freyja', {type: 'error'})
      }
      this.article.tags.push(value)
    },
  },
})
</script>

<style lang="scss" scoped>
.freyja-article-create {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
