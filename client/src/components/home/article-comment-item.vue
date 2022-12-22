<template>
  <div class="freyja-article-comment-item">
    <div class="freyja-comment-avatar freyja-avatar-animation">
      <img
        :alt="`${comment.publisher.name} avatar`"
        :src="`https://gravatar.933.moe/avatar/${comment.publisher.hash}?s=100&d=retro`"
        @click="onReplyClicked(comment)"
      >
    </div>
    <div class="freyja-comment-panel">
      <div class="freyja-comment-publisher">
        <div class="freyja-comment-time freyja-comment-publisher-fields">
          <i class="fa-clock-o fa" />
          {{ formatDate(comment.createdAt) }}
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

<script lang="ts">
import {$emit} from '../../utils/gogocodeTransfer'

export default {
  name: 'FreyjaArticleCommentItem',
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  emits: ['reply-clicked'],
  methods: {
    onReplyClicked(comment: object) {
      $emit(this, 'reply-clicked', comment)
    },
    formatDate(date: Date | string): string {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      return date.toLocaleString()
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
