<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="姓名" prop="staffName">
        <el-input v-model.trim="form.staffName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="staffEmail">
        <el-input v-model.trim="form.staffEmail" autocomplete="off" />
      </el-form-item>
      <template v-if="title == '添加'">
        <el-form-item label="昵称" prop="staffAccount">
          <el-input v-model.trim="form.staffAccount" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="staffPassword">
          <el-input v-model.trim="form.staffPassword" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="staffCPassword">
          <el-input v-model.trim="form.staffCPassword" autocomplete="off" />
        </el-form-item>
      </template>
      <el-form-item label="所属科室" prop="staffDeptId">
        <el-select v-model="form.staffDeptId" placeholder="请选择科室">
          <el-option v-for="(item, key) in deptList" :key="key" :label="item.deptName" :value="item.deptId" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属角色" prop="staffRoleId">
        <el-select v-model="form.staffRoleId" placeholder="请选择角色">
          <el-option v-for="(item, key) in roleList" :key="key" :label="item.roleName" :value="item.roleId" />
        </el-select>
      </el-form-item>
      <template v-if="title == '编辑'">
        <el-form-item label="是否活跃" prop="staffIsStatus">
          <el-select v-model="form.staffIsStatus" placeholder="请选择是否活跃">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用" prop="staffIsDeleted">
          <el-select v-model="form.staffIsDeleted" placeholder="请选择是否禁用">
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
  import { getRolesAndDepts, editStaff } from '@/api/staffManage'

  export default {
    name: 'TableEdit',
    data() {
      const cpwdValid = (rule, value, callback) => {
        const pwd = this.form.staffPassword
        if (pwd != value) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        form: {
          staffName: '',
          staffAccount: '',
          staffEmail: '',
          staffPassword: '',
          staffCPassword: '',
          staffDeptId: '',
          staffRoleId: '',
          staffIsStatus: '',
          staffIsDeleted: '',
        },
        rules: {
          staffName: [
            { required: true, trigger: 'blur', message: '请输入姓名' },
            { min: 2, max: 16, message: '长度在2 到 18个字符' },
          ],
          staffAccount: [
            { required: true, trigger: 'blur', message: '请输入昵称' },
            { min: 4, max: 16, message: '长度在3 到 16个字符' },
          ],
          staffEmail: [
            { required: true, trigger: 'blur', message: '请输入邮箱' },
            { type: 'email', trigger: 'blur', message: '请输入正确的邮箱' },
          ],
          staffPassword: [
            { required: true, trigger: 'blur', message: '请输入密码' },
            { min: 6, max: 16, trigger: 'blur', message: '长度在6 到 16个字符' },
          ],
          staffCPassword: [
            { required: true, trigger: 'blur', message: '请再次输入密码' },
            { validator: cpwdValid, trigger: 'blur' },
          ],
          staffDeptId: [{ required: true, trigger: 'blur', message: '请选择科室' }],
          staffRoleId: [{ required: true, trigger: 'blur', message: '请选择角色' }],
          staffIsStatus: [{ required: true, trigger: 'blur', message: '请选择管理员状态' }],
          staffIsDeleted: [{ required: true, trigger: 'blur', message: '请选择是否禁用' }],
        },
        title: '',
        dialogFormVisible: false,
        deptList: [],
        roleList: [],
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
          this.form.staffIsStatus = row.staffIsStatus.toString()
          this.form.staffIsDeleted = row.staffIsDeleted.toString()
        }
        this.fetchData()
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
            const { msg } = await editStaff(this.form)
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
      async fetchData() {
        const { data } = await getRolesAndDepts()
        this.deptList = data.depts
        this.roleList = data.roles
      },
    },
  }
</script>
