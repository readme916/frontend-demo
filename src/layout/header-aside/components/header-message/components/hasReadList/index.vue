<template>
  <d2-container>
    <el-table :data="list" border stripe style="width: 100%" size="mini" highlight-current-row @current-change="handleRowChange">

      <el-table-column prop="type" label="类型" width="80px" align="center">
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

      <el-table-column label="发送时间" width="140px" prop="createdAt">
      </el-table-column>

       <el-table-column label="读取时间" width="140px" prop="modifiedAt">
      </el-table-column>

    </el-table>
    <br>
    
      <el-pagination :current-page="current" :page-size="size" :total="total" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>

     <el-dialog :title="currentRow.title" :visible.sync="dialogFormVisible" append-to-body v-if="currentRow">
      <el-form>
        <el-form-item label="消息类型">
          <span v-if="currentRow.type=='MESSAGE'">个人消息</span>
          <span v-else-if="currentRow.type=='NOTICE'">系统通知</span>
        </el-form-item>
        <el-form-item label="通知时间">
          {{currentRow.createdAt}}
        </el-form-item>
         <el-form-item label="查看时间">
          {{currentRow.modifiedAt}}
        </el-form-item>
        <el-form-item label="通知内容">
          {{currentRow.content}}
        </el-form-item>

      </el-form>
      
    </el-dialog>
  </d2-container>

</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
import { hasReadMessageList } from "@/api/sys.message"
import dayjs, { Dayjs } from 'dayjs'
export default {

  data: function () {
    return {
      list: [],
      current: 1,
      size: 10,
      total: 0,
       dialogFormVisible: false,
      currentRow: {}
    }
  },

  methods: {
  handleRowChange(row) {
      this.currentRow = row
      this.dialogFormVisible = true
    },
   
    refresh: function () {
      hasReadMessageList(this.current - 1, this.size).then(res => {
        this.list = res.items.map(item => {
          item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
          item.modifiedAt = dayjs(item.modifiedAt).format('YYYY-MM-DD HH:mm:ss')
          return item
        });
        this.total = res.total
      })
    },

    handleSizeChange(val) {
      this.size = val
      this.refresh()
    },
    handleCurrentChange(val) {

      this.current = val
      this.refresh()

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
