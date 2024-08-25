<template>
  <div class="login-container">
    <el-col class="login-image" :sm="14" :xs="0">
      <img alt="" height="100%" src="@/assets/login_images/background.jpg" width="100%" />
    </el-col>
    <el-col class="login-box" :sm="10" :xs="24">
      <div class="login-form">
        <h1>{{ $store.state.settings.title }}</h1>
        <b>欢迎使用健康体检平台</b>
        <el-form ref="loginForm" label-position="top" :model="loginForm" :rules="loginRules">
          <el-form-item label="账号" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入手机号或身份证号" size="primary" type="text" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <cy-pwd v-model="loginForm.password" />
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-col :span="16">
              <el-input v-model="loginForm.code" placeholder="请输入验证码" size="primary" type="text" />
            </el-col>
            <el-col class="code-image" :span="8">
              <el-button v-loading="codeLoading" class="code-button" :disabled="codeDisabled" type="primary" @click="getCode">
                {{ !codeButtonTitle ? '获取验证码' : codeButtonTitle }}
              </el-button>
              <!-- <el-image @click="reloadCode" :src="codeImgUrl"></el-image> -->
            </el-col>
          </el-form-item>
          <el-form-item>
            <div class="link-box">
              <el-link type="primary" @click="$router.push('/register')">未有账号，前往注册</el-link>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button v-loading="loading" size="primary" style="width: 100%" type="primary" @click="doLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </div>
</template>

<script>
  import CyPwd from '@/components/CyPwd'
  import { getEmailCode } from '../../api/user'
  import verifyCardNum from '../../utils/idCardValidate/idCardVerify'
  import { isPhone } from '../../utils/validate'
  export default {
    components: {
      CyPwd,
    },
    data() {
      const usernameValid = (rule, value, callback) => {
        if (value.length != 11 && value.length != 18) {
          callback(Error('请输入手机号或身份证号'))
        } else if (value.length == 11 && !isPhone(value)) {
          callback(Error('请输入正确的手机号'))
        } else if (value.length == 18 && !verifyCardNum(value)) {
          callback(Error('请输入正确的身份证号'))
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
          username: '',
          password: '',
          code: '',
        },
        loginRules: {
          username: [
            { required: true, message: '请输入手机号或身份证号', trigger: 'blur' },
            { min: 11, max: 18, message: '长度在 11 到 18 个字符', trigger: 'blur' },
            { validator: usernameValid, trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            { min: 6, max: 6, message: '长度为 6 个字符', trigger: 'blur' },
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
      getCode() {
        this.codeLoading = true
        let flag = true
        //校验用户名和密码
        this.$refs['loginForm'].validateField('username', (error) => {
          if (error) flag = false
        })
        this.$refs['loginForm'].validateField('password', (error) => {
          if (error) flag = false
        })
        //获取验证码
        if (flag) {
          getEmailCode(this.loginForm).then((res) => {
            if (res.code == 0) {
              let time = 60
              this.codeDisabled = true
              //设置再次获取验证码的定时器
              const timeCount = setInterval(() => {
                if (time == 0) {
                  this.codeDisabled = false
                  this.codeButtonTitle = null
                  clearInterval(timeCount)
                  return
                }
                this.codeButtonTitle = `${time}秒后可再次获取`
                time--
              }, 1000)
            }
            this.$message({ type: res.code == 0 ? 'success' : 'error', message: res.msg })
          })
        } else {
          this.$message.error('请检查信息是否正确填写')
        }
        this.codeLoading = false
      },
      doLogin() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store
              .dispatch('user/login', this.loginForm)
              .then(() => {
                const routerPath = this.redirect === '/404' || this.redirect === '/401' ? '/' : this.redirect
                this.$router.push(routerPath).catch(() => {})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
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
      justify-content: center;
      align-items: center;
    }

    .login-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
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

    .code-button {
      margin-left: 8px;
      width: 100%;
      height: 40px;
    }

    .el-image {
      border-radius: 8px;
      border: 1px solid #eee;
    }

    .code-image {
      display: flex;
      justify-content: flex-end;
    }
  }
  .link-box {
    display: flex;
    justify-content: flex-end;
  }
</style>
