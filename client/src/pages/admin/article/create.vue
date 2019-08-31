<template>
  <div class="freyja-article-create">
    <el-form @submit="submit">
      <!--<el-form-item style="float: right">-->
      <!--<el-button type="primary" @click="submit">发布</el-button>-->
      <!--</el-form-item>-->
      <el-form-item label="标题">
        <el-input v-model="article.title" />
      </el-form-item>
      <el-form-item class="editor-container">
        <freyja-md-editor
          v-model="article.content"
          @attachAdd="onAttachAdd"
        />
      </el-form-item>
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
import FreyjaMdEditor from '../../../components/admin/md-editor.vue'
import FreyjaTagEditor from '../../../components/admin/tag-editor.vue'

export default {
  components: {
    FreyjaTagEditor,
    FreyjaMdEditor,
  },
  data() {
    return {
      article: {
        title: '',
        content: '',
        tags: [],
      },
      attachments: [],
      tags: [],
      tagInput: '',
      edit: {
        id: '',
      },
      categories: [],
    }
  },
  computed: {
    categoriesTree() {
      return this.categories.map(walk)

      function walk(root) {
        const node = {
          label: root.name,
          id: root._id,
          children: null,
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
  beforeRouteLeave(to, from, next) {
    if (this.article.title || this.article.content) {
      this.$confirm('文章没有保存，是否离开')
        .then(() => next())
        .catch(() => next(false))
    } else {
      return next()
    }
  },
  methods: {
    async initData() {
      let resp = await this.$fetch.get('/api/admin/tag')
      if (resp.status !== 200) {
        this.$message({message: '获取tag失败', type: 'error'})
      }
      const body = await resp.json()
      this.tags = body.map((tag) => tag.title)
      resp = await this.$fetch.get('/api/category/tree')
      if (resp.status !== 200) {
        this.$message({message: '获取分类失败', type: 'error'})
      }
      this.categories = await resp.json()
    },
    async initEdit({id}) {
      const resp = await this.$fetch.get(`/api/admin/article/${id}`)
      const article = await resp.json()
      article.tags = article.tags || []
      this.article = article
      this.edit.id = article._id
      this.$refs.categories.setCheckedKeys(article.categories)
    },
    async submit() {
      const data = {...this.article}
      data.attachments = this.attachments
      data.categories = this.$refs.categories.getCheckedKeys()
      let resp
      if (this.edit.id) {
        resp = await this.$fetch.put(`/api/admin/article/${this.edit.id}`, data)
      } else {
        resp = await this.$fetch.post('/api/admin/article', data)
      }
      if (resp.status === 201 || resp.status === 200) {
        this.$alert('保存成功', 'Freyja')
        this.$router.push({name: 'article.list'})
      } else {
        const body = await resp.json()
        this.$alert(body.msg || body.message, 'Freyja')
      }
    },
    onAttachAdd({id}) {
      this.attachments.push(id)
    },
    onTagClose(tag) {
      const index = this.article.tags.indexOf(tag)
      this.article.tags.splice(index, 1)
    },
    async onTagAdd(value) {
      const resp = await this.$fetch.put(`/api/admin/tag/${value}`)
      if (resp.status !== 201 && resp.status !== 200) {
        this.$message({message: '创建tag失败', type: 'error'})
      }
      this.article.tags.push(value)
    },
  },
}
</script>
<style scoped lang="scss">
  .freyja-article-create {
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
