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
        <template slot-scope="scope">
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
<script>

export default {
  data() {
    return {
      articles   : [],
      pageSize   : 20,
      total      : 0,
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
      let body = await resp.json()
      body.forEach((article) => {
        article.createdAt = new Date(article.createdAt).toLocaleString()
      })
      this.articles = body
      resp = await this.$fetch.get('/api/admin/article/count')
      body = await resp.json()
      this.total = body.count
    },
    handleEdit($index, row) {
      this.$router.push({
        name  : 'article.edit',
        params: {
          id: row._id,
        },
      })
    },
    async handleDelete($index, row) {
      try {
        const result = await this.$confirm('确定删除', 'Freyja')
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
        this.$alert('渲染成功')
      } else {
        const body = await resp.json()
        this.$alert(body.message || body.msg)
      }
    },
  },
}
</script>
