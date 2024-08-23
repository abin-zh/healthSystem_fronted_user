<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model.trim="form.projectName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="价格" prop="projectPrice">
        <el-input v-model.trim="form.projectPrice" autocomplete="off" />
      </el-form-item>
      <el-form-item label="所属科室" prop="projectDeptId">
        <el-select v-model="form.projectDeptId" placeholder="请选择科室">
          <el-option v-for="(item, key) in deptList" :key="key" :label="item.deptName" :value="item.deptId" />
        </el-select>
      </el-form-item>
      <tree-transfer
        :default-props="transferProps"
        :from_data="fromItemList"
        node_key="itemId"
        :title="['未选择细项', '已选择细项']"
        :to_data="toItemList"
        @add-btn="handleAdd"
        @remove-btn="handleRemove"
      />
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getAllDeptsAndItems, editMedicalProject } from '@/api/medicalProjectManage'
  import { validPrice } from '@/utils/validate'
  import treeTransfer from 'el-tree-transfer'

  export default {
    name: 'TableEdit',
    components: {
      treeTransfer,
    },
    data() {
      return {
        form: {
          projectName: '',
          projectPrice: '',
          projectDeptId: '',
          itemAddIds: [],
          itemRmIds: [],
        },
        rules: {
          projectName: [{ required: true, trigger: 'blur', message: '请输入项目名称' }],
          projectPrice: [
            { required: true, trigger: 'blur', message: '请输入价格' },
            { validator: validPrice, trigger: 'blur' },
          ],
          projectDeptId: [{ required: true, trigger: 'blur', message: '请选择科室' }],
        },
        title: '',
        dialogFormVisible: false,
        deptList: [],
        fromItemList: [],
        toItemList: [],
        itemAddIds: [],
        itemRmIds: [],
        toIds: [],
        transferProps: {
          label: 'itemName',
        },
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
        }
        //projectId存在则携带进行请求
        this.fetchData(!row || !row.projectId ? '' : row.projectId)
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
            //排除原来已有的细项
            this.itemAddIds = this.itemAddIds.filter((id) => this.toIds.indexOf(id) == -1)
            //排除原来未有的细项
            this.itemRmIds = this.itemRmIds.filter((id) => this.toIds.indexOf(id) != -1)

            this.form.itemAddIds = this.itemAddIds
            this.form.itemRmIds = this.itemRmIds
            const { msg } = await editMedicalProject(this.form)
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
      async fetchData(projectId) {
        const { data } = await getAllDeptsAndItems({ projectId })
        const { depts, fromItems, toItems } = data
        this.deptList = depts
        this.fromItemList = fromItems
        this.toItemList = toItems
        //抽取体检项目中已存在itemId
        this.toIds = toItems.map((item) => item.itemId)
      },
      handleAdd(fromData, toData, obj) {
        this.itemAddIds = obj.keys
        this.itemRmIds = this.itemRmIds.filter((id) => this.itemAddIds.indexOf(id) == -1)
      },
      handleRemove(fromData, toData, obj) {
        this.itemRmIds = obj.keys
        this.itemAddIds = this.itemAddIds.filter((id) => this.itemRmIds.indexOf(id) == -1)
      },
    },
  }
</script>
