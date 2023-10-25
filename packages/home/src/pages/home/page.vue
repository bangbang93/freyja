<template>
  <div>
    <div class="freyja-article-title">
      <h3>{{ page.title }}</h3>
    </div>
    <!--<div class="freyja-article-time">-->
    <!--<span><i class="el-icon-time"></i> {{page.createdAt | time}}</span>-->
    <!--</div>-->
    <hr class="split-line">
    <div class="freyja-article-content">
      <div
        ref="articleContent"
        class="freyja-article-content"
        v-html="page.html"
      />
    </div>
    <!--<hr>-->
    <!--<div class="freyja-article-comment">-->
    <!--<freyja-article-comment :comments="comments" :articleId="page._id"></freyja-article-comment>-->
    <!--</div>-->
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'HomePage',
  async asyncData({store, route}) {
    return store.dispatch('page/get', route.params.name)
  },
  data() {
    return {
      page: this.$store.state.page.page,
      comments: this.$store.state.comment.comments,
    }
  },
  mounted() {
    //      const pageName = this.$route.params.name
    //      this.$store.dispatch('comment/list', {pageId, page: 1})
    this.highlight()
  },
  updated() {
    this.highlight()
    import('lozad').then((lozad) => lozad.default().observe())
  },
  methods: {
    async highlight() {
      await import('prismjs/themes/prism-okaidia.css')
      const prismjs = await import('prismjs')
      prismjs.highlightAll()
    },
  },
})
</script>

<style scoped>
.split-line {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0)
  );
  width: 40%;
  margin-left: 0;
}
</style>
