<template>
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown">
      <!--<el-avatar class="user-avatar" :src="avatar"></el-avatar>-->
      <template v-if="accessToken">
        <img :src="avatar" alt="" class="user-avatar" />
        <div class="user-name">
          {{ username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="pay" divided>充值</el-dropdown-item>
          <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
      <template v-else>
        <el-button @click="$router.push('/login')">前往登录</el-button>
      </template>
    </span>
    <top-up ref="topup"></top-up>
  </el-dropdown>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { recordRoute } from '@/config'
  import TopUp from './components/TopUp'
  export default {
    name: 'VabAvatar',
    components: {
      TopUp,
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
        accessToken: 'user/accessToken',
      }),
    },
    data() {
      return {
        userPay: userPay,
      }
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
          case 'personalCenter':
            this.personalCenter()
            break
          case 'pay':
            this.handlePay()
        }
      },
      personalCenter() {
        this.$router.push('/personalCenter/personalCenter')
      },
      logout() {
        this.$baseConfirm('您确定要退出' + this.$baseTitle + '吗?', null, async () => {
          await this.$store.dispatch('user/logout')
          if (recordRoute) {
            const fullPath = this.$route.fullPath
            this.$router.push(`/login?redirect=${fullPath}`)
          } else {
            this.$router.push('/login')
          }
        })
      },
      handlePay() {
        this.$refs['topup'].showEdit()
      },
    },
  }
</script>
<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;
    height: 50px;
    padding: 0;

    .user-avatar {
      width: 40px;
      height: 40px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      margin-left: 5px;
      margin-left: 5px;
      cursor: pointer;
    }
  }
</style>
