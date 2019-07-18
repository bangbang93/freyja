<template>
  <div class="tag-container">
    <el-tag
      v-for="tag in selectedTags"
      :key="tag"
      :closable="true"
      :close-transition="true"
      class="tag"
      @close="onClose"
    >
      {{ tag }}
    </el-tag>
    <el-autocomplete
      v-if="isInputVisible"
      v-model="tagInput"
      size="mini"
      :fetch-suggestions="searchTag"
      class="input-new-tag"
      @select="onSelectTag"
      @keydown.native.enter="onSelectTag(tagInput)"
      @blur.native="hideInput"
    />
    <el-button
      v-if="!isInputVisible"
      size="small"
      class="button-new-tag"
      @click="showInput"
    >
      + New Tag
    </el-button>
  </div>
</template>
<script>
export default {
  name : 'FreyjaTagEditor',
  props: {
    tags: {
      type    : Array,
      required: true,
    },
    selectedTags: {
      type    : Array,
      required: true,
    },
  },
  data() {
    return {
      tagInput      : '',
      isInputVisible: false,
    }
  },
  methods: {
    showInput() {
      this.isInputVisible = true
    },
    hideInput() {
      this.isInputVisible = false
    },
    onSelectTag(tagInput) {
      tagInput = tagInput.value || tagInput
      if (!tagInput) return
      this.$emit('tag-add', tagInput)
      this.tagInput = ''
    },
    searchTag(query, cb) {
      cb(this.tags.filter((tag) => tag.includes(query)).map((tag) => ({value: tag})))
    },
    onClose(tag) {
      this.$emit('tag-close', tag)
    },
  },
}
</script>
<style scoped lang="scss">
  .tag {
    margin-left: 10px;
  }
</style>
