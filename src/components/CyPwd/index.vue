<template>
  <div class="pwd-input">
    <el-input v-model="computedValue" :placeholder="placeholder" size="primary" :type="pwdInput.type" @input="updatePwd" />
    <div class="eyes">
      <img :src="pwdInput.icon" @click="toggleType" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CyPwd',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '请输入密码',
      },
    },
    data() {
      return {
        pwdInput: {
          type: 'password',
          icon: './static/images/open-eyes.png',
        },
      }
    },
    computed: {
      computedValue: {
        get() {
          return this.value // 获取 prop 的值
        },
        set(newValue) {
          this.$emit('input', newValue) // 触发 input 事件
        },
      },
    },
    methods: {
      toggleType() {
        this.pwdInput.type = this.pwdInput.type == 'password' ? 'text' : 'password'
        this.pwdInput.icon = `./static/images/${this.pwdInput.type == 'password' ? 'open-eyes' : 'close-eyes'}.png`
      },
      updatePwd(value) {
        this.computedValue = value
      },
    },
  }
</script>

<style>
  .pwd-input {
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
  }

  .pwd-input input {
    width: 100%;
    height: 40px;
    border: 1px solid #e3e3e3;
    border-radius: 8px;
    padding: 0 12px;
  }

  .eyes {
    width: 52px;
    height: 40px;
    position: absolute;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .eyes img {
    width: 20px;
    height: 20px;
  }
</style>
