<template>
  <div class="container">
    <el-menu
      mode="horizontal"
      theme="dark"
      :router="true"
    >
      <el-menu-item
        index="front"
        @click="goHome"
      >
        首页
      </el-menu-item>
      <el-menu-item
        index="dashboard"
        :route="{name: 'dashboard'}"
      >
        dashboard
      </el-menu-item>
      <el-menu-item
        index="articleCreate"
        :route="{name: 'article.create'}"
      >
        新文章
      </el-menu-item>
    </el-menu>
    <el-row class="page">
      <el-col
        :span="4"
        class="freyja-side-menu"
      >
        <el-menu
          mode="vertical"
          theme="light"
          class="freyja-side-menu"
          :router="true"
        >
          <el-submenu index="article">
            <template slot="title">
              文章管理
            </template>
            <el-menu-item
              index="articleCreate"
              :route="{name: 'article.create'}"
            >
              新建文章
            </el-menu-item>
            <el-menu-item
              index="articleList"
              :route="{name: 'article.list'}"
            >
              文章列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="page">
            <template slot="title">
              页面管理
            </template>
            <el-menu-item
              index="pageCreate"
              :route="{name: 'page.create'}"
            >
              新建页面
            </el-menu-item>
            <el-menu-item
              index="pageList"
              :route="{name: 'page.list'}"
            >
              页面列表
            </el-menu-item>
          </el-submenu>
          <el-menu-item
            index="attachment"
            :route="{name: 'attachment.list'}"
          >
            附件管理
          </el-menu-item>
          <el-menu-item
            index="tag"
            :route="{name: 'tag.list'}"
          >
            标签管理
          </el-menu-item>
          <el-menu-item
            index="comment"
            :route="{name: 'comment.list'}"
          >
            评论管理
          </el-menu-item>
          <el-submenu index="import">
            <template slot="title">
              导入
            </template>
            <el-menu-item
              index="import"
              :route="{name: 'import.wordpress'}"
            >
              wordpress
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <router-view class="container" />
      </el-col>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'FreyjaAdminIndex',
  data() {
    return {
      current: 'dashboard',
    }
  },
  async mounted() {
    const resp = await this.$fetch.get('/api/admin/user/login')
    if (resp.status !== 200) {
      window.location.href = '/admin/login'
    }
  },
  methods: {
    goHome() {
      window.location.href = '/'
    },
  },
}
</script>
<style lang="scss">
  .freyja-side-menu {
    height: 100%;
  }
  .container,
  .page{
    height: 100%;
  }
</style>
