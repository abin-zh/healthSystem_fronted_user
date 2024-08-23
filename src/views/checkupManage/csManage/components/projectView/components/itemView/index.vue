<template>
  <el-dialog :append-to-body="true" :title="title" :visible.sync="dialogFormVisible" width="700px" @close="close">
    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height">
      <el-table-column label="序号" show-overflow-tooltip width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="细项名称" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.item.itemName }}
        </template>
      </el-table-column>
      <el-table-column label="正常值范围" show-overflow-tooltip>
        <template #default="scope">
          <el-tag type="success">{{ scope.row.item.itemLowerLimit + ' ~ ' + scope.row.item.itemUpperLimit }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="结果(数值)" prop="icrResult" show-overflow-tooltip />
      <el-table-column label="结论" prop="icrSummary" />
      <el-table-column label="体检医生" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.staff ? scope.row.staff.staffName : '' }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
  import { getProjectItems } from '@/api/billManage'

  export default {
    name: 'ItemTable',
    data() {
      return {
        list: [],
        listLoading: false,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        timeOutID: null,
        form: {
          psId: '',
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    created() {},
    methods: {
      showEdit(row) {
        if (row) {
          this.title = '细项结果'
          this.form = Object.assign({}, row)
          this.fetchData()
        }
        this.dialogFormVisible = true
      },
      close() {
        this.dialogFormVisible = false
      },
      async fetchData() {
        this.list = []
        this.listLoading = true
        const { data, count } = await getProjectItems(this.form)
        this.list = data
        this.total = count
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
    },
  }
</script>
<style scoped>
  .line {
    text-align: center;
  }
</style>
