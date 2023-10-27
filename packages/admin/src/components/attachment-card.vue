<template>
  <el-card
    :body-style="{ margin: 'auto', textAlign: 'center', height: '130px' }"
    @click="view(attachment.path)"
  >
    <img
      :src="attachment.path"
      class="image"
    >
    <div>
      {{ attachment.filename }}
    </div>
    <time class="time">{{ time }}</time>
  </el-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'

interface IAttachment {
  _id: string
  path: string
  filename: string
  createdAt: string
}

export default defineComponent({
  name: 'FreyjaAttachmentCard',
  props: {
    attachment: {
      type: Object as PropType<IAttachment>,
      required: true,
    },
  },
  computed: {
    time() {
      return new Date(this.attachment.createdAt).toLocaleString()
    },
  },
  methods: {
    view(path: string) {
      window.open(path)
    },
  },
})
</script>

<style lang="scss" scoped>
.image {
  height: 100px;
  margin: auto;
}
.time {
  color: #ccc;
}
</style>
