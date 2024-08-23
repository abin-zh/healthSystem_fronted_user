<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model.trim="form.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model.trim="form.component" autocomplete="off" />
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model.trim="form.path" autocomplete="off" />
      </el-form-item>
      <el-form-item label="父级菜单">
        <el-select v-model="form.parentId" placeholder="请选择父级菜单">
          <el-option label="顶级菜单" value="0" />
          <el-option v-for="(item, key) in menus" :key="key" :label="item.title" :value="item.id + ''" />
        </el-select>
      </el-form-item>
      <template v-if="title == '编辑'">
        <el-form-item label="权重" prop="order">
          <el-input v-model.trim="form.order" autocomplete="off" />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model.trim="form.redirect" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model.trim="form.icon" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否禁用" prop="menuIsDeleted">
          <el-select v-model="form.menuIsDeleted" placeholder="请选择是否禁用">
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
  import { getMenus, editMenu } from '@/api/menuManage'

  export default {
    name: 'TableEdit',
    data() {
      return {
        form: {
          name: '',
          title: '',
          component: '',
          path: '',
          parentId: '',
          order: '',
          redirect: '',
          icon: '',
          menuIsDeleted: '',
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入菜单名称' }],
          title: [{ required: true, trigger: 'blur', message: '请输入菜单标题' }],
          path: [{ required: true, trigger: 'blur', message: '请输入菜单路径' }],
          parentId: [{ required: true, trigger: 'blur', message: '请选择父级菜单' }],
        },
        title: '',
        dialogFormVisible: false,
        menus: [],
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
          this.form.parentId = row.parentId.toString()
          this.form.menuIsDeleted = row.menuIsDeleted.toString()
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
            const { msg } = await editMenu(this.form)
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
        const { data } = await getMenus({
          pageNo: 0,
          pageSize: 0,
          data: {},
        })
        this.menus = data
      },
    },
  }
</script>
