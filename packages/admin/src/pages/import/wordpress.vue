<template>
  <div>
    <el-form @submit="onSubmit">
      <el-form-item label="host">
        <el-input v-model="database.host" />
      </el-form-item>
      <el-form-item label="database">
        <el-input v-model="database.database" />
      </el-form-item>
      <el-form-item label="port">
        <el-input v-model="database.port" />
      </el-form-item>
      <el-form-item label="user">
        <el-input v-model="database.user" />
      </el-form-item>
      <el-form-item label="password">
        <el-input
          v-model="database.password"
          type="password"
        />
      </el-form-item>
      <el-form-item label="tablePrefix">
        <el-input v-model="database.prefix" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          导入
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {ElMessageBox} from 'element-plus'
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'FreyjaImportWordpress',
  data() {
    return {
      database: {
        host: 'localhost',
        port: 3306,
        database: 'wordpress',
        user: 'root',
        password: '',
        prefix: 'wp_',
      },
    }
  },
  methods: {
    async onSubmit() {
      const resp = await this.$fetch.post('/api/admin/import/wordpress', {
        database: this.database,
      })
      if (resp.status === 200) {
        await ElMessageBox.alert('导入成功')
        this.$router.push({name: 'article.list'})
      } else {
        const body = await resp.json() as Record<string, string>
        await ElMessageBox.alert(body.msg || body.message)
      }
    },
  },
})
</script>
