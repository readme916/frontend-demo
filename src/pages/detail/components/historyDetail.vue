<template>
  <div>
    <el-table ref="historyDetail" :data="detail.items" highlight-current-row @current-change="handleCurrentChange" stripe>

      <el-table-column label="时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ dayjs(scope.row.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column property="createdBy" label="操作人">
      </el-table-column>
      <el-table-column label="终端">
        <template slot-scope="scope">
          {{getClient(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column label="事件">
        <template slot-scope="scope">
          {{getEvent(scope.row)}}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="详细记录" :visible.sync="dialogTableVisible">
      <el-form label-position='right' label-width="100px">
        <el-form-item label="操作时间：">
          {{ dayjs(currentRow.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </el-form-item>
        <el-form-item label="操作用户：">
          {{ currentRow.createdBy }}
        </el-form-item>
        <el-form-item label="终端类型：">
          {{getClient(currentRow)}}
        </el-form-item>
        <el-form-item label="操作地点：">
          {{getPosition(currentRow)}}
        </el-form-item>
        <el-form-item label="IP 地址：">
          {{currentRow.ip}}
        </el-form-item>
        <el-form-item label="发生事件：">
          {{getEvent(currentRow)}}
        </el-form-item>
        <el-form-item label="请求地址：">
          {{currentRow.requestPath}}
        </el-form-item>
        <el-form-item label="请求格式：">
          <vue-json-pretty :data="currentRow"></vue-json-pretty>
        </el-form-item>
        <el-form-item label="数据变化：">
          <template v-for="(item,key) in currentRow.difference">
            <div v-if="item.type == 'SIMPLE'" :key="key">
              <div>{{getName(key)}}</div>
              <div>
                <itemFormatter :application="application" :resource="resource" :field="key" :item="getOldObject(key,item)" />
              </div>
              <div>
                <itemFormatter :application="application" :resource="resource" :field="key" :item="getNewObject(key,item)" />
              </div>
            </div>
          </template>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import dayjs from "dayjs"
import itemFormatter from '@/pages/common/itemFormatter'
export default {
  name: "historyDetail",

  data: function () {
    return {
      dialogTableVisible: false,
      currentRow: {}
    }
  },
  components: {
    VueJsonPretty,
    itemFormatter
  },
  props: {
    application: "",
    resource: "",
    detail: {
      items: [],
      page: 0,
      size: 10,
      total: 0


    }
  },

  methods: {
    getNewObject(key, item) {
      var ret = {}
      ret[key] = item.newValue
      return ret
    },
    getOldObject(key, item) {
      var ret = {}
      ret[key] = item.oldValue
      return ret
    },
    getName(key) {
      let item = this.getStructure().detailColumns.find(e => e.name == key)
      if (item) {
        return item.label;
      } else {
        return key
      }
    },
    getPosition(row) {

    },
    getClient(row) {
      if (row.client == 'backend') {
        return '后台'
      } else if (row.client == 'frontend') {
        return '前台'
      } else if (row.client == 'mobile') {
        return '手机'
      }
    },

    getEvent(row) {
      if (row.event == 'create') {
        return '创建'
      } else if (row.event == 'update') {
        return '修改'
      } else if (row.event == 'delete') {
        return '删除'
      } else if (row.event == 'link') {
        return '关联'
      } else if (row.event == 'unlink') {
        return '取消关联'
      } else {
        let eventObj = this.getStructure().events.find(e => e.name == row.event)
        if (eventObj) {
          return eventObj.label
        } else {
          return row.event
        }

      }


    },

    dayjs(v) {
      return dayjs(v)
    },
    getStructure() {
      return this.$store.getters["d2admin/structure/resourceStructure"](this.application, this.resource)
    },
    handleCurrentChange(val) {
      this.dialogTableVisible = true
      this.currentRow = val;
    }
  }

}

</script>