<template>
  <d2-container :filename="filename" class="page">
    <span>服务状态：
      <el-tag :type="type">{{status}}</el-tag>

    </span>

    <span>
      <el-switch v-if="status !='已下线'" style="display: block" v-model="up" active-color="#13ce66" inactive-color="#ff4949" active-text="开启" inactive-text="关闭" >

      </el-switch>
    </span>

  </d2-container>
</template>

<script>
import {getServer,postServerOnline,postServerOffline} from '@/api/sys.server'
export default {

  data() {
    return {
      filename: __filename
    }
  },

  computed: {
    servers: function () {
      return this.$store.state.d2admin.server.servers
    },
    type: function () {
      if (this.status == '已下线') {
        return 'info'
      } else if (this.status == '正常') {
        return 'success'
      } else {
        return 'danger'
      }
    },

    status: function () {
      var application = this.$route.params.application;
      var server = this.servers.find(e => e.name == application)
      if (!server) {
        return '已下线'
      } else if (server.status == 'UP') {
        return '正常'
      } else {
        return '维护中'
      }
    },

    up: {
      get: function () {
        var application = this.$route.params.application;
        var server = this.servers.find(e => e.name == application)
        if (server) {
          if (server.status == 'UP') {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      set: function (val) {
        var application = this.$route.params.application;
        var server = this.servers.find(e => e.name == application)
        if (server) {
          if(server.status == "UP"){
            postServerOffline(application).then(res =>{
              if(res == 'ok'){
                server.status = "OUT_OF_SERVICE"
              }
            })
          }else{
            postServerOnline(application).then(res => {
              if(res == 'ok'){
                server.status = "UP"
              }
            })
          }
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.page {
  .page__logo {
    width: 120px;
  }
  .page__btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    span {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
    }
  }
}
</style>
