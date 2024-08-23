<template>
  <el-dialog :modal-append-to-body="false" :title="title" :visible.sync="dialogFormVisible" width="800px" @close="close">
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
    <item-table ref="item" />
  </el-dialog>
</template>

<script>
  import { getAllOrderProjects } from '@/api/billManage'
  import { formatTimestamp } from '@/utils'
  import ItemTable from './components/itemView'

  export default {
    name: 'ProjectTable',
    components: {
      ItemTable,
    },
    data() {
      return {
        formatTimestamp: formatTimestamp,
        list: [],
        listLoading: false,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        timeOutID: null,
        form: {
          csOrderId: '',
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
          this.title = '项目小结'
          this.form = Object.assign({}, row)
          this.fetchData()
        }
        this.dialogFormVisible = true
      },
      close() {
        this.dialogFormVisible = false
      },
      handleItem(row) {
        this.$refs['item'].showEdit(row)
      },
      async fetchData() {
        this.list = []
        this.listLoading = true
        const { data, count } = await getAllOrderProjects(this.form)
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
