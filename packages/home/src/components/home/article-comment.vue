<template>
  <div class="freyja-article-comment">
    <div class="freyja-article-comment-buttons">
      <el-button
        size="small"
        @click="toggleEditor"
      >
        <i class="fa fa-comment" /> 发表评论
      </el-button>
    </div>
    <transition-group
      tag="span"
      appear
      name="custom-classes-transition"
      appear-active-class="animated slideInLeft"
    >
      <div
        v-for="comment in comments"
        :key="comment._id"
      >
        <freyja-article-comment-item
          :comment="comment"
          @reply-clicked="onReplyClicked"
        />
      </div>
    </transition-group>

    <transition
      name="custom-classes-transition"
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <freyja-comment-editor
        v-if="showEditor"
        :publisher="publisher"
        :reply="replying"
        @close="onCloseEditor"
        @submit="onSubmitComment"
      />
    </transition>
  </div>
</template>

<script>
import FreyjaCommentEditor from './comment-editor.vue'
import {
  ElButton as Button,
  ElNotification as Notification,
} from 'element-plus'
import FreyjaArticleCommentItem from './article-comment-item.vue'

export default {
  name: 'FreyjaArticleComment',
  components: {
    FreyjaArticleCommentItem,
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
    },
  },
  data() {
    return {
      showEditor: false,
      publisher: this.$store.getters['comment/publisher'],
      replying: null,
    }
  },
  methods: {
    toggleEditor() {
      this.showEditor = !this.showEditor
      if (!this.showEditor) {
        this.replying = null
      }
    },
    onCloseEditor() {
      this.showEditor = false
      this.replying = null
    },
    async onSubmitComment({publisher, content}) {
      const data = {
        content,
        articleId: this.articleId,
        publisher,
      }
      if (this.replying) {
        data.reply = this.replying._id
      }
      try {
        await this.$store.dispatch('comment/create', data)
        this.showEditor = false
      } catch (e) {
        switch (e.status) {
          case 403:
            Notification({
              title: 'bangbang93.blog()',
              message: '不能使用作者邮箱',
              type: 'error',
            })
            break
          default:
            Notification({
              title: 'bangbang93.blog()',
              message: e.body.msg || e.body,
              type: 'error',
            })
        }
      }
    },
    onReplyClicked(comment) {
      this.showEditor = true
      this.replying = comment
    },
  },
}
</script>

<style lang="scss">
.freyja-article-comment {
  .freyja-article-comment-buttons {
    margin-bottom: 20px;
  }
}
</style>
