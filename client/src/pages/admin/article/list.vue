<template>
  <div class="freyja-article-list">
    <el-table :data="articles">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="作者" prop="author.username"></el-table-column>
      <el-table-column label="发布时间" prop="createdAt"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        articles: [],
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      async initData() {
        let resp = await this.$fetch.get('/api/admin/article')
        let body = await resp.json()
        body.forEach(function (article) {
          article.createdAt = new Date(article.createdAt).toLocaleString()
        })
        this.articles = body
      },
      handleEdit($index, row) {
        this.$router.push({
          name: 'article.edit',
          params: {
            id: row._id
          }
        })
      },
      async handleDelete($index, row) {
        try {
          const result = await this.$confirm('确定删除', 'Freyja')
          if (result === 'confirm') {
            let resp = await this.$fetch.del(`/api/admin/article/${row._id}`)
            if (resp.status === 204) {
              await this.initData();
            }
          }
        } catch (e) {
          if (e !== 'cancel') {
            throw e
          }
        }
      }
    }
  }
</script>
