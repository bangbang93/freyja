<template>
  <div class="freyja-article-list">
    <el-table :data="articles">
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="作者" prop="author.username"></el-table-column>
      <el-table-column label="发布时间" prop="createdAt"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete">删除</el-button>
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
      handleDelete() {

      }
    }
  }
</script>
