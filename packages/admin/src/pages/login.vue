<template>
  <div class="container">
    <el-row>
      <el-col
        :span="12"
        :offset="6"
      >
        <el-form :model="loginForm">
          <el-form-item
            label="用户名"
            :required="true"
          >
            <el-input v-model="loginForm.username" />
          </el-form-item>
          <el-form-item
            label="密码"
            :required="true"
          >
            <el-input
              v-model="loginForm.password"
              type="password"
              @keydown.enter="postLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="postLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import {ElMessageBox} from 'element-plus'
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'FreyjaAdminLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    async postLogin() {
      const res = await this.$fetch.post(
        '/api/admin/user/login',
        this.loginForm,
      )
      if (res.status === 200) {
        await this.$router.push({name: 'dashboard'})
      } else {
        await ElMessageBox.alert('用户名或密码错误', 'Freyja', {
          type: 'error',
        })
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.container {
  margin-top: 100px;
}
</style>
