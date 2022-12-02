<template>
  <div class="freyja-article-comment-item">
    <div class="freyja-comment-avatar freyja-avatar-animation">
      <img
        :src="`https://gravatar.933.moe/avatar/${comment.publisher.hash}?s=100&d=retro`"
        @click="onReplyClicked(comment)"
      >
    </div>
    <div class="freyja-comment-panel">
      <div class="freyja-comment-publisher">
        <div class="freyja-comment-time freyja-comment-publisher-fields">
          <el-icon><el-icon-time /></el-icon>
          {{ $filters.time(comment.createdAt) }}
        </div>
        <div class="freyja-comment-name freyja-comment-publisher-fields">
          <i class="fa fa-user" />
          {{ comment.publisher.name }}
        </div>
      </div>
      <div
        class="freyja-comment-content freyja-article-content"
        v-html="comment.html"
      />
      <div
        v-for="reply in comment.replies"
        :key="reply._id"
      >
        <freyja-article-comment-item
          :comment="reply"
          @reply-clicked="onReplyClicked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {Timer} from '@element-plus/icons'
import {$emit, $off, $on, $once} from '../../utils/gogocodeTransfer'
export default {
  name: 'FreyjaArticleCommentItem',
  components: {
    ElIconTime: Timer,
  },
  props: {
    comment: Object,
  },
  emits: ['reply-clicked'],
  methods: {
    onReplyClicked(comment) {
      $emit(this, 'reply-clicked', comment)
    },
  },
}
</script>

<style lang="scss">
.freyja-article-comment-item {
  > div {
    vertical-align: top;
    display: inline-block;
  }

  $avatar-size: 100px;
  .freyja-comment-avatar {
    border-radius: 50%;
    height: $avatar-size;
    width: $avatar-size;
    overflow: hidden;
  }

  .freyja-comment-panel {
    width: calc(100% - #{$avatar-size} - 30px);
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
