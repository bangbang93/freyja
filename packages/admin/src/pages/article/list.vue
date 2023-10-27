<template>
  <div class="freyja-article-list">
    <el-table :data="articles">
      <el-table-column
        label="标题"
        prop="title"
      />
      <el-table-column
        label="作者"
        prop="author.username"
      />
      <el-table-column
        label="发布时间"
        prop="createdAt"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
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
    <el-button @click="onRerenderAllClick">
      重新渲染所有文章
    </el-button>
  </div>
</template>

<script lang="ts">
import {ElMessageBox} from 'element-plus'
import {defineComponent} from 'vue'

interface IArticle {
  _id: string
  content: string
  createdAt: string
}

export default defineComponent({
  name: 'FreyjaArticleList',
  data() {
    return {
      articles: [] as IArticle[],
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
      let resp = await this.$fetch.get('/api/admin/article', {
        page: this.currentPage,
      })
      const body = await resp.json() as IArticle[]
      body.forEach((article) => {
        article.createdAt = new Date(article.createdAt).toLocaleString()
      })
      this.articles = body
      resp = await this.$fetch.get('/api/admin/article/count')
      const body1 = await resp.json() as {count: number}
      this.total = body1.count
    },
    handleEdit(_: number, row: IArticle) {
      this.$router.push({
        name: 'article.edit',
        params: {
          id: row._id,
        },
      })
    },
    async handleDelete(_: number, row: IArticle) {
      try {
        const result = await ElMessageBox.confirm('确定删除', 'Freyja')
        if (result === 'confirm') {
          const resp = await this.$fetch.del(`/api/admin/article/${row._id}`)
          if (resp.status === 204) {
            await this.initData()
          }
        }
      } catch (e) {
        if (e !== 'cancel') {
          throw e
        }
      }
    },
    async onRerenderAllClick() {
      const resp = await this.$fetch.get('/api/admin/article/rerender-all')
      if (resp.status === 200) {
        await ElMessageBox.alert('渲染成功')
      } else {
        const body = await resp.json() as Record<string, string>
        await ElMessageBox.alert(body.message || body.msg)
      }
    },
  },
})
</script>
