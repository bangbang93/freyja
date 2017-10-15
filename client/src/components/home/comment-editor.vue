<template>
  <div class="freyja-comment-editor" :style="{height: height + 'px'}">
    <el-button type="info" draggable="true" class="btn-editor"
               @drag.native="onDragBtnSize"
               @dragstart.native="onDragstartBtnSize"
               v-if="false"
    >
      <i class="el-icon-d-caret"></i>
    </el-button>
    <el-button type="success" class="btn-editor" @click="onSubmit">
      <i class="el-icon-check"></i>
    </el-button>
    <el-button type="danger" class="btn-editor" @click="onClose">
      <i class="el-icon-close"></i>
    </el-button>
    <el-form :rules="commentRules" :model="comment" ref="commentForm">
      <el-col :span="8">
        <el-form-item label="昵称" prop="publisher.name" :rules="commentRules.publisher.fields.name">
          <el-input v-model="comment.publisher.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="publisher.email" :rules="commentRules.publisher.fields.email">
          <el-input v-model="comment.publisher.email"></el-input>
        </el-form-item>
        <el-form-item label="网站" prop="publisher.website" :rules="commentRules.publisher.fields.website">
          <el-input v-model="comment.publisher.website"></el-input>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="15">
        <el-form-item label="评论" prop="content">
          <div v-if="reply">正在回复{{reply.publisher.name}}</div>
          <el-input type="textarea" :autosize="{minRows: 10}" v-model="comment.content"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
  import {Button, Form, FormItem, Input, Col} from 'element-ui'

  const defaultHeight = 300;

  export default {
    name: 'FreyjaCommentEditor',
    components: {
      ElButton: Button,
      ElForm: Form,
      ElFormItem: FormItem,
      ElInput: Input,
      ElCol: Col,
    },
    props: {
      display: Boolean,
      publisher: Object,
      reply: Object,
    },
    data() {
      return {
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
              }
            }
          },
          content: {
            type: 'string',
            required: true,
          }
        }
      }
    },
    methods: {
      onDragBtnSize(e) {
        if (e.screenX === 0) return
        this.height = this.beforeHeight + (this.dragY - e.pageY)
      },
      onDragstartBtnSize(e) {
        this.dragY = e.pageY
        this.beforeHeight = this.height
      },
      onClose() {
        this.$emit('close')
      },
      onSubmit() {
        this.$refs['commentForm'].validate((valid) => {
          if (valid) {
            this.$emit('submit', this.comment)
          }
        })
      }
    }
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
