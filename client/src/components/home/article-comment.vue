<template>
  <div class="freyja-article-comment">
    <div class="freyja-article-comment-buttons">
      <el-button size="small" @click="toggleEditor">发表评论</el-button>
    </div>
    <transition-group
            appear
            name="custom-classes-transition"
            appear-active-class="animated slideInLeft"
    >
      <div v-for="comment in comments" class="freyja-article-comment-container" :key="comment._id">
        <div class="freyja-comment-avatar">
          <img :src="`https://www.gravatar.com/avatar/${comment.publisher.hash}?s=50&d=retro`">
        </div>
        <div class="freyja-comment-panel">
          <div class="freyja-comment-publisher">
            <div class="freyja-comment-name freyja-comment-publisher-fields">
              {{comment.publisher.name}}
            </div>
            <div class="freyja-comment-time freyja-comment-publisher-fields">
              <i class="el-icon-time"></i>
              {{comment.createdAt | time}}
            </div>
          </div>
          <div class="freyja-comment-content freyja-article-content" v-html="comment.html"></div>
        </div>
      </div>
    </transition-group>

    <transition name="custom-classes-transition"
                enter-active-class="animated slideInUp"
                leave-active-class="animated slideOutDown"
    >
      <freyja-comment-editor v-if="showEditor" @close="onCloseEditor" @submit="onSubmitComment" :publisher="publisher"></freyja-comment-editor>
    </transition>
  </div>
</template>
<script>
  import FreyjaCommentEditor from './comment-editor.vue'
  import {Button} from 'element-ui'

  export default {
    name      : "FreyjaArticleComment",
    components: {
      FreyjaCommentEditor,
      ElButton: Button,
    },
    props: {
      comments: {
        type: Array,
        required: true,
      },
      articleId: {
        type: String,
        required: true,
      }
    },
    data() {
      return {
        showEditor: false,
        publisher: this.$store.getters['comment/publisher']
      }
    },
    methods: {
      toggleEditor() {
        this.showEditor = !this.showEditor
      },
      onCloseEditor() {
        this.showEditor = false
      },
      async onSubmitComment({publisher, content}) {
        await this.$store.dispatch('comment/create', {
          content,
          articleId: this.articleId,
          publisher,
        })
        this.showEditor = false
      }
    }
  }
</script>
<style lang="scss">
  .freyja-article-comment {
    .freyja-article-comment-buttons {
      margin-bottom: 20px;
    }
    .freyja-article-comment-container {
      > div {
        vertical-align: top;
        display: inline-block;
      }
    }
    .freyja-comment-avatar {
      border-radius: 50%;
      height: 50px;
      width: 50px;
      overflow: hidden;
    }

    .freyja-comment-panel {
      width: calc(100% - 80px);
    }

    .freyja-comment-publisher {
      display: inline-block;
      color: #aaa;
    }

    .freyja-comment-publisher-fields {
      display: inline;
    }

    .freyja-comment-content {
      margin-left: 50px;
    }
  }
</style>
