<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item v-if="data.events">
        <el-button v-for="(event) in data.events" size="small" type="primary" round :key="event.label" @click='handleEventClick(event)'>{{event.label}}</el-button>
      </el-form-item>

    </el-form>

    <el-table :row-key="getRowKey" reserve-selection="true" :data="data.table" v-loading="data.loading" size="mini" stripe style="width: 100%;" @selection-change="handleSelectionChange" @sort-change='sortChange' ref='list'>
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-for="(col) in data.structure.listColumns">
        <el-table-column :show-overflow-tooltip="true" :prop="col.prop" :label="col.label" :key="col.prop" :width="col.width > 0 ? col.width:null" :sortable="col.sortable?'custom':false">
          <template slot-scope="scope">
            <itemFormatter :application="data.application" :resource="data.resource" :field="scope.column.property" :item="scope.row" />
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="80" align="center" v-if="data.goDetail">
        <template slot-scope="scope">
          <el-button size="mini" @click="gotoDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="data.clickEvent?data.clickEvent.label:''" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
      <el-form ref="eventForm" :model="eventFormData" v-if="dialogFormVisible">
        <template v-for="(item) in data.structure.formColumns">
          <div :key="item.prop" v-if="isEditable(item.prop)">
            <el-form-item :label="item.label" :prop="item.prop" :rules="data.structure.fieldDetailMap[item.prop].constrants">
              <formFormatter :application="data.application" :resource="data.resource" :field="item.prop" :item="eventFormData" :structure="data.structure" />
            </el-form-item>
          </div>
        </template>
        <div>
          <el-button size="small" type="success" @click="formSubmit">提交</el-button>
          <el-button size="small" type="danger" @click="formCancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import BooleanControl from "../BooleanControl";
import BooleanControlMini from "../BooleanControlMini";
import itemFormatter from '@/pages/common/itemFormatter'
import formFormatter from '@/pages/common/formFormatter'
import { resourceCreate, resourceUpdate ,resourceDelete} from '@/api/resource.post'
import { constants } from 'fs';
import { Promise } from 'q';
export default {
  components: {
    BooleanControl,
    BooleanControlMini,
    itemFormatter,
    formFormatter
  },
  props: {
    // table: {
    //   default: () => []
    // },
    // loading: {
    //   default: false
    // },
    // structure: {
    //   default: () => { }
    // },
    // application: "",
    // resource: "",
    // params: {
    //   default: () => { }
    // },
    // events: null,
    // multipleSelection: {
    //   default: () => []
    // },
    data: {
      default: () => { }
    }
  },

  data() {
    return {
      eventFormData: {},
      clickEvent: null,
      dialogFormVisible: false,
      downloadColumns: [
        { label: "卡密", prop: "key" },
        { label: "面值", prop: "value" },
        { label: "状态", prop: "type" },
        { label: "管理员", prop: "admin" },
        { label: "管理员备注", prop: "adminNote" },
        { label: "创建时间", prop: "dateTimeCreat" },
        { label: "使用状态", prop: "used" },
        { label: "使用时间", prop: "dateTimeUse" }
      ]
    };
  },

  methods: {

    getRowKey: function (row) {
      return row.uuid
    },
    formSubmit: function () {
      this.$refs['eventForm'].validate((valid) => {
        if (valid) {
          if (this.clickEvent.name == "create") {
            resourceCreate(this.data.application, this.data.resource, this.eventFormData).then(res => {
              this.$emit("submit")
              this.dialogFormVisible = false
              this.eventFormData = {}
            })
          } else {
            this.eventFormData.event = this.clickEvent.name
            var updateList = []
            this.data.multipleSelection.forEach(row => {
              updateList.push(resourceUpdate(this.data.application, this.data.resource, row.uuid, this.eventFormData))
            })
            Promise.all(updateList).then((result) => {
              this.$message({
                message: '批量操作成功',
                type: 'success'
              })
              this.$emit("submit")
              this.dialogFormVisible = false
              this.eventFormData = {}
            })

            // await resourceUpdate(this.application, this.resource, data)
          }


        } else {
          return false;
        }
      });

    },
    formCancel: function () {
      this.dialogFormVisible = false
      this.eventFormData = {}
    },
    isEditable: function (name) {
      var fields = this.clickEvent.fields
      if (fields.indexOf(name) != -1) {
        return true;
      } else {
        return false
      }
    },

    handleEventClick: function (event) {

      if (event.name != 'create') {
        if (this.data.multipleSelection.length === 0) {
          this.$message({
            message: '请选择操作的行',
            type: 'warning'
          })
          return false
        }
        if (event.name == 'delete') {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var updateList = []
            this.data.multipleSelection.forEach(row => {
              updateList.push(resourceDelete(this.data.application, this.data.resource, row.uuid))
            })
            Promise.all(updateList).then((result) => {
              this.$message({
                message: '批量删除成功',
                type: 'success'
              })
              this.$emit("submit")
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
          return;
        }
      }

      this.clickEvent = event
      this.eventFormData = {}
      this.dialogFormVisible = true
    },

    sortChange: function (column, prop, order) {
      if (column.order == 'descending') {
        this.params.sort = column.prop + ",desc"
      } else if (column.order == 'ascending') {
        this.params.sort = column.prop + ",asc"
      } else {
        this.params.sort = ''
      }
      this.$emit("submit");
    },

    gotoDetail(row) {
      this.$router.push({
        name: "detail",
        params: {
          application: this.data.application,
          resource: this.data.resource,
          id: row.uuid
        }
      });
    },


    handleSelectionChange(val) {
      this.$emit('multiple', val)
    },
    downloadDataTranslate(data) {
      return data.map(row => ({
        ...row,
        type: row.type ? "禁用" : "正常",
        used: row.used ? "已使用" : "未使用"
      }));
    },
    handleDownloadXlsx(data) {
      this.$export
        .excel({
          title: "D2Admin 表格示例",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data)
        })
        .then(() => {
          this.$message("导出表格成功");
        });
    },
    handleDownloadCsv(data) {
      this.$export
        .csv({
          title: "D2Admin 表格示例",
          columns: this.downloadColumns,
          data: this.downloadDataTranslate(data)
        })
        .then(() => {
          this.$message("导出CSV成功");
        });
    }
  }
};
</script>
