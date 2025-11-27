<template>
  <div class="tag-container">
    <el-tag
      v-for="(tag, index) in selectedTags"
      :key="index"
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

<script lang="ts">
import {defineComponent} from 'vue'
import {$emit} from '../utils/gogocodeTransfer'

export default defineComponent({
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
    onSelectTag(tagInput: {value: string} | string) {
      tagInput = typeof tagInput === 'object' ? tagInput.value : tagInput
      if (!tagInput) return
      $emit(this, 'tag-add', tagInput)
      this.tagInput = ''
    },
    searchTag(query: string, cb: (tags: {value: string}[]) => void) {
      cb(
        (this.tags as string[])
          .filter((tag: string) => tag.includes(query))
          .map((tag) => ({value: tag})),
      )
    },
    onClose(tag: string) {
      $emit(this, 'tag-close', tag)
    },
  },
})
</script>

<style lang="scss" scoped>
.tag {
  margin-left: 10px;
}
</style>
