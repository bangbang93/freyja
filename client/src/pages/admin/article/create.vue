<template>
  <div class="freyja-article-create">
    <el-form @submit="submit">
      <el-form-item label="标题">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item class="editor-container">
        <freyja-md-editor v-model="article.content" @attachAdd="onAttachAdd"></freyja-md-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import FreyjaMdEditor from '../../../components/md-editor.vue'

  export default {
    components: {FreyjaMdEditor},
    data() {
      return {
        article: {
          title: '',
          content: '',
          tags: [],
        },
        attachments: [],
      }
    },
    methods: {
      async submit() {
        const data = Object.assign({}, this.article)
        data.attachments = this.attachments
        let resp = await this.$fetch.post('/api/admin/article', data)
        if (resp.status === 201) {
          this.$alert('保存成功', 'Freyja')
        } else {
          const body = await resp.json()
          this.$alert(body.msg, 'Freyja')
        }
      },
      onAttachAdd({id}) {
        this.attachments.push(id)
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
