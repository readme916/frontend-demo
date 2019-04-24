<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button-group v-if="events">
        <el-button v-for="(event) in events" size="small" type="primary" round :key="event.label">{{event.label}}</el-button>
        </el-button-group>
      </el-form-item>
      
    </el-form>

    <el-table
      :data="table"
      v-loading="loading"
      size="mini"
      stripe
      style="width: 100%;"
      @selection-change="handleSelectionChange"
      @sort-change='sortChange'
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-for="(col) in structure.listColumns">
        <el-table-column
          :show-overflow-tooltip="true"
          :prop="col.prop"
          :label="col.label"
          :key="col.prop"
          :width="col.width > 0 ? col.width:null"
          :sortable="col.sortable?'custom':false">
          <template slot-scope="scope">
            <itemFormatter :application="application" :resource="resource" :field="scope.column.property" :item="scope.row"/>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="gotoDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import BooleanControl from "../BooleanControl";
import BooleanControlMini from "../BooleanControlMini";
import itemFormatter from '@/pages/common/itemFormatter'
export default {
  components: {
    BooleanControl,
    BooleanControlMini,
    itemFormatter,
  },
  props: {
    table: {
      default: () => []
    },
    loading: {
      default: false
    },
    structure: {
      default: () => {}
    },
    application: "",
    resource: "",
    params:{
      default: () => {}
    },
    events:null
  },

  data() {
    return {
      currentTableData: [],
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

      sortChange: function(column, prop, order){
      if(column.order == 'descending'){
        this.params.sort = column.prop+",desc"
      }else  if(column.order == 'ascending'){
        this.params.sort = column.prop+",asc"
      }else {
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
