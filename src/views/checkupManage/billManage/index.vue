<template>
  <div class="table-container">
    <vab-query-form>
      <vab-query-form-left-panel>
        <div class="spot"></div>
      </vab-query-form-left-panel>
      <vab-query-form-right-panel>
        <el-form ref="form" class="list-form" :inline="true" :model="queryForm" @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="queryForm.data.userName" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="queryForm.data.userPhone" placeholder="手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-input v-model="queryForm.data.userIdCard" placeholder="身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="queryForm.data.userGender" placeholder="性别">
                <el-option label="所有性别" value="" />
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
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
      <el-table-column label="姓名" prop="userName" show-overflow-tooltip />
      <el-table-column label="性别" prop="userGender" show-overflow-tooltip>
        <template #default="{ row }">
          <i v-if="row.userGender == 1" class="el-icon-male male"></i>
          <i v-else class="el-icon-female female"></i>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="userPhone" show-overflow-tooltip sortable />
      <el-table-column label="身份证号" prop="userIdCard" show-overflow-tooltip />
      <el-table-column label="是否删除" prop="userIsDeleted" show-overflow-tooltip>
        <template #default="scope">
          <el-tag v-if="scope.row.userIsDeleted == 0">未删除</el-tag>
          <el-tag v-else type="danger">已删除</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="年龄" prop="userBirthday" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-if="row.userBirthday" type="success">{{ calculateAge(row.userBirthday) }}岁</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="180px">
        <template #default="{ row }">
          <template v-if="row.userIsDeleted == 0">
            <el-button type="text" @click="handleEdit(row)">开单</el-button>
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
  import { getUsers } from '@/api/userManage'
  import { calculateAge } from '@/utils'

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
        calculateAge: calculateAge,
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
            userName: '',
            userPhone: '',
            userIdCard: '',
            userGender: '',
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
    mounted() {},
    methods: {
      setSelectRows(val) {
        this.selectRows = val
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
        this.listLoading = true
        const { data, count } = await getUsers(this.queryForm)
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
  .male {
    color: #409eff;
  }
  .female {
    color: pink;
  }
</style>
