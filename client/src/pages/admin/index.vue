<template>
  <div class="container">
    <el-menu mode="horizontal" theme="dark">
      <el-menu-item index="dashboard" :route="{name: 'dashboard'}">
        dashboard
      </el-menu-item>
      <el-menu-item index="newArticle" :route="{name: 'article.create'}">
        新文章
      </el-menu-item>
    </el-menu>
    <el-row class="page">
      <el-col :span="4" class="freyja-side-menu">
        <el-menu mode="vertical" theme="light" class="freyja-side-menu">
          <el-submenu index="article" title="文章">
            <el-menu-item index="newArticle" :route="{name: 'article.create'}" :disabled="false">新文章</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <router-view class="container"></router-view>
      </el-col>
    </el-row>

  </div>
</template>
<script>

  import ElMenuItem from '../../../../node_modules/element-ui/packages/menu/src/menu-item.vue'

  export default{
    components: {ElMenuItem},
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
