<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-steps :active="step" align-center class="steps" finish-status="success">
      <el-step title="套餐" />
      <el-step title="项目" />
      <el-step title="体检单" />
    </el-steps>

    <el-popover v-for="tag in choosePackageList" v-show="itemName != '体检单'" :key="tag.packageId" trigger="hover" @show="handleShow(tag)">
      <div>
        <ul>
          <li v-for="item in showProjectList" :key="item.projectId">{{ item.projectName }}</li>
        </ul>
      </div>
      <el-tag slot="reference" class="tag">
        {{ tag.packageName }}
      </el-tag>
    </el-popover>

    <tree-transfer
      v-show="itemName == 'package'"
      ref="transfer"
      v-loading="loading"
      class="transfer"
      :default-props="{ label: 'packageName' }"
      filter
      :from_data="fromItemList"
      node_key="packageId"
      :title="['未选择套餐', '已选择套餐']"
      :to_data="toItemList"
    />

    <tree-transfer
      v-show="itemName == 'project'"
      ref="transfer"
      v-loading="loading"
      class="transfer"
      :default-props="{ label: 'projectName' }"
      filter
      :from_data="fromItemList"
      node_key="projectId"
      :title="['未选择项目', '已选择项目']"
      :to_data="toItemList"
    />

    <template v-if="itemName == '体检单'">
      <div class="checkup">
        <h2 class="text-center">体检单</h2>
        <p class="text-center" style="color: #f56c6c">请您核对体检单中的套餐、项目，查看是否有重复项目，确认无误后才可提交订单付款</p>
        <div>
          <h3>您选择的套餐</h3>
          <el-popover v-for="tag in choosePackageList" :key="tag.packageId" trigger="hover" @show="handleShow(tag)">
            <div>
              <ul>
                <li v-for="item in showProjectList" :key="item.projectId">{{ item.projectName }}</li>
              </ul>
            </div>
            <el-tag slot="reference" class="tag">
              {{ tag.packageName }}
            </el-tag>
          </el-popover>
        </div>
        <div>
          <h3>您选择的项目</h3>
          <el-popover v-for="tag in chooseProjectList" :key="tag.projectId">
            <el-tag slot="reference" class="tag">
              {{ tag.projectName }}
            </el-tag>
          </el-popover>
        </div>
        <div>
          <h3 class="text-right">总金额</h3>
          <h3 class="text-right" style="color: #e6a23c">{{ orderTotalAmount }}元</h3>
        </div>
      </div>
    </template>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button :disabled="step == 0" icon="el-icon-refresh" type="warning" @click="preStep">重新选择</el-button>
      <el-button icon="el-icon-right" type="success" @click="nextStep">{{ btnTitle }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getAllPackages } from '@/api/medicalPackageManage'
  import { getAllProjects } from '@/api/medicalProjectManage'
  import { addBill } from '@/api/billManage'
  import treeTransfer from 'el-tree-transfer'

  export default {
    name: 'TableEdit',
    components: {
      treeTransfer,
    },
    data() {
      return {
        loading: false,
        form: {
          userId: '',
          orderTotalAmount: '',
          packageAddIds: [],
          projectAddIds: [],
        },
        title: '',
        btnTitle: '下一步',
        dialogFormVisible: false,
        deptList: [],
        projectList: [],
        packageList: [],
        choosePackageList: [],
        chooseProjectList: [],
        fromItemList: [],
        toItemList: [],
        itemName: '',
        step: 0,
        showProjectList: [],
      }
    },
    computed: {
      orderTotalAmount() {
        const packagePrices = this.choosePackageList.map((item) => item.packagePrice)
        const projectPrices = this.chooseProjectList.map((item) => item.projectPrice)

        // 计算总金额
        const totalPackagePrice = packagePrices.reduce((total, price) => total + price, 0)
        const totalProjectPrice = projectPrices.reduce((total, price) => total + price, 0)

        // 返回总金额
        return totalPackagePrice + totalProjectPrice
      },
    },
    methods: {
      showEdit(row) {
        this.step = 0
        if (row) {
          this.title = '开单'
          this.btnTitle = '下一步'
          this.choosePackageList = []
          this.form = Object.assign({}, row)
        }
        this.fetchData('package')
        this.dialogFormVisible = true
      },
      close() {
        this.dialogFormVisible = false
        this.$emit('fetch-data')
      },
      async fetchData(name) {
        let res = ''
        this.loading = true

        //获取数据
        if (name == 'package') {
          res = await getAllPackages()
        } else {
          res = await getAllProjects()
        }

        //重置列表和名称
        this.itemName = name
        this.fromItemList = []
        this.toItemList = []
        const { fromItems } = res.data
        this.fromItemList = fromItems
        this.loading = false
      },
      nextStep() {
        this.step++
        switch (this.step) {
          case 1:
            this.choosePackageList = this.toItemList
            this.form.packageAddIds = this.toItemList.map((item) => item.packageId)
            this.fetchData('project')
            this.btnTitle = '下一步'
            break
          case 2:
            this.chooseProjectList = this.toItemList
            this.form.projectAddIds = this.toItemList.map((item) => item.projectId)
            if (this.form.packageAddIds.length <= 0 && this.form.projectAddIds.length <= 0) {
              this.$baseMessage('请您选择套餐或项目', 'error')
              this.step = 1
              break
            }
            this.itemName = '体检单'
            this.btnTitle = '提交订单'
            break
          case 3:
            this.save()
        }
        this.$refs['transfer'].clearChecked()
      },
      preStep() {
        this.step = 0
        this.btnTitle = '下一步'
        this.choosePackageList = []
        this.chooseProjectList = []
        this.fetchData('package')
      },
      handleShow(tag) {
        this.showProjectList = tag.projects
      },
      save() {
        //查找是否有重复项目
        let confirmMsg = '已核对体检单信息，确定提交?'
        const allProjects = this.choosePackageList.map((item) => item.projects)
        const hasProjectsIds = this.chooseProjectList.map((item) => item.projectId)
        for (let projects of allProjects) {
          const repeat = projects.filter((item) => hasProjectsIds.includes(item.projectId))
          if (repeat.length > 0) {
            confirmMsg = '您的选择的项目已在套餐中包含，确定提交?'
            break
          }
        }

        //开单
        this.form.orderTotalAmount = this.orderTotalAmount
        this.$confirm(confirmMsg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            addBill(this.form).then((res) => {
              this.$baseMessage(res.msg, 'success')
            })
            this.dialogFormVisible = false
          })
          .catch(() => {
            this.dialogFormVisible = false
          })
      },
    },
  }
</script>
<style>
  .step-btn {
    display: flex;
    justify-content: center;
  }
  .wl-transfer {
    margin: 16px 0;
  }
  .steps {
    margin-bottom: 16px;
  }
  .checkup {
    width: 100%;
    padding: 16px;
    box-shadow: 1px 1px 4px rgb(172, 172, 172);
    box-sizing: border-box;
    border-radius: 16px;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
</style>
