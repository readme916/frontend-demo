<template>
  <el-table :data="list" border stripe style="width: 100%" size="mini">

    <el-table-column prop="type" label="类型" width="80px" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type === 'NOTICE'" size="mini" type="danger">
          <d2-icon name="notice" /> 通知
        </el-tag>
        <el-tag v-else size="mini" type="primary">
          <d2-icon name="dot-circle-o" /> 消息
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="标题" prop="title" width="140px" :show-overflow-tooltip="true">
    </el-table-column>

    <el-table-column label="内容" prop="content" :show-overflow-tooltip="true">
    </el-table-column>

    <el-table-column label="时间" width="140px" prop="createdAt">
    </el-table-column>

  </el-table>

</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
import { hasReadMessageList } from "@/api/sys.message"
import dayjs, { Dayjs } from 'dayjs'
export default {

  data: function () {
    return {
      list: []
    }
  },

  methods: {
    refresh: function () {
      hasReadMessageList().then(res => {
        this.list = res.items.map(item => {
          item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
          return item
        });
      })
    }
  }
}
</script>

<style lang="scss">
.d2-error-log-list__expand-group {
  .d2-error-log-list__expand {
    padding-left: 20px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0px;
    }
    .d2-error-log-list__expand-title {
      font-size: 16px;
      font-weight: bold;
      margin-top: 0px;
      margin-bottom: 10px;
    }
    .d2-error-log-list__expand-value {
      font-size: 12px;
      margin-top: 0px;
      margin-bottom: 0px;
    }
  }
  .d2-error-log-list__expand--log {
    border-left: 4px solid $color-info;
  }
  .d2-error-log-list__expand--error {
    border-left: 4px solid $color-danger;
  }
}
</style>
