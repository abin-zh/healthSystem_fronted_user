<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button type="primary" @click="handleEdit(row)">体检办理</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" class="list-form" :inline="true" :model="queryForm" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="queryForm.data.orderNumber" placeholder="体检编号" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" native-type="submit" type="primary" @click="handleQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </vab-query-form-right-panel>
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="height">
      <el-table-column label="序号" show-overflow-tooltip width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="体检编号" prop="orderNumber" />
      <el-table-column label="总价" prop="orderTotalAmount" />
      <el-table-column label="创建时间" show-overflow-tooltip>
        <template #default="scope">
          {{ formatTimestamp(scope.row.orderTime, 'datatime') }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="ordetStatus">
        <template #default="scope">
          <el-tag v-if="scope.row.orderStatus == 0" type="warning">未支付</el-tag>
          <el-tag v-if="scope.row.orderStatus == 1">已支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template #default="{ row }">
          <template v-if="row.orderStatus == 0">
            <el-button type="text" @click="handlePay(row)">支付</el-button>
          </template>
          <template v-else>
            <el-button type="text" @click="handlePs(row)">查看小结</el-button>
            <el-button type="text" @click="handleCs(row)">查看总结</el-button>
            <el-button type="text" @click="handleReport(row)">体检报告</el-button>
          </template>
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
    <ps-manage ref="ps" />
    <cs-manage ref="cs" />
  </div>
</template>

<script>
  import PsManage from './components/psManage/index'
  import CsManage from './components/csManage/index'
  import TableEdit from './components/TableEdit'
  import { userPayCheckUp } from '@/api/user'
  import { getUserOrders } from '@/api/billManage'
  import { formatTimestamp } from '@/utils'

  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
      PsManage,
      CsManage,
    },
    data() {
      return {
        formatTimestamp: formatTimestamp,
        imgShow: true,
        list: [],
        imageList: [],
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
          },
        },
        uploadHeaders: {
          token: this.$store.state.user.accessToken,
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
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleCs(row) {
        this.$refs['cs'].showEdit(row)
      },
      handlePs(row) {
        this.$refs['ps'].showEdit(row)
      },
      handlePay(row) {
        this.$confirm(`是否支付，将从余额中扣除${row.orderTotalAmount}元`, '提示', {
          confirmButtonText: '支付',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          userPayCheckUp(row).then((res) => {
            this.fetchData()
          })
        })
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
        this.listLoading = true
        const { data, count } = await getUserOrders(this.queryForm).catch((err) => {
          this.timeOutID = setTimeout(() => {
            this.listLoading = false
          })
        })
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
  .table-container {
    padding: 32px;
    box-sizing: border-box;
  }
  .male {
    color: #409eff;
  }
  .female {
    color: pink;
  }
</style>
