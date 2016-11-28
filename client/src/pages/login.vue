<template>
  <div class="container">
    <el-row>
      <el-col :span="24">
        <el-form :model="user" ref="login" :rules="rules" @submit.native.prevent="login">
          <el-form-item label="用户名|邮箱" prop="username">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="user.password" @keydown="login"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" :loading="loading">登录</el-button>
            <el-button @click.native.prevent="register">注册</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-dialog title="登录失败" v-model="showLoginResult">
      <span>用户名或密码错误</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click.native="showLoginResult = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<style>
  .container {
    text-align: center;
    margin: 200px auto;
    width: 400px;
  }
</style>
<script>
  import 'whatwg-fetch'
  import 'url-search-params-polyfill'

  let query = new URLSearchParams(window.location.search);
  export default{
    data(){
      return {
        loading: false,
        showLoginResult: false,
        user: {},
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        }
      }
    },
    methods: {
      login(){
        this.$refs['login'].validate(async(valid)=> {
          if (!valid) return false;
          if (query.has('redirect_uri')){
            this.loading = true;
            let res = await fetch('/user/oauth2', {
              method: 'POST',
              body: JSON.stringify(this.user),
              headers: new Headers({
                'content-type': 'application/json'
              })
            });
            this.loading = false;
            if (res.status == 200){
              this.loading = true;
              let json = await res.json();
              window.location = query.get('redirect_uri') + `?code=${json.code}&expire=${json.expire}`;
              return;
            }
            if (res.status == 401){
              this.showLoginResult = true;
              return;
            }
          } else {
            this.loading = true;
            let res = await fetch('/user/login', {
              method: 'POST',
              body: JSON.stringify(this.user),
              headers: new Headers({
                'content-type': 'application/json'
              })
            });
            this.loading = false;
            if (res.status == 200){
              this.loading = true;
              let json = await res.json();
              console.log(json);
              return;
            }
            if (res.status == 401){
              this.showLoginResult = true;
              return;
            }
          }
        })
      },
      register(){
        window.location = "/register.html";
      }
    }
  }
</script>
