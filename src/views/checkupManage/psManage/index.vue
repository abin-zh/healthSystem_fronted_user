<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-full-screen" type="primary">扫码</el-button>
        <template v-if="list && list.length > 0 && list[0].user">
          <el-tag class="tag">{{ list[0].user.userName }}</el-tag>
          <el-tag class="tag">
            <i v-if="list[0].user.userGender == 1" class="el-icon-male male"></i>
            <i v-else class="el-icon-female female"></i>
          </el-tag>
          <el-tag class="tag">{{ calculateAge(list[0].user.userBirthday) }}岁</el-tag>
          <el-tag class="tag">{{ list[0].user.userPhone }}</el-tag>
          <el-tag class="tag">{{ list[0].user.userIdCard }}</el-tag>
        </template>
        <!-- <template v-if="list && list.length > 0 && list[0].user">
          <el-descriptions border :column="6">
            <el-descriptions-item label="姓名">{{ list[0].user.userName }}</el-descriptions-item>
            <el-descriptions-item label="性别">
              <i v-if="list[0].user.userGender == 1" class="el-icon-male male"></i>
              <i v-else class="el-icon-female female"></i>
            </el-descriptions-item>
            <el-descriptions-item label="年龄" :span="2">{{ calculateAge(list[0].user.userBirthday) }}岁</el-descriptions-item>
            <el-descriptions-item label="手机号">
              {{ list[0].user.userPhone }}
            </el-descriptions-item>
            <el-descriptions-item label="身份证号">
              {{ list[0].user.userIdCard }}
            </el-descriptions-item>
          </el-descriptions>
        </template> -->
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" class="list-form" :inline="true" :model="queryForm" @submit.native.prevent>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="queryForm.data.orderNumber" placeholder="体检编号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="queryForm.data.userPhone" placeholder="手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="queryForm.data.userIdCard" placeholder="身份证号" />
            </el-form-item>
          </el-col>
          <el-form-item>
            <el-button icon="el-icon-search" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
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
      <el-table-column type="expand">
        <template #default="props">
          <el-table ref="tableSort" v-loading="listLoading" :data="props.row.projectSummaries" :height="height">
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
                <el-button type="text" @click="handleEdit(row)">编辑小结</el-button>
                <el-button type="text" @click="handleItem(row)">查看细项</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" show-overflow-tooltip width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="体检编号" prop="orderNumber" show-overflow-tooltip />
      <el-table-column label="开单时间" prop="orderTime" show-overflow-tooltip>
        <template #default="scope">
          {{ formatTimestamp(scope.row.orderTime, 'datetime') }}
        </template>
      </el-table-column>
      <el-table-column label="状态" show-overflow-tooltip>
        <template #default="scope">
          <el-tag v-if="scope.row.orderStatus == 1" type="success">已支付</el-tag>
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
    <item-table ref="item" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import TableEdit from './components/TableEdit'
  import ItemTable from './components/item'
  import { getDeptBill } from '@/api/billManage'
  import { formatTimestamp, calculateAge } from '@/utils'

  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
      ItemTable,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
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
          data: {
            orderNumber: '',
            userPhone: '',
            userIdCard: '',
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
    mounted() {},
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleItem(row) {
        this.$refs['item'].showEdit(row)
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
        const { data, count } = await getDeptBill(this.queryForm)
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
