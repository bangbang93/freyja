<template>
  <div class="freyja-tag-list">
    <freyja-tag-editor :tags="tags" :selected-tags="tags" @tag-add="onTagAdd"></freyja-tag-editor>
  </div>
</template>
<script>
  import FreyjaTagEditor from '../../../components/admin/tag-editor.vue'

  export default {
    components: {
      FreyjaTagEditor
    },
    data() {
      return {
        tags: []
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      async initData() {
        let resp = await this.$fetch.get('/api/admin/tag')
        let body = await resp.json()
        this.tags = body.map((tag) => tag.title)
      },
      async onTagAdd(title) {
        if (this.tags.includes(title)) return
        let resp = await this.$fetch.put(`/api/admin/tag/${title}`)
        this.tags.push(title)
      }
    }
  }
</script>
<style scoped lang="scss">
  .freyja-tag-list {
    margin-top: 50px;
    margin-left: 50px;
  }
</style>
