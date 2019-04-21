<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item :label="`已选数据下载 [ ${currentTableData.length} ]`">
        <el-button-group>
          <el-button
            type="primary"
            size="mini"
            :disabled="currentTableData.length === 0"
            @click="handleDownloadXlsx(currentTableData)"
          >xlsx</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="currentTableData.length === 0"
            @click="handleDownloadCsv(currentTableData)"
          >csv</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item :label="`已选数据下载 [ ${multipleSelection.length} ]`">
        <el-button-group>
          <el-button
            type="primary"
            size="mini"
            :disabled="multipleSelection.length === 0"
            @click="handleDownloadXlsx(multipleSelection)"
          >xlsx</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="multipleSelection.length === 0"
            @click="handleDownloadCsv(multipleSelection)"
          >csv</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <el-table
      :data="currentTableData"
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
          :formatter="formatter"
          :sortable="col.sortable?'custom':false"
         
        >
          <template slot-scope="scope">
            <el-tag
              v-if="columnformat(scope.column)=='BOOLEAN'"
              :type="formatter(scope.row,scope.column)?'success':'danger'"
            >{{formatter(scope.row,scope.column)?'是':"否"}}</el-tag>
            <span v-else v-text="formatter(scope.row,scope.column)"></span>
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

export default {
  components: {
    BooleanControl,
    BooleanControlMini
  },
  props: {
    tableData: {
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

  watch: {
    tableData: {
      handler(val) {
        this.currentTableData = val;
      },
      immediate: true
    }
  },
  methods: {

      sortChange: function(column, prop, order){
      console.log(column.prop); //prop标签 => nickname
      console.log(column.order);//descending降序、ascending升序
      if(column.order == 'descending'){
        this.params.sort = column.prop+",desc"
      }else  if(column.order == 'ascending'){
        this.params.sort = column.prop+",asc"
      }else {
        this.params.sort = ''
      }
       this.$emit("submit");
    },

    columnformat: function(column) {
      column = column.property;
      if (column.indexOf(".") != -1) {
        if (
          this.structure.fieldDetailMap[column.split(".")[0]].dataType ==
          "OBJECT"
        ) {
          var targetName = this.structure.fieldDetailMap[column.split(".")[0]]
            .targetEntityName;
          var targetStructure = this.$store.getters[
            "d2admin/structure/resourceStructure"
          ](this.application, targetName);
          if (Object.keys(targetStructure.fieldDetailMap).length != 0) {
            if (targetStructure.fieldDetailMap[column.split(".")[1]]) {
              return targetStructure.fieldDetailMap[column.split(".")[1]]
                .dataType;
            }
          }
        }
      } else {
        return this.structure.fieldDetailMap[column].dataType;
      }
    },

    formatter(row, column) {
      var o = eval("row." + column.property);
      if (this.columnformat(column) == "DATE") {
        return this.$options.filters.date_format(new Date(o));
      } else {
        return o;
      }
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
    handleSwitchChange(val, index) {
      const oldValue = this.currentTableData[index];
      this.$set(this.currentTableData, index, {
        ...oldValue,
        type: val
      });
      // 注意 这里并没有把修改后的数据传递出去 如果需要的话请自行修改
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
