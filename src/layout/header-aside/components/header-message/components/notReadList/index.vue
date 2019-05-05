<template>
  <div>
    <el-table :data="messageList" border stripe style="width: 100%" size="mini" highlight-current-row @current-change="handleRowChange">

      <el-table-column prop="type" label="类型" width="80px" align="center" :filters="[
        { text: '个人消息', value: 'MESSAGE' },
        { text: '系统通知', value: 'NOTICE' }
      ]" :filter-multiple="false" :filter-method="filterType" filter-placement="bottom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 'NOTICE'" size="mini" type="danger">
            通知
          </el-tag>
          <el-tag v-else size="mini" type="primary">
            消息
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

    <el-dialog :title="currentRow.title" :visible.sync="dialogFormVisible" append-to-body v-if="currentRow">
      <el-form>
        <el-form-item label="消息类型">
          <span v-if="currentRow.type=='MESSAGE'">个人消息</span>
          <span v-else-if="currentRow.type=='NOTICE'">系统通知</span>
        </el-form-item>
        <el-form-item label="通知时间">
          {{currentRow.createdAt}}
        </el-form-item>
        <el-form-item label="通知内容">
          {{currentRow.content}}
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">未读</el-button>
        <el-button type="primary" @click="readIt">已读</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
import ExpandItem from './components/ExpandItem'
import { readMessage } from "@/api/sys.message"
export default {
  name: 'd2-message-list',
  components: {
    ExpandItem
  },

  data: function () {
    return {
      dialogFormVisible: false,
      currentRow: {}
    }
  },
  computed: {
    ...mapState('d2admin', {
      messageList: state => state.message.list
    }),
  },
  methods: {

    readIt() {
      this.dialogFormVisible = false
      readMessage(this.currentRow.uuid).then(res => {
        this.messageList.splice(this.messageList.indexOf(this.currentRow),1)
       
      })
    },
    handleRowChange(row) {
      this.currentRow = row
      this.dialogFormVisible = true
    },
    filterType(value, row) {
      return row.type === value
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
