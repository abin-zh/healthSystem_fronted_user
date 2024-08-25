<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-descriptions v-loading="listLoading" border :column="1" direction="vertical">
      <template v-if="summary">
        <el-descriptions-item label="总结医生">{{ summary.staff.staffName }}</el-descriptions-item>
        <el-descriptions-item label="总结内容">{{ summary.csSummary }}</el-descriptions-item>
      </template>
    </el-descriptions>
  </el-dialog>
</template>

<script>
  import { getUserCheckup } from '@/api/billManage'

  export default {
    name: 'CsManage',

    data() {
      return {
        title: '',
        dialogFormVisible: false,
        summary: {},
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
          this.title = '体检总结'
          this.queryForm.data = Object.assign({}, row)
        }
        this.fetchData()
        this.dialogFormVisible = true
      },
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
        const { data } = await getUserCheckup(this.queryForm).catch((err) => {
          this.dialogFormVisible = false
          this.timeOutID = setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
        this.summary = data
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
    },
  }
</script>
