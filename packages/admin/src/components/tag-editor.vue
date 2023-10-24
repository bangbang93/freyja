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
      @keydown.enter="onSelectTag(tagInput)"
      @blur="hideInput"
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
import {$emit, $off, $on, $once} from '../../../../client/src/utils/gogocodeTransfer'
export default {
  name: 'FreyjaTagEditor',
  props: {
    tags: {
      type: Array,
      required: true,
    },
    selectedTags: {
      type: Array,
      required: true,
    },
  },
  emits: ['tag-add', 'tag-close'],
  data() {
    return {
      tagInput: '',
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
      $emit(this, 'tag-add', tagInput)
      this.tagInput = ''
    },
    searchTag(query, cb) {
      cb(
        this.tags
          .filter((tag) => tag.includes(query))
          .map((tag) => ({value: tag})),
      )
    },
    onClose(tag) {
      $emit(this, 'tag-close', tag)
    },
  },
}
</script>

<style lang="scss" scoped>
.tag {
  margin-left: 10px;
}
</style>
