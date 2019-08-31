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
              @keydown.native.enter="postLogin"
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
<script>
export default {
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
      const res = await this.$fetch.post('/api/admin/user/login', this.loginForm)
      if (res.status === 200) {
        location.href = '/admin/home'
      } else {
        this.$message({
          message: '用户名或密码错误',
          type: 'error',
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  .container {
    margin-top: 100px;
  }
</style>
