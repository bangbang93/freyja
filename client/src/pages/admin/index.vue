<template>
  <div class="container">
    <el-menu mode="horizontal" theme="dark" :router="true">
      <el-menu-item index="dashboard" :route="{name: 'dashboard'}">
        dashboard
      </el-menu-item>
      <el-menu-item index="articleCreate" :route="{name: 'article.create'}">
        新文章
      </el-menu-item>
    </el-menu>
    <el-row class="page">
      <el-col :span="4" class="freyja-side-menu">
        <el-menu mode="vertical" theme="light" class="freyja-side-menu" :router="true">
          <el-submenu index="article">
            <template slot="title">文章管理</template>
            <el-menu-item index="articleCreate" :route="{name: 'article.create'}" :disabled="false">新文章</el-menu-item>
            <el-menu-item index="articleList" :route="{name: 'article.list'}" :disabled="false">文章列表</el-menu-item>
          </el-submenu>
          <el-menu-item index="attachment" :route="{name: 'attachment.list'}">附件管理</el-menu-item>
          <el-menu-item index="tag" :route="{name: 'tag.list'}">标签管理</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <router-view class="container"></router-view>
      </el-col>
    </el-row>
  </div>
</template>
<script>

  export default{
    data(){
      return{
        current: 'dashboard'
      }
    }
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
