<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="细项名称" prop="itemName">
        <el-input v-model.trim="form.itemName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="单位" prop="itemUnit">
        <el-input v-model.trim="form.itemUnit" autocomplete="off" />
      </el-form-item>
      <el-form-item label="正常范围" required>
        <el-col :span="11">
          <el-form-item prop="itemLowerLimit">
            <el-input v-model="form.itemLowerLimit" placeholder="下限" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="itemUpperLimit">
            <el-input v-model="form.itemUpperLimit" placeholder="上限" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { editMedicalItems } from '@/api/medicalItemManage'

  export default {
    name: 'TableEdit',
    data() {
      const validLower = (rule, value, callback) => {
        const uppperLimit = this.form.itemUpperLimit
        if (isNaN(value) || value < 0) {
          callback(new Error('下限值必须是正数'))
        } else if (value > uppperLimit) {
          callback(new Error('下限值不能大于上限值'))
        } else {
          callback()
        }
      }
      const validUpper = (rule, value, callback) => {
        const lowerLimit = this.form.itemLowerLimit
        if (isNaN(value) && value < 0) {
          callback(new Error('上限值必须是正数'))
        } else if (value < lowerLimit) {
          callback(new Error('上限值不能小于下限值'))
        } else {
          callback()
        }
      }
      return {
        form: {
          itemName: '',
          itemUnit: '',
          itemLowerLimit: '',
          itemUpperLimit: '',
        },
        rules: {
          itemName: [{ required: true, trigger: 'blur', message: '请输入细项名称' }],
          itemUnit: [{ required: true, trigger: 'blur', message: '请输入单位' }],
          itemLowerLimit: [
            { required: true, trigger: 'blur', message: '请输入下限' },
            { validator: validLower, trigger: 'blur' },
          ],
          itemUpperLimit: [
            { required: true, trigger: 'blur', message: '请输入上限' },
            { validator: validUpper, trigger: 'blur' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          console.log('编辑')
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
            console.log(this.form)
            const { msg } = await editMedicalItems(this.form)
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
