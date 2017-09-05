<template>
  <div class="freyja-article-create">
    <el-form @submit="submit">
      <el-form-item label="标题">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item class="editor-container">
        <freyja-md-editor v-model="article.content" @attachAdd="onAttachAdd"></freyja-md-editor>
      </el-form-item>
      <el-form-item label="标签">
        <tag-editor :tags="this.tags" :selected-tags="article.tags" @tag-add="onTagAdd" @tag-close="onTagClose"></tag-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import FreyjaMdEditor from '../../../components/md-editor.vue'
  import TagEditor from '../../../components/tag-editor.vue'

  export default {
    components: {
      TagEditor,
      FreyjaMdEditor
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
          id:'',
        }
      }
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
          return this.$message({message: '获取tag失败', type: 'error'})
        }
        const body = await resp.json()
        this.tags = body.map((tag) => tag.title)
      },
      async initEdit({id}) {
        let resp = await this.$fetch.get(`/api/admin/article/${id}`)
        let article = await resp.json()
        article.tags = article.tags || []
        this.article = article
        this.edit.id = article._id
      },
      async submit() {
        const data = Object.assign({}, this.article)
        data.attachments = this.attachments
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
          this.$alert(body.msg, 'Freyja')
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
        let resp = await this.$fetch.put(`/api/admin/tag/${value}`)
        if (resp.status !== 201 && resp.status !== 200) {
          this.$message({message: '创建tag失败', type: 'error'})
        }
        this.article.tags.push(value)
      }
    }
  }
</script>
<style scoped lang="scss">
  .freyja-article-create {
    margin-left: 10px;
    margin-right: 10px;
  }
</style>
