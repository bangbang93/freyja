<template>
  <div
    class="freyja-comment-editor"
    :style="{ height: height + 'px' }"
  >
    <el-button
      v-if="false"
      type="info"
      draggable="true"
      class="btn-editor"
      @drag="onDragBtnSize"
      @dragstart="onDragstartBtnSize"
    >
      <el-icon><el-icon-d-caret /></el-icon>
    </el-button>
    <el-button
      type="success"
      class="btn-editor"
      @click="onSubmit"
    >
      <el-icon><el-icon-check /></el-icon>
    </el-button>
    <el-button
      type="danger"
      class="btn-editor"
      @click="$emit('close')"
    >
      <el-icon><el-icon-close /></el-icon>
    </el-button>
    <el-form
      ref="commentForm"
      :rules="commentRules"
      :model="comment"
    >
      <el-col :span="8">
        <el-form-item
          label="昵称"
          prop="publisher.name"
        >
          <el-input v-model="comment.publisher.name" />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="publisher.email"
        >
          <el-input v-model="comment.publisher.email" />
        </el-form-item>
        <el-form-item
          label="网站"
          prop="publisher.website"
        >
          <el-input v-model="comment.publisher.website" />
        </el-form-item>
      </el-col>
      <el-col
        :offset="1"
        :span="15"
      >
        <el-form-item
          label="评论"
          prop="content"
        >
          <div v-if="reply">
            正在回复{{ reply.publisher.name }}
          </div>
          <el-input
            v-model="comment.content"
            type="textarea"
            :autosize="{ minRows: 10 }"
          />
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import {Check as ElIconCheck, Close as ElIconClose, DCaret as ElIconDCaret} from '@element-plus/icons-vue'
import {ElButton, ElCol, ElForm, ElFormItem, ElInput, FormRules} from 'element-plus'
import {reactive, ref} from 'vue'

const emits = defineEmits(['submit', 'close'])
const props = defineProps<{
  display: boolean
  publisher: {name: string; email: string; website: string}
  reply: {publisher: {name: string; email: string; website: string}; content: string}
}>()

const defaultHeight = 300
const height = ref(defaultHeight)
const beforeHeight = ref(0)
const dragY = ref(0)
const commentForm = ref<InstanceType<typeof ElForm> | null>(null)
const comment = reactive({
  publisher: props.publisher,
  content: '',
})
const commentRules = reactive({
  publisher: {
    type: 'object',
    required: true,
    fields: {
      name: {
        type: 'string',
        required: true,
      },
      email: {
        type: 'email',
        required: true,
      },
      website: {
        type: 'url',
        required: false,
      },
    },
  },
  content: {
    type: 'string',
    required: true,
  },
} as FormRules<typeof comment>)


function onDragBtnSize(e: DragEvent): void {
  if (e.screenX === 0) return
  height.value = beforeHeight.value + (dragY.value - e.pageY)
}
function onDragstartBtnSize(e: DragEvent): void {
  dragY.value = e.pageY
  beforeHeight.value = height.value
}
async function onSubmit(): Promise<void> {
  await commentForm.value?.validate((valid) => {
    if (valid) {
      emits('submit', comment)
    }
  })
}
</script>

<style lang="scss">
.freyja-comment-editor {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-left: 50px;
  padding-right: 50px;
  background-color: #eee;
  .btn-editor {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    font-size: 15px;
    padding: 0;
    float: right;
    margin-right: 20px;
  }
}
</style>
