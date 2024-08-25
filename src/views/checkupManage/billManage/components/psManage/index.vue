<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="760px">
    <el-table ref="tableSort" v-loading="listLoading" :data="list" :height="height">
      <el-table-column label="序号" show-overflow-tooltip width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.project.projectName }}
        </template>
      </el-table-column>
      <el-table-column label="项目小结" prop="psSummary" show-overflow-tooltip>
        <template #default="scope">
          <el-tag v-if="!scope.row.psSummary" type="warning">还未填写</el-tag>
          <template v-else>
            {{ scope.row.psSummary }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="体检医生" prop="staffName" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.staff ? scope.row.staff.staffName : '' }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="psTime" show-overflow-tooltip>
        <template #default="scope">
          {{ formatTimestamp(scope.row.psTime, 'datetime') }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="staffName" show-overflow-tooltip>
        <template #default="scope">
          <el-tag v-if="scope.row.psStatus == 0" type="warning">未评价</el-tag>
          <el-tag v-if="scope.row.psStatus == 1" type="success">已评价</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleItem(row)">查看细项</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :background="background"
      :current-page="queryForm.pageNo"
      :layout="layout"
      :page-size="queryForm.pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <item-table ref="item" @fetch-data="fetchData" />
  </el-dialog>
</template>

<script>
  import ItemTable from './components/item'
  import { getUserProjectSummaries } from '@/api/billManage'
  import { formatTimestamp, calculateAge } from '@/utils'

  export default {
    name: 'PsManage',
    components: {
      ItemTable,
    },
    data() {
      return {
        title: '',
        dialogFormVisible: false,
        formatTimestamp: formatTimestamp,
        calculateAge: calculateAge,
        list: [],
        listLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          data: {
            orderId: '',
          },
        },
        timeOutID: null,
      }
    },
    computed: {
      height() {
        return this.$baseTableHeight()
      },
    },
    beforeDestroy() {
      clearTimeout(this.timeOutID)
    },
    methods: {
      showEdit(row) {
        if (row) {
          this.title = '体检小结'
          this.queryForm.data = Object.assign({}, row)
        }
        this.fetchData()
        this.dialogFormVisible = true
      },
      handleItem(row) {
        this.$refs['item'].showEdit(row)
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      async fetchData() {
        this.list = []
        this.listLoading = true
        const { data, count } = await getUserProjectSummaries(this.queryForm)
        this.list = data
        this.total = count
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      tableRowClassName({ row, rowIndex }) {
        return 'row-order'
      },
    },
  }
</script>
<style>
  .el-table .row-order {
    background: #fafafa;
  }
</style>
