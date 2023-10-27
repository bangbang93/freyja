<template>
  <div class="freyja-article-create">
    <el-form @submit="submit">
      <el-form-item label="标题">
        <el-input v-model="page.title" />
      </el-form-item>
      <el-form-item class="editor-container">
        <freyja-md-editor
          v-model="page.content"
          @attachAdd="onAttachAdd"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="page.name" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit"
        >
          发布
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {ElMessageBox} from 'element-plus'
import {defineComponent} from 'vue'
import FreyjaMdEditor from '../../components/md-editor.vue'

interface IPage {
  _id: string
  title: string
  content: string
  name: string
}

export default defineComponent({
  name: 'FreyjaPageCreate',
  components: {
    FreyjaMdEditor,
  },
  beforeRouteLeave(_, __, next) {
    if (this.page.title || this.page.content) {
      ElMessageBox.confirm('文章没有保存，是否离开')
        .then(() => next())
        .catch(() => next(false))
    } else {
      return next()
    }
  },
  data() {
    return {
      page: {
        title: '',
        content: '',
        name: '',
      },
      attachments: [] as string[],
      edit: {
        id: '',
      },
    }
  },
  mounted() {
    if (this.$route.name === 'page.edit') {
      this.initEdit(this.$route.params as {id: string})
    }
  },
  methods: {
    async initEdit({id}: {id: string}) {
      const resp = await this.$fetch.get(`/api/admin/page/${id}`)
      const page = await resp.json() as IPage
      this.page = page
      this.edit.id = page._id
    },
    async submit() {
      const data = {...this.page, attachments: this.attachments}
      let resp
      if (this.edit.id) {
        resp = await this.$fetch.put(`/api/admin/page/${this.edit.id}`, data)
      } else {
        resp = await this.$fetch.post('/api/admin/page', data)
      }
      if (resp.status === 201 || resp.status === 200) {
        await ElMessageBox.alert('保存成功', 'Freyja')
        this.$router.push({name: 'page.list'})
      } else {
        const body = await resp.json() as Record<string, string>
        await ElMessageBox.alert(body.msg, 'Freyja')
      }
    },
    onAttachAdd({id}: {id: string}) {
      this.attachments.push(id)
    },
  },
})
</script>

<style lang="scss" scoped>
.freyja-article-create {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
