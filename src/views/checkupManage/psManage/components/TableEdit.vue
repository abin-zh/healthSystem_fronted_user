<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="项目小结" prop="psSummary">
        <el-input v-model.trim="form.psSummary" autocomplete="off" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getItemResultStatus, editProjectSummary } from '@/api/billManage'
  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {
          psId: '',
          psSummary: '',
        },
        rules: {
          psSummary: [{ required: true, trigger: 'blur', message: '请输入体检小结' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (row) {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          this.checkStatus()
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await editProjectSummary(this.form)
            this.$baseMessage(msg, 'success')
            this.$refs['form'].resetFields()
            this.dialogFormVisible = false
            this.$emit('fetch-data')
            this.form = this.$options.data().form
          } else {
            return false
          }
        })
      },
      async checkStatus() {
        getItemResultStatus({ psId: this.form.psId }).catch((err) => {
          this.close()
        })
      },
    },
  }
</script>
<style scoped>
  .line {
    text-align: center;
  }
</style>
