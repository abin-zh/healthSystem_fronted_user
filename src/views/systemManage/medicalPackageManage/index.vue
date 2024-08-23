<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
        <el-button icon="el-icon-delete" type="danger" @click="handleDelete">删除</el-button>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" class="form" :inline="true" :model="queryForm" @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="queryForm.data.beginPrice" placeholder="下限" />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">
            <el-form-item>
              <el-col class="line">-</el-col>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="queryForm.data.endPrice" placeholder="上限" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="queryForm.data.packageName" placeholder="输入名称查询" />
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
      @selection-change="setSelectRows"
      @sort-change="tableSortChange"
    >
      <el-table-column show-overflow-tooltip type="selection" width="55" />
      <el-table-column label="序号" show-overflow-tooltip width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="套餐名称" prop="packageName" show-overflow-tooltip />
      <el-table-column label="价格" prop="packagePrice" show-overflow-tooltip />
      <el-table-column label="项目列表(点击查看)">
        <template #default="scope">
          <el-popover placement="right" trigger="click" width="400" @show="handleItemShow(scope.row)">
            <el-button slot="reference">查看项目</el-button>
            <div v-loading="itemLoading">
              <template v-if="itemList.length <= 0">
                <span>该体检套餐还未添加体检项目</span>
              </template>
              <template v-else>
                <ul>
                  <li v-for="(item, key) in itemList" :key="key">
                    {{ item.projectName }}
                  </li>
                </ul>
              </template>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="是否删除" prop="packageIsDeleted" show-overflow-tooltip>
        <template #default="scope">
          <el-tag v-if="scope.row.packageIsDeleted == 0">未删除</el-tag>
          <el-tag v-else type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="180px">
        <template #default="{ row }">
          <template v-if="row.packageIsDeleted == 0">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row)">删除</el-button>
          </template>
          <template v-else>
            <el-button type="text" @click="handleRestore(row)">恢复</el-button>
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
  </div>
</template>

<script>
  import TableEdit from './components/TableEdit'
  import { deleteMedicalPackages, getMedicalPackages, getMedicalPackageProjects } from '../../../api/medicalPackageManage'

  export default {
    name: 'ComprehensiveTable',
    components: {
      TableEdit,
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
        list: [],
        itemList: [],
        listLoading: true,
        itemLoading: false,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        background: true,
        selectRows: '',
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          data: {
            packageName: '',
            beginPrice: '',
            endPrice: '',
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
    created() {
      this.fetchData()
    },
    beforeDestroy() {
      clearTimeout(this.timeOutID)
    },
    mounted() {},
    methods: {
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item, index) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await deleteMedicalPackages({ ids: row.packageId })
            this.$baseMessage(msg, 'success')
            this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.packageId)
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await deleteMedicalPackages({ ids: ids })
              this.$baseMessage(msg, 'success')
              this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error')
            return false
          }
        }
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
        const { data, count } = await getMedicalPackages(this.queryForm)
        this.list = data
        this.total = count
        this.timeOutID = setTimeout(() => {
          this.listLoading = false
        }, 500)
      },
      async fetchItem(packageId) {
        this.itemLoading = true
        const { data } = await getMedicalPackageProjects({ packageId })
        this.itemList = data
        this.timeOutID = setTimeout(() => {
          this.itemLoading = false
        }, 500)
      },
      handleItemShow(row) {
        this.fetchItem(row.packageId)
      },
    },
  }
</script>
<style scoped>
  .form {
    display: flex;
    justify-content: flex-end;
  }
</style>
