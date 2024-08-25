<template>
  <div class="index-container">
    <el-row>
      <el-carousel arrow="always" class="custom-carousel" height="320px" :interval="4000" type="card">
        <el-carousel-item v-for="item in items" :key="item.id">
          <div class="img-box">
            <img alt="Carousel Image" :src="item" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </el-row>
    <h3 style="margin-left: 4px">推荐</h3>
    <div class="func-box">
      <el-col v-for="item in cards" :key="item.id" :span="6">
        <div class="card-box">
          <el-card shadow="hover">
            <div class="route-box" @click="$router.push(item.path)">
              <div class="icon-box">
                <i :class="item.icon"></i>
              </div>
              <span>{{ item.title }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
  import { dependencies, devDependencies } from '../../../package.json'
  import { calculateAge, ageGroupStatistics } from '@/utils'
  import { getUsers } from '@/api/userManage'

  export default {
    data() {
      return {
        timer: 0,
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        nodeEnv: process.env.NODE_ENV,
        dependencies: dependencies,
        devDependencies: devDependencies,
        ageGroupLength: 0,
        ageGroup: {
          tooltip: {
            trigger: 'item',
          },
          color: ['#1890FF', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5'],
          backgroundColor: 'rgba(252,252,252,0)',
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          series: [
            {
              name: '用户年龄段',
              type: 'pie',
              radius: ['40%', '70%'],
              padAngle: 5,
              itemStyle: {
                borderRadius: 2,
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold',
                },
              },
              data: [],
              smooth: true,
              areaStyle: {},
            },
          ],
        },
        items: [
          'https://images.pexels.com/photos/281279/pexels-photo-281279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          'https://images.pexels.com/photos/6109124/pexels-photo-6109124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          'https://images.pexels.com/photos/7249178/pexels-photo-7249178.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        ],
        cards: [
          {
            id: 0,
            icon: 'el-icon-tickets',
            title: '体检项目',
            path: '/medical_project',
          },
          {
            id: 1,
            icon: 'el-icon-goods',
            title: '体检套餐',
            path: '/medical_package',
          },
          {
            id: 2,
            icon: 'el-icon-s-order',
            title: '体检办理',
            path: '/bill',
          },
          {
            id: 3,
            icon: 'el-icon-document',
            title: '体检报告',
            path: '/checkup_summary ',
          },
        ],
      }
    },
    created() {},
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      async fetchData() {
        const userRes = await getUsers({
          pageNo: 0,
          pageSize: 0,
          data: {},
        })
        this.ageGroupLength = userRes.data.length
        this.filterAgeGroup(userRes.data)
      },
      filterAgeGroup(data) {
        //映射出年龄集合
        let ageList = data.map((item) => calculateAge(item.userBirthday))
        //剔除非数字
        ageList = ageList.filter((age) => !isNaN(age))

        this.ageGroup.series[0].data = ageGroupStatistics(ageList)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 115px;
        }
      }
    }

    .card {
      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 117px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }
  }

  .img-box {
    height: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .img-box img {
    width: 95%;
    height: 100%;
    border-radius: 16px;
  }

  .el-card {
    border-radius: 16px;
    margin-left: 2px;
  }

  .el-card:hover {
    cursor: pointer;
  }

  .route-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }

  .route-box .icon-box {
    font-size: 32px;
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 1px solid #e3e3e3;
  }

  .func-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .card-box {
    width: 95%;
    height: 100%;
  }
</style>
