<template>
  <el-dialog :modal-append-to-body="false" :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-descriptions>
      <el-descriptions-item label="当前余额">{{ userBalance }} 元</el-descriptions-item>
    </el-descriptions>
    <el-form v-loading="loading" :element-loading-text="elementLoadingText" ref="form" :model="form" :rules="rules" @submit.native.prevent>
      <el-form-item label="充值金额" prop="totalAmount">
        <el-input v-model="form.totalAmount" placeholder="充值金额" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">充值</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { userPay, getUserBalance } from '@/api/user'
  export default {
    name: 'TopUP',
    data() {
      const isPrice = (rule, value, callback) => {
        if (isNaN(value)) {
          callback(Error('请输入数字'))
        } else {
          callback()
        }
      }
      return {
        title: '',
        dialogFormVisible: false,
        elementLoadingText: '等待中...',
        loading: false,
        form: {
          totalAmount: '',
        },
        userBalance: 0,
        rules: {
          totalAmount: [
            { required: true, trigger: 'blur', message: '请输入充值金额' },
            { validator: isPrice, trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      showEdit() {
        this.title = '充值'
        this.dialogFormVisible = true
        this.fetchData()
      },
      close() {
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            userPay(this.form)
              .then((res) => {
                const div = document.createElement('div')
                div.innerHTML = res.data
                document.body.appendChild(div)
                document.forms[document.forms.length - 1].setAttribute('target', '_blank') // 新开窗口跳转
                document.forms[document.forms.length - 1].submit()
                this.loading = false
                this.dialogFormVisible = false
                this.form.totalAmount = ''
              })
              .catch((err) => {
                this.loading = false
              })
          }
        })
      },
      async fetchData() {
        this.loading = true
        const { data } = await getUserBalance().catch((err) => {
          this.loading = false
        })
        this.userBalance = data.userBalance
        this.loading = false
      },
    },
  }
</script>
