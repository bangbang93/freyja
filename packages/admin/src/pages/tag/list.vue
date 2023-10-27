<template>
  <div class="freyja-tag-list">
    <freyja-tag-editor
      :tags="tags"
      :selected-tags="tags"
      @tag-add="onTagAdd"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import FreyjaTagEditor from '../../components/tag-editor.vue'

export default defineComponent({
  name: 'TagList',
  components: {
    FreyjaTagEditor,
  },
  data() {
    return {
      tags: [] as string[],
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      const resp = await this.$fetch.get('/api/admin/tag')
      const body = await resp.json() as {title: string}[]
      this.tags = body.map((tag) => tag.title)
    },
    async onTagAdd(title: string) {
      if (this.tags.includes(title)) return
      await this.$fetch.put(`/api/admin/tag/${title}`)
      this.tags.push(title)
    },
  },
})
</script>

<style lang="scss" scoped>
.freyja-tag-list {
  margin-top: 50px;
  margin-left: 50px;
}
</style>
