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
      @click="onClose"
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
          :rules="commentRules.publisher.fields.name"
        >
          <el-input v-model="comment.publisher.name" />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="publisher.email"
          :rules="commentRules.publisher.fields.email"
        >
          <el-input v-model="comment.publisher.email" />
        </el-form-item>
        <el-form-item
          label="网站"
          prop="publisher.website"
          :rules="commentRules.publisher.fields.website"
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

<script>
import {
  Check as ElIconCheck,
  Close as ElIconClose,
  DCaret as ElIconDCaret,
} from '@element-plus/icons-vue'
import {$emit, $off, $on, $once} from '../../utils/gogocodeTransfer'
import {
  ElButton as Button,
  ElCol as Col,
  ElForm as Form,
  ElFormItem as FormItem,
  ElInput as Input,
} from 'element-plus'

const defaultHeight = 300

export default {
  name: 'FreyjaCommentEditor',
  components: {
    ElButton: Button,
    ElForm: Form,
    ElFormItem: FormItem,
    ElInput: Input,
    ElCol: Col,
    ElIconDCaret,
    ElIconCheck,
    ElIconClose,
  },
  props: {
    display: Boolean,
    publisher: Object,
    reply: Object,
  },
  emits: ['submit', 'close'],
  data() {
    return {
      beforeHeight: 0,
      dragY: 0,
      comment: {
        publisher: this.publisher,
        content: '',
      },
      height: defaultHeight,
      commentRules: {
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
      },
    }
  },
  methods: {
    onDragBtnSize(e) {
      if (e.screenX === 0) return
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      this.height = this.beforeHeight + (this.dragY - e.pageY)
    },
    onDragstartBtnSize(e) {
      this.dragY = e.pageY
      this.beforeHeight = this.height
    },
    onClose() {
      $emit(this, 'close')
    },
    onSubmit() {
      this.$refs['commentForm'].validate((valid) => {
        if (valid) {
          $emit(this, 'submit', this.comment)
        }
      })
    },
  },
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
