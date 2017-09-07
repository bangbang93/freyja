<template>
  <div class="freyja-comment-editor" :style="{height: height + 'px'}">
    <el-button type="success" draggable="true" class="btn-editor"
               @drag.native="onDragBtnSize"
               @dragstart.native="onDragstartBtnSize">
      <i class="el-icon-d-caret"></i>
    </el-button>
    <el-button type="danger" class="btn-editor" @click="onClose">
      <i class="el-icon-close"></i>
    </el-button>
    <el-form>
      <el-col :span="8">
        <el-form-item label="昵称">
          <el-input v-model="publisher.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="publisher.email"></el-input>
        </el-form-item>
        <el-form-item label="网站">
          <el-input v-model="publisher.website"></el-input>
        </el-form-item>
      </el-col>
      <el-col :offset="1" :span="15">
        <el-form-item label="评论">
          <el-input type="textarea" :autosize="{minRows: 10}"></el-input>
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
      display: Boolean
    },
    data() {
      return {
        publisher: {
          name: '',
          email: '',
          website: ''
        },
        height: defaultHeight,
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
    }
  }
</style>
