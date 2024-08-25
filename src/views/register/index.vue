<template>
  <div class="login-container">
    <el-col class="login-image" :sm="14" :xs="0">
      <img alt="" height="100%" src="@/assets/login_images/background_reg.jpg" width="100%" />
    </el-col>
    <el-col class="login-box" :sm="10" :xs="24">
      <div class="login-form">
        <h1>注册</h1>
        <el-form ref="loginForm" label-position="left" label-width="80px" :model="loginForm" :rules="loginRules">
          <el-form-item label="姓名" prop="userName">
            <el-input v-model.trim="loginForm.userName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" prop="userPhone">
            <el-input v-model.trim="loginForm.userPhone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input v-model.trim="loginForm.userEmail" autocomplete="off" />
          </el-form-item>
          <el-form-item label="身份证号" prop="userIdCard">
            <el-input v-model.trim="loginForm.userIdCard" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
            <el-input v-model.trim="loginForm.userPassword" autocomplete="off" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="userCPassword">
            <el-input v-model.trim="loginForm.userCPassword" autocomplete="off" type="password" />
          </el-form-item>
          <el-form-item label="性别" prop="userGender">
            <el-select v-model="loginForm.userGender" :false-value="0" placeholder="请选择性别" :true-value="1">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="userBirthday">
            <el-date-picker v-model="loginForm.userBirthday" placeholder="选择出生日期" type="date" />
          </el-form-item>
          <el-form-item>
            <div class="link-box">
              <el-link type="primary" @click="$router.push('/login')">已有账号，前往注册</el-link>
            </div>
          </el-form-item>

          <el-button v-loading="loading" size="primary" style="width: 100%" type="primary" @click="doLogin">注册</el-button>
        </el-form>
      </div>
    </el-col>
  </div>
</template>

<script>
  import { validPhone, validIdCard } from '@/utils/validate'
  import { register } from '@/api/user'
  export default {
    data() {
      const cpwdValid = (rule, value, callback) => {
        const pwd = this.loginForm.userPassword
        if (pwd != value) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        codeButtonTitle: null,
        codeDisabled: false,
        loading: false,
        codeLoading: false,
        redirect: undefined,
        loginForm: {
          userEmail: '',
          userPhone: '',
          userIdCard: '',
          userName: '',
          userPassword: '',
          userCPassword: '',
          userGender: '',
          userBirthday: '',
        },
        loginRules: {
          userPhone: [
            { required: true, trigger: 'blur', message: '请输入手机号' },
            { min: 11, max: 11, message: '请输入11位手机号' },
            { validator: validPhone, trigger: 'blur' },
          ],
          userIdCard: [
            { required: true, trigger: 'blur', message: '请输入身份证号' },
            { min: 18, max: 18, message: '请输入18位身份证号' },
            { validator: validIdCard, trigger: 'blur' }, //生产环境下需启用
          ],
          userName: [
            { required: true, trigger: 'blur', message: '请输入姓名' },
            { min: 1, max: 16, trigger: 'blur', message: '长度在1 到 16个字符' },
          ],
          userPassword: [
            { required: true, trigger: 'blur', message: '请输入密码' },
            { min: 6, max: 16, trigger: 'blur', message: '长度在6 到 16个字符' },
          ],
          userCPassword: [
            { required: true, trigger: 'blur', message: '请再次输入密码' },
            { min: 6, max: 16, trigger: 'blur', message: '长度在6 到 16个字符' },
            { validator: cpwdValid, trigger: 'blur' },
          ],
          userGender: [{ required: true, trigger: 'blur', message: '请选择性别' }],
          userBirthday: [{ required: true, trigger: 'blur', message: '请选择出生日期' }],
          userIsDeleted: [{ required: true, trigger: 'blur', message: '请选择用户状态' }],
          userEmail: [
            { required: true, trigger: 'blur', message: '请输入邮箱' },
            { type: 'email', trigger: 'blur', message: '请输入正确的邮箱' },
          ],
        },
      }
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    methods: {
      doLogin() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            register(this.loginForm).then((res) => {
              this.$baseMessage(res.msg, res.code == 0 ? 'success' : 'error')
              if (res.code == 0) {
                this.$router.push('/login')
              }
            })
            this.loading = false
          } else {
            return false
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    display: flex;
    flex-direction: row;
    padding: 32px;
    box-sizing: border-box;
    background-color: white;

    .login-image {
      padding-right: 32px;
    }

    .login-image img {
      border-radius: 16px;
    }

    .login-box {
      display: flex;
    }

    .login-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 64px;
    }

    .login-form form {
      margin-top: 32px;
      width: 100%;
    }

    .el-form--label-top .el-form-item__label {
      font-weight: bold;
      padding: 0;
    }

    .el-image {
      border-radius: 8px;
      border: 1px solid #eee;
    }
  }
  .link-box {
    display: flex;
    justify-content: flex-end;
  }
</style>
