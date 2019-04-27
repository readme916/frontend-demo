<template>
  <d2-container :filename="filename" class="page">
    <el-table :data="servers" stripe style="width: 100%">
      <el-table-column prop="nickname" label="服务" width="180">
      </el-table-column>
      <el-table-column prop="number" label="数量" width="180">
      </el-table-column>
      <el-table-column prop="status" label="状态">

        <template slot-scope="scope">
          <el-tag :type="scope.row[scope.column.property]=='UP'?'success':'danger'">{{transfer(scope.row[scope.column.property])}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </d2-container>
</template>

<script>
import D2HelpBtn from './components/d2-help-btn'
import D2Badge from './components/d2-badge'
export default {
  components: {
    D2HelpBtn,
    D2Badge
  },
  data() {
    return {
      filename: __filename
    }
  },
  methods:{
 transfer: function(label){
      if(label=="UP"){
        return '正常'
      }
      if(label == 'OUT_OF_SERVICE'){
        return '维护中'
      }
    },
  },
  computed: {
   
    servers: function () {
      return this.$store.state.d2admin.server.servers
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
