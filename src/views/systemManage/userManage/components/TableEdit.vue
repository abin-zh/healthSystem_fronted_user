<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="姓名" prop="userName">
        <el-input v-model.trim="form.userName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" prop="userPhone">
        <el-input v-model.trim="form.userPhone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="userEmail">
        <el-input v-model.trim="form.userEmail" autocomplete="off" />
      </el-form-item>
      <template v-if="title == '添加'">
        <el-form-item label="身份证号" prop="userIdCard">
          <el-input v-model.trim="form.userIdCard" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model.trim="form.userPassword" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="userCPassword">
          <el-input v-model.trim="form.userCPassword" autocomplete="off" />
        </el-form-item>
      </template>
      <el-form-item label="性别" prop="userGender">
        <el-select v-model="form.userGender" :false-value="0" placeholder="请选择性别" :true-value="1">
          <el-option label="男" value="1" />
          <el-option label="女" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="userBirthday">
        <el-date-picker v-model="form.userBirthday" placeholder="选择出生日期" type="date" />
      </el-form-item>
      <template v-if="title == '编辑'">
        <el-form-item label="是否禁用" prop="userIsDeleted">
          <el-select v-model="form.userIsDeleted" placeholder="请选择是否禁用">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { validPhone, validIdCard } from '@/utils/validate'
  import { editUser } from '@/api/userManage'

  export default {
    name: 'TableEdit',
    data() {
      const cpwdValid = (rule, value, callback) => {
        const pwd = this.form.userPassword
        if (pwd != value) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        form: {
          userEmail: '',
          userPhone: '',
          userIdCard: '',
          userName: '',
          userPassword: '',
          userCPassword: '',
          userGender: '',
          userBirthday: '',
          userIsDeleted: '',
        },
        rules: {
          userPhone: [
            { required: true, trigger: 'blur', message: '请输入手机号' },
            { min: 11, max: 11, message: '请输入11位手机号' },
            { validator: validPhone, trigger: 'blur' },
          ],
          userIdCard: [
            { required: true, trigger: 'blur', message: '请输入身份证号' },
            { min: 18, max: 18, message: '请输入18位身份证号' },
            // { validator: validIdCard, trigger: 'blur' }, //生产环境下需启用
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
        title: '',
        dialogFormVisible: false,
        userPhone: '',
      }
    },
    created() {},
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
          //将0 1转为字符串，防止提交时获取不到值
          this.form.userGender = row.userGender.toString()
          this.form.userIsDeleted = row.userIsDeleted.toString()
          this.userPhone = row.userPhone
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
            //更新的手机号是否相同
            if (this.form.userPhone == this.userPhone) {
              this.form.userPhone = ''
            }

            const { msg } = await editUser(this.form)
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
