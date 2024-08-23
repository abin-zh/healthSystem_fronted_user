<template>
  <el-dialog :append-to-body="true" :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="细项结果(数值)" prop="icrResult">
        <el-input v-model.trim="form.icrResult" autocomplete="off" type="textarea" />
      </el-form-item>
      <el-form-item label="细项结论" prop="icrSummary">
        <el-input v-model.trim="form.icrSummary" autocomplete="off" type="textarea" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { editItemResult } from '@/api/billManage'
  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {
          icrId: '',
          icrSummary: '',
          icrResult: '',
        },
        rules: {
          icrResult: [{ required: true, trigger: 'blur', message: '请输入细项结果(数值)' }],
          icrSummary: [{ required: true, trigger: 'blur', message: '请输入细项结论' }],
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
            const { msg } = await editItemResult(this.form)
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
    },
  }
</script>
<style scoped>
  .line {
    text-align: center;
  }
</style>
