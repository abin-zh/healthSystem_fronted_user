<template>
  <div class="table-container">
    <vab-query-form>
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

    <el-table ref="tableSort" v-loading="listLoading" :data="list" :element-loading-text="elementLoadingText" :height="420">
      <el-table-column label="序号" show-overflow-tooltip width="95">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="套餐名称" prop="packageName" show-overflow-tooltip />
      <el-table-column label="价格" prop="packagePrice" show-overflow-tooltip>
        <template #default="scope">
          <el-tag>{{ scope.row.packagePrice }}</el-tag>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
  import { deleteMedicalPackages, getExistMedicalPackages, getMedicalPackageProjects } from '@/api/medicalPackageManage'

  export default {
    name: 'ComprehensiveTable',
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
        const { data, count } = await getExistMedicalPackages(this.queryForm)
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
  .table-container {
    padding: 32px;
    box-sizing: border-box;
  }
  .form {
    display: flex;
    justify-content: flex-end;
  }
</style>
