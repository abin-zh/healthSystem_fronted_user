<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-badge :max="20" :type="list.length > 0 ? 'danger' : 'success'" :value="list.length">
          <el-button @click="fetchData">待总结</el-button>
        </el-badge>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel />
    </vab-query-form>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      :row-class-name="tableRowClassName"
      @selection-change="setSelectRows"
    >
      <el-table-column label="序号" show-overflow-tooltip width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="体检编号" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.order.orderNumber }}
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.user.userName }}
        </template>
      </el-table-column>
      <el-table-column label="用户性别" show-overflow-tooltip>
        <template #default="scope">
          <el-tag class="tag">
            <i v-if="scope.row.user.userGender == 1" class="el-icon-male male"></i>
            <i v-else class="el-icon-female female"></i>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户年龄" show-overflow-tooltip>
        <template #default="scope">
          <el-tag type="success">{{ calculateAge(scope.row.user.userBirthday) }}岁</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开单时间" prop="orderTime" show-overflow-tooltip>
        <template #default="scope">
          {{ formatTimestamp(scope.row.order.orderTime, 'datetime') }}
        </template>
      </el-table-column>
      <el-table-column label="状态" show-overflow-tooltip>
        <template #default="scope">
          <el-tag v-if="scope.row.csStatus == 0" type="warning">未评价</el-tag>
          <el-tag v-if="scope.row.csStatus == 1" type="warning">待评价</el-tag>
          <el-tag v-if="scope.row.csStatus == 2" type="warning">已评价</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="180px">
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑总结</el-button>
          <el-button type="text" @click="handleItem(row)">查看项目</el-button>
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
    <table-edit ref="edit" @fetch-data="fetchData" />
    <project-table ref="project" />
  </div>
</template>

<script>
  import { getCheckupSummary } from '@/api/billManage'
  import { formatTimestamp, calculateAge } from '@/utils'
  import TableEdit from './components/TableEdit'
  import ProjectTable from './components/projectView'

  export default {
    name: 'ComprehensiveTable',
    components: {
      ProjectTable,
      TableEdit,
    },
    data() {
      return {
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
          data: {},
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
    mounted() {
      this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleItem(row) {
        this.$refs['project'].showEdit(row)
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.list = []
        this.listLoading = true
        const { data, count } = await getCheckupSummary(this.queryForm)
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
