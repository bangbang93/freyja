<template>
  <div class="freyja-article-create">
    <el-form>
      <el-form-item label="标题">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item class="editor-container">
        <freyja-md-editor v-model="article.content"></freyja-md-editor>
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
        }
      }
    },
    methods: {
      async submit() {
        alert(this.article.content);
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
