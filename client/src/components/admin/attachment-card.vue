<template>
  <el-card :body-style="{margin: 'auto', textAlign: 'center', height: '130px'}" @click.native="view(attachment.path)">
    <img :src="attachment.path" class="image">
    <div>
      {{attachment.filename}}
    </div>
    <time class="time">{{time}}</time>
  </el-card>
</template>
<script>
  export default {
    name: 'FreyjaAttachmentCard',
    props: {
      attachment: Object,
    },
    computed: {
      time() {
        return new Date(this.attachment.createdAt).toLocaleString()
      }
    },
    methods: {
      view(path) {
        window.location.href = path
      }
    }
  }
</script>
<style scoped lang="scss">
  .image {
    height: 100px;
    margin: auto;
  }
  .time {
    color: #ccc
  }
</style>
