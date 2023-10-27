<template>
  <div class="freyja-comment-list">
    <el-table :data="comments">
      <el-table-column
        label="作者"
        prop="publisher.name"
      />
      <el-table-column
        label="内容"
        prop="html"
      />
      <el-table-column
        label="发布时间"
        prop="createdAt"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="pageSize"
      :total="total"
      :current-page="currentPage"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

interface IComment {
  _id: string
  content: string
}

export default defineComponent({
  name: 'FreyjaCommentList',
  data() {
    return {
      comments: [] as IComment[],
      currentPage: 1,
      pageSize: 20,
      total: 0,
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      const resp = await this.$fetch.get('/api/admin/comment', {
        page: this.currentPage,
      })
      this.comments = await resp.json() as IComment[]
    },
    async handleDelete(_: number, row: IComment) {
      const resp = await this.$fetch.del(`/api/admin/comment/${row._id}`)
      if (resp.status === 204) {
        await this.initData()
      }
    },
  },
})
</script>
