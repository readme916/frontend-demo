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
    <el-pagination :current-page="current" :page-size="detail.size" :total="detail.total" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handlePageChange">
    </el-pagination>
    <el-dialog title="详细记录" :visible.sync="dialogTableVisible" v-if="detail.currentRow">
      <el-form label-position='right' label-width="100px">
        <el-form-item label="操作时间：">
          {{ dayjs(detail.currentRow.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
        </el-form-item>
        <el-form-item label="操作用户：">
          {{ detail.currentRow.createdBy }}
        </el-form-item>
        <el-form-item label="终端类型：">
          {{getClient(detail.currentRow)}}
        </el-form-item>
        <el-form-item label="操作地点：">
          {{getPosition(detail.currentRow)}}
        </el-form-item>
        <el-form-item label="IP 地址：">
          {{detail.currentRow.ip}}
        </el-form-item>

        <el-form-item label="请求地址：">
          {{detail.currentRow.requestPath}}
        </el-form-item>
        <el-form-item label="请求格式：">
          <div v-if="detail.currentRow.postBody">
            <vue-json-pretty :data="detail.currentRow.postBody" :deep="0"></vue-json-pretty>
          </div>
        </el-form-item>
        <el-form-item label="发生事件：">
          {{getEvent(detail.currentRow)}}
        </el-form-item>
        <el-form-item label="数据变化：">

          <template v-for="(item,key) in detail.currentRow.difference">
            <el-row v-if="detail.currentRow.linkType == 'DIRECT' && item.type=='SIMPLE' && getResourceLabel(key)" :key="key">
              <el-col :span="5">{{getResourceLabel(key)}}</el-col>
              <el-col :span="9" style="text-align:center">
                <el-tag type="danger">
                  <itemFormatter :application="application" :resource="resource" :field="key" :item="getOldObject(key,item)" />
                </el-tag>
              </el-col>
              <el-col :span="1">
                <d2-icon name="arrow-right" />
              </el-col>
              <el-col :span="9" style="text-align:center">
                <el-tag type="success">
                  <itemFormatter :application="application" :resource="resource" :field="key" :item="getNewObject(key,item)" />
                </el-tag>
              </el-col>
            </el-row>

            <el-row v-if="detail.currentRow.linkType == 'BRIDGE' && item.type=='SIMPLE' && getSubResourceLabel(key)" :key="key">
              <el-col :span="5">{{getResourceLabel(detail.currentRow.subResource)}} - {{getSubResourceLabel(key)}}</el-col>
              <el-col :span="9" style="text-align:center">
                <el-tag type="danger">
                  <itemFormatter :application="application" :resource="getSubResourceName()" :field="key" :item="getOldObject(key,item)" />
                </el-tag>
              </el-col>
              <el-col :span="1">
                <d2-icon name="arrow-right" />
              </el-col>
              <el-col :span="9" style="text-align:center">
                <el-tag type="success">
                  <itemFormatter :application="application" :resource="getSubResourceName()" :field="key" :item="getNewObject(key,item)" />
                </el-tag>
              </el-col>
            </el-row>
            <el-row v-if="detail.currentRow.linkType == 'BRIDGE' && item.type=='OBJECT'" :key="key">
              <el-col :span="3">{{getResourceLabel(detail.currentRow.subResource)}}</el-col>
              <el-col :span="10" style="text-align:center">
                <div v-if="item.oldValue">
                  <template v-for="(item2,key2) in item.oldValue">
                    <el-row :key="detail.currentRow.subResource+key2+'old'" v-if="getSubResourceLabel(key2)">
                      <el-col :span="10">{{getSubResourceLabel(key2)}}</el-col>
                      <el-col :span="10">
                        <el-tag type="danger">
                          <itemFormatter :application="application" :resource="getSubResourceName()" :field="key2" :item="item.oldValue" />
                        </el-tag>
                      </el-col>
                    </el-row>
                  </template>
                </div>
                <div v-else>
                  <el-tag type="success">已创建</el-tag>
                </div>
              </el-col>
              <el-col :span="1">
                <d2-icon name="arrow-right" />
              </el-col>
              <el-col :span="10" style="text-align:center">
                <div v-if="item.newValue">
                  <template v-for="(item2,key2) in item.newValue">
                    <el-row :key="detail.currentRow.subResource+key2+'new'" v-if="getSubResourceLabel(key2)">
                      <el-col :span="10">{{getSubResourceLabel(key2)}}</el-col>
                      <el-col :span="10">
                        <el-tag type="success">
                          <itemFormatter :application="application" :resource="getSubResourceName()" :field="key2" :item="item.newValue" />
                        </el-tag>
                      </el-col>
                    </el-row>
                  </template>
                </div>
                <div v-else>
                  <el-tag type="success">已删除</el-tag>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="detail.currentRow.linkType == 'BRIDGE' && item.type=='ARRAY'" :key="key">
              <el-col :span="3">{{getResourceLabel(detail.currentRow.subResource)}}</el-col>
              <el-col :span="10" style="text-align:center">
                <div v-if="item.oldValue">
                  <template v-for="(item2,key2) in item.oldValue[0]">
                    <el-row :key="detail.currentRow.subResource+key2+'old'" v-if="getSubResourceLabel(key2)">
                      <el-col :span="10">{{getSubResourceLabel(key2)}}</el-col>
                      <el-col :span="10">
                        <el-tag type="danger">
                          <itemFormatter :application="application" :resource="getSubResourceName()" :field="key2" :item="item.oldValue[0]" />
                        </el-tag>
                      </el-col>
                    </el-row>
                  </template>
                </div>
                <div v-else>
                  <el-tag type="success">已创建</el-tag>
                </div>
              </el-col>
              <el-col :span="1">
                <d2-icon name="arrow-right" />
              </el-col>
              <el-col :span="10" style="text-align:center">
                <div v-if="item.newValue">
                  <template v-for="(item2,key2) in item.newValue[0]">
                    <el-row :key="detail.currentRow.subResource+key2+'new'" v-if="getSubResourceLabel(key2)">
                      <el-col :span="10">{{getSubResourceLabel(key2)}}</el-col>
                      <el-col :span="10">
                        <el-tag type="success">
                          <itemFormatter :application="application" :resource="getSubResourceName()" :field="key2" :item="item.newValue[0]" />
                        </el-tag>
                      </el-col>
                    </el-row>
                  </template>
                </div>
                <div v-else>
                  <el-tag type="success">已删除</el-tag>
                </div>
              </el-col>
            </el-row>
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
import { resourceDetail, subResourceList, subResourceDetail, resourceHistory } from "@api/resource.get";
export default {
  name: "historyDetail",

  data: function () {
    return {
      dialogTableVisible: false,
    }
  },
  components: {
    VueJsonPretty,
    itemFormatter
  },
  props: {
    application: "",
    resource: "",
    id: "",
    detail: {
      items: [],
      page: 0,
      size: 10,
      total: 0,
      currentRow: {}


    }
  },
  computed: {
    current: function () {
      return this.detail.page + 1
    }
  },
  methods: {
    refresh: function () {
      resourceHistory(this.id, this.detail.page, this.detail.size).then(res => {
        this.detail['items'] = res.items
        this.detail['total'] = res.total
      })
    },
    handleSizeChange(val) {
      this.detail.size = val
      this.refresh()
    },
    handlePageChange(val) {

      this.detail.page = val - 1
      this.refresh()

    },
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
    getResourceLabel(key) {
      let item = this.getStructure().detailColumns.find(e => e.name == key)
      if (item) {
        return item.label;
      } else {
        return null
      }
    },

    getSubResourceLabel(key) {
      let item = this.getSubResourceStructure().detailColumns.find(e => e.name == key)
      if (item) {
        return item.label;
      } else {
        return null
      }
    },
    getStructure() {
      return this.$store.getters["d2admin/structure/resourceStructure"](this.application, this.resource)
    },

    getSubResourceStructure() {
      var targetName = this.getStructure().fieldDetailMap[this.detail.currentRow.subResource].targetEntityName;
      return this.$store.getters["d2admin/structure/resourceStructure"](this.application, targetName)
    },

    getSubResourceName() {
      return this.getStructure().fieldDetailMap[this.detail.currentRow.subResource].targetEntityName;
    },
    getPosition(row) {

    },

    getSubResourceLabelWithName(name) {
      var targetName = this.getStructure().fieldDetailMap[name].targetEntityName;
      return this.$store.getters["d2admin/structure/resourceStructure"](this.application, targetName).label
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
        if (row.linkType == 'BRIDGE') {
          return '创建' + "（" + this.getSubResourceLabelWithName(row.subResource) + "）"
        } else {
          return '创建'
        }
      } else if (row.event == 'update') {
        if (row.linkType == 'BRIDGE') {
          return '修改' + "（" + this.getSubResourceLabelWithName(row.subResource) + "）"
        } else {
          return '修改'
        }
      } else if (row.event == 'delete') {
        return '删除'
      } else if (row.event == 'link') {
        if (row.linkType == 'BRIDGE') {
          return '关联' + "（" + this.getSubResourceLabelWithName(row.subResource) + "）"
        } else {
          return '关联'
        }
      } else if (row.event == 'unlink') {
        if (row.linkType == 'BRIDGE') {
          return '删除' + "（" + this.getSubResourceLabelWithName(row.subResource) + "）"
        } else {
          return '删除'
        }
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

    handleCurrentChange(val) {
      this.dialogTableVisible = true
      this.detail.currentRow = val;
    }
  }

}

</script>