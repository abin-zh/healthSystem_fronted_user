<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="项目名称" prop="packageName">
        <el-input v-model.trim="form.packageName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="价格" prop="packagePrice">
        <el-input v-model.trim="form.packagePrice" autocomplete="off" />
      </el-form-item>
      <tree-transfer
        :default-props="transferProps"
        :from_data="fromItemList"
        node_key="projectId"
        :title="['未选择项目', '已选择项目']"
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
  import { getAllProjects, editMedicalPackage } from '@/api/medicalPackageManage'
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
          packageName: '',
          packagePrice: '',
          itemAddIds: [],
          itemRmIds: [],
        },
        rules: {
          packageName: [{ required: true, trigger: 'blur', message: '请输入套餐名称' }],
          packagePrice: [
            { required: true, trigger: 'blur', message: '请输入价格' },
            { validator: validPrice, trigger: 'blur' },
          ],
        },
        title: '',
        dialogFormVisible: false,
        fromItemList: [],
        toItemList: [],
        itemAddIds: [],
        itemRmIds: [],
        toIds: [],
        transferProps: {
          label: 'projectName',
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
        //packageId存在则携带进行请求
        this.fetchData(!row || !row.packageId ? '' : row.packageId)
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
            //排除原来已有的菜单
            this.itemAddIds = this.itemAddIds.filter((id) => this.toIds.indexOf(id) == -1)
            //排除原来未有的菜单
            this.itemRmIds = this.itemRmIds.filter((id) => this.toIds.indexOf(id) != -1)

            this.form.itemAddIds = this.itemAddIds
            this.form.itemRmIds = this.itemRmIds

            const { msg } = await editMedicalPackage(this.form)
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
      async fetchData(packageId) {
        const { data } = await getAllProjects({ packageId })
        const { depts, fromItems, toItems } = data
        this.deptList = depts
        this.fromItemList = fromItems
        this.toItemList = toItems
        //抽取体检套餐中已存在projectId
        this.toIds = toItems.map((item) => item.projectId)
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
<style scoped>
  .line {
    text-align: center;
  }
</style>
