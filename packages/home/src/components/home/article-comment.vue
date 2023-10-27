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
<script lang="ts" setup>
import {get} from 'lodash-es'
import {reactive, ref} from 'vue'
import {IComment, IPublisher, useCommentStore} from '../../store/comment.ts'
import FreyjaCommentEditor from './comment-editor.vue'
import {
  ElButton,
  ElNotification,
} from 'element-plus'
import FreyjaArticleCommentItem from './article-comment-item.vue'

const props = defineProps<{
  comments: IComment[]
  articleId: string
}>()

const commentStore = useCommentStore()

const showEditor = ref(false)
const publisher = reactive<IPublisher>({
  name: '', email: '', website: '',
})
const replying = ref<IComment | null>(null)

function toggleEditor(): void {
  showEditor.value = !showEditor.value
  if (!showEditor.value) {
    replying.value = null
  }
}

function onCloseEditor(): void {
  showEditor.value = false
  replying.value = null
}

async function onSubmitComment({publisher, content}: {publisher: IPublisher;content: string}): Promise<void> {
  const data = {
    content,
    articleId: props.articleId,
    publisher,
    reply: null as string | null,
  }
  if (replying.value) {
    data.reply = replying.value._id
  }
  try {
    commentStore.savePublisher(publisher)
    await commentStore.create(props.articleId, content, replying.value?._id)
    showEditor.value = false
  } catch (e) {
    if (e instanceof Error) {
      switch ('status' in e && e.status) {
        case 403:
          ElNotification({
            title: 'bangbang93.blog()',
            message: '不能使用作者邮箱',
            type: 'error',
          })
          break
        default:
          ElNotification({
            title: 'bangbang93.blog()',
            message: get(e, 'body.msg') ?? get(e, 'body') ?? e.message,
            type: 'error',
          })
      }
    }
  }
}

function onReplyClicked(comment: IComment): void {
  showEditor.value = true
  replying.value = comment
}
</script>

<style lang="scss">
.freyja-article-comment {
  .freyja-article-comment-buttons {
    margin-bottom: 20px;
  }
}
</style>
