<template>
    <div class="container">
        <el-row>
            <el-col :span="24">
                <el-form :model="user" ref="register" :rules="rules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="user.username"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="user.email"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="user.password"></el-input>
                    </el-form-item>
                    <el-form-item label="重复密码" prop="password2">
                        <el-input type="password" v-model="user.password2"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.native.prevent="register" :loading="loading">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-dialog title="注册成功" v-model="showRegisterSuccess">
            <span>注册成功，请检查注册邮箱激活</span>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="showRegisterSuccess = false">确 定</el-button>
      </span>
        </el-dialog>
        <el-dialog title="注册失败" v-model="showRegisterFailed">
            <span>{{errorMessage}}</span>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="showRegisterFailed = false">确 定</el-button>
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
  export default{
    data(){
      let that = this;
      return {
        loading: false,
        showRegisterSuccess: false,
        showRegisterFailed: false,
        errorMessage: '',
        user: {},
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          password2: [{required: true, message: '请重复密码', trigger: 'blur'}, {validator: (rule, value, callback, source, options)=>{
            if (that.user['password'] == that.user['password2']){
              callback();
            } else {
              callback([new Error('两次输入密码不一致')]);
            }
          }, trigger: 'blur'}],
          email: [{required: true, message: '请输入邮箱', trigger: 'blur', type: 'email'}],
        }
      }
    },
    methods: {
      register(){
        this.loading = true;
        this.$refs['register'].validate(async (valid)=>{
          if (!valid) return false;
          let res = await fetch('/user/register', {
            method: 'POST',
            headers: new Headers({
              'content-type': 'application/json'
            }),
            body: JSON.stringify(this.user)
          });
          this.loading = false;
          if (res.status == 201){
            this.showRegisterSuccess = true;
            return;
          }
          if (res.status == 400){
            let message = {
              'username not accept': '用户名不规范',
              'password too short': '密码太短',
            }
            let body = await res.json();
            this.errorMessage = message[body.message] || body.message;
            this.showRegisterFailed = true;
          }
          if (res.status == 409){
            let body = await res.json();
            let message = {
              'username exists': '用户名已经被使用',
              'email exists': '邮箱已经被使用',
            };
            this.errorMessage = message[body.message] || body.message;
            this.showRegisterFailed = true;
          }
        })
      }
    }
  }

</script>
