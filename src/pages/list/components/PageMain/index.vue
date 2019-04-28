<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item v-if="events">
        <el-button v-for="(event) in events" size="small" type="primary" round :key="event.label" @click='handleEventClick(event)'>{{event.label}}</el-button>
      </el-form-item>

    </el-form>

    <el-table :data="table" v-loading="loading" size="mini" stripe style="width: 100%;" @selection-change="handleSelectionChange" @sort-change='sortChange'>
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-for="(col) in structure.listColumns">
        <el-table-column :show-overflow-tooltip="true" :prop="col.prop" :label="col.label" :key="col.prop" :width="col.width > 0 ? col.width:null" :sortable="col.sortable?'custom':false">
          <template slot-scope="scope">
            <itemFormatter :application="application" :resource="resource" :field="scope.column.property" :item="scope.row" />
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="gotoDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="clickEvent?clickEvent.label:''" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
      <el-form ref="eventForm" :model="eventFormData" v-if="dialogFormVisible">
        <template v-for="(item) in structure.formColumns">
          <div :key="item.prop" v-if="isEditable(item.prop)">
            <el-form-item :label="item.label" :prop="item.prop" :rules="structure.fieldDetailMap[item.prop].constrants">
              <formFormatter :application="application" :resource="resource" :field="item.prop" :item="eventFormData" :structure="structure" />
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
import { resourceCreate, resourceUpdate } from '@/api/resource.post'
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
    table: {
      default: () => []
    },
    loading: {
      default: false
    },
    structure: {
      default: () => { }
    },
    application: "",
    resource: "",
    params: {
      default: () => { }
    },
    events: null,

  },

  data() {
    return {
      eventFormData: {
        'username': ''
      },
      clickEvent: null,
      dialogFormVisible: false,
      multipleSelection: [],
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


    formSubmit: function () {
      this.$refs['eventForm'].validate((valid) => {
        if (valid) {
          if (this.clickEvent.name == "create") {
            resourceCreate(this.application, this.resource, this.eventFormData).then(res => {
              this.$emit("submit")
              this.dialogFormVisible = false
              this.eventFormData = {}
            })
          } else {
            this.eventFormData.event = this.clickEvent.name
            var updateList = []
            this.multipleSelection.forEach(row => {
              updateList.push(resourceUpdate(this.application, this.resource, row.uuid, this.eventFormData))
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
        if (this.multipleSelection.length === 0) {
          this.$message({
            message: '请选择操作的行',
            type: 'warning'
          })
          return false
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
          application: this.application,
          resource: this.resource,
          id: row.uuid
        }
      });
    },


    handleSelectionChange(val) {
      this.multipleSelection = val;
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
