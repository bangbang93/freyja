<template>
  <div>
    <el-row>
      <el-upload
        action="/api/admin/attachment"
        :with-credentials="true"
        type="drag"
        :on-success="initData"
        class="freyja-attachment-upload"
      >
        <el-icon><el-icon-upload /></el-icon>
        <div class="">
          将文件拖到此处，或<em>点击上传</em>
        </div>
      </el-upload>
    </el-row>
    <el-row>
      <el-col
        v-for="attachment in attachments"
        :key="attachment._id"
        :span="6"
      >
        <freyja-attachment-card
          class="freyja-attachment-card"
          :attachment="attachment"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-pagination
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
      />
    </el-row>
  </div>
</template>

<script lang="ts">
import {Upload as ElIconUpload} from '@element-plus/icons-vue'
import {Component, defineComponent} from 'vue'
import FreyjaAttachmentCard from '../../components/attachment-card.vue'

interface IAttachment {
  _id: string
  path: string
  filename: string
  createdAt: string
}

export default defineComponent({
  name: 'FreyjaAttachmentList',
  components: {
    FreyjaAttachmentCard,
    ElIconUpload: ElIconUpload as Component,
  },
  data() {
    return {
      attachments: [] as IAttachment[],
      pageSize: 20,
      total: 0,
      currentPage: 1,
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      let resp = await this.$fetch.get('/api/admin/attachment')
      const body = await resp.json() as IAttachment[]
      this.attachments = body
      resp = await this.$fetch.get('/api/admin/attachment/count')
      const body1 = await resp.json() as {count: number}
      this.total = body1.count
    },
  },
})
</script>

<style lang="scss" scoped>
.freyja-attachment-card {
  width: 90%;
  margin: 10px auto;
}
.freyja-attachment-upload {
  border: solid #ccc 1px;
  border-radius: 2px;
  height: 50px;
  width: 300px;
  margin: 20px auto;
  text-align: center;
}
</style>
