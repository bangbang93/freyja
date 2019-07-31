<template>
  <div class="freyja-article-create">
    <el-form @submit="submit">
      <el-form-item label="标题">
        <el-input v-model="page.title" />
      </el-form-item>
      <el-form-item class="editor-container">
        <freyja-md-editor
          v-model="page.content"
          @attachAdd="onAttachAdd"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="page.name" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit"
        >
          发布
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import FreyjaMdEditor from '../../../components/admin/md-editor.vue'

export default {
  components: {
    FreyjaMdEditor,
  },
  data() {
    return {
      page: {
        title: '',
        content: '',
        name: '',
      },
      attachments: [],
      edit: {
        id: '',
      },
    }
  },
  mounted() {
    if (this.$route.name === 'page.edit') {
      this.initEdit(this.$route.params)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.article.title || this.article.content) {
      this.$confirm('文章没有保存，是否离开')
        .then(() => next())
        .catch(() => next(false))
    } else {
      next()
    }
  },
  methods: {
    async initEdit({id}) {
      const resp = await this.$fetch.get(`/api/admin/page/${id}`)
      const page = await resp.json()
      this.page = page
      this.edit.id = page._id
    },
    async submit() {
      const data = {...this.page}
      data.attachments = this.attachments
      let resp
      if (this.edit.id) {
        resp = await this.$fetch.put(`/api/admin/page/${this.edit.id}`, data)
      } else {
        resp = await this.$fetch.post('/api/admin/page', data)
      }
      if (resp.status === 201 || resp.status === 200) {
        this.$alert('保存成功', 'Freyja')
        this.$router.push({name: 'page.list'})
      } else {
        const body = await resp.json()
        this.$alert(body.msg, 'Freyja')
      }
    },
    onAttachAdd({id}) {
      this.attachments.push(id)
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
