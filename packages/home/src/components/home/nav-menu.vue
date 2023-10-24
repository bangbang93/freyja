<template>
  <div class="freyja-nav-menu">
    <img
      src="../../assets/avatar.jpg"
      class="freyja-my-avatar freyja-avatar-animation"
      alt="avatar"
    >
    <hr>
    <div class="freyja-nav-menu-item-group">
      <div class="freyja-nav-menu-item no-link">
        <router-link :to="{ name: 'home' }">
          <i class="fa fa-home" />&nbsp;首页
        </router-link>
      </div>
      <hr>
      <!--<div class="freyja-nav-menu-item no-link">-->
      <!--<freyja-menu-category><i class="fa fa-sitemap"></i>&nbsp;分类</freyja-menu-category>-->
      <!--</div>-->
      <!--<hr>-->
      <!--<div class="freyja-nav-menu-item no-link">-->
      <!--<router-link :to="{name: 'tag'}"><i class="fa fa-tags"></i>&nbsp;标签</router-link>-->
      <!--</div>-->
      <!--<hr>-->
      <div class="freyja-nav-menu-item no-link">
        <router-link :to="{ name: 'link' }">
          <i class="fa fa-link" />&nbsp;友联
        </router-link>
      </div>
      <hr>
      <div class="freyja-nav-menu-item no-link">
        <router-link to="/page/i">
          <i class="fa fa-id-card" />&nbsp;我
        </router-link>
      </div>
      <hr>
      <div class="freyja-nav-menu-item no-link">
        <label><i class="fa fa-search" /> 搜索
          <input
            v-model="keyword"
            class="search-box"
            title="搜索"
            @keydown.enter="onSearch"
          ></label>
      </div>
      <hr>
    </div>
    <div class="me">
      @bangbang93
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'FreyjaNavMenu',
  data() {
    return {
      keyword: '',
    }
  },
  methods: {
    async onSearch() {
      return this.$router.push({
        name: 'search',
        query: {
          keyword: this.keyword,
          page: 1,
        },
      })
    },
  },
})
</script>

<style lang="scss">
.freyja-nav-menu {
  $avatar-size: 200px;
  $padding-top: 30px;
  $top-color: #033440;
  $bottom-color: #011a20;
  text-align: center;
  padding-top: $padding-top;
  background-color: $top-color;
  height: 100%;
  $margin-bottom: $padding-top - 8px;
  .freyja-my-avatar {
    height: $avatar-size;
    width: $avatar-size;
    border-radius: 50%;
    margin: auto auto $margin-bottom;
  }
  .freyja-nav-menu-item-group {
    height: calc(
      100% - #{$avatar-size + $padding-top + $margin-bottom} - 2 * 8px - 1px
    );
    background-image: linear-gradient(to bottom, $top-color, $bottom-color);
    color: #cdf3fd;
  }
  .me {
    position: fixed;
    bottom: 5px;
    text-align: center;
    width: 16.66667%;
  }
  .search-box {
    background: transparent;
    color: #cdf3fd;
    border: none;
  }
}
</style>
