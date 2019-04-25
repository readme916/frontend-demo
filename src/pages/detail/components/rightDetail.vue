<template>
  <div v-if="detail.data">
    <el-form :inline="true" size="mini">
      <el-form-item>

        <el-button size="small" type="primary" round v-if="canCreate()">创建</el-button>
        <el-button size="small" type="primary" round v-if="canDelete()">删除</el-button>
        <el-button size="small" type="primary" round v-if="canLink()||canUnlink()">关联</el-button>
      </el-form-item>

    </el-form>
    <el-table :data="detail.data.items" size="mini" stripe style="width: 100%;" @selection-change="handleSelectionChange" ref="rightDetailTable">
      <el-table-column type="selection" width="55"></el-table-column>
      <template v-for="(col) in detail.structure.detailListColumns">
        <el-table-column :show-overflow-tooltip="true" :prop="col.prop" :label="col.label" :key="col.prop" :width="col.width > 0 ? col.width:null" :sortable="col.sortable?'custom':false">
          <template slot-scope="scope">
            <itemFormatter :application="detail.application" :resource="detail.structure.name" :field="scope.column.property" :item="scope.row" />
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
import itemFormatter from '@/pages/common/itemFormatter'
import formFormatter from '@/pages/common/formFormatter'
import { resourceList, resourceDetail, subResourceList, subResourceDetail } from "@api/resource.get";

export default {

  components: {
    itemFormatter,
    formFormatter
  },
  props: {
    detail: {
      edit: false
    }
  },

  computed: {
    subResource: function () {
      return this.detail.subResource
    }
  },

  watch: {
    subResource(val) {
      if (this.detail.subResource) {
        if (this.detail.relationship == "MANY_TO_MANY" || this.detail.relationship == "MANY_TO_ONE") {
          if (this.detail.mode.write == true) {
            let p1 = resourceList(this.detail.application, this.detail.structure.name)
            let p2 = subResourceList(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource)

            Promise.all([p1, p2]).then((results) => {
              this.detail.data = results[0]
              results[1].items.forEach(row => {
                let selected = this.detail.data.items.find(e => { return e.uuid == row.uuid })
                this.$nextTick(() => {
                  this.$refs.rightDetailTable.toggleRowSelection(selected);
                })
              })
            })

          }
        } else {
          subResourceList(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource).then(res => {
            this.detail.data = res
          })
        }

      }
    }
  },

  methods: {

    handleSelectionChange(rows) {
      this.detail.multipleSelection = rows;
    },
    canCreate: function () {
      if (this.detail.relationship == 'ONE_TO_MANY' || this.detail.relationship == 'ONE_TO_ONE') {
        return this.detail.mode.write
      } else {
        return false
      }
    },
    canDelete: function () {
      if (this.detail.relationship == 'ONE_TO_MANY' || this.detail.relationship == 'ONE_TO_ONE') {
        return this.detail.mode.delete
      } else {
        return false
      }
    },
    canLink: function () {
      if (this.detail.relationship == 'MANY_TO_MANY' || this.detail.relationship == 'MANY_TO_ONE') {
        return this.detail.mode.write
      } else {
        return false
      }
    },
    canUnlink: function () {
      if (this.detail.relationship == 'MANY_TO_MANY' || this.detail.relationship == 'MANY_TO_ONE') {
        return this.detail.mode.delete
      } else {
        return false
      }
    },
    eventClick: function (event) {
      if (event.name == "update") {
        this.toggleEdit()
      }
    },


    editSubmit: function () {

      this.$refs['leftDetailForm'].validate((valid) => {
        if (valid) {
          var fields = this.detail.data.events.find(e => e.name == "update").fields
          var data = {};
          for (var f in fields) {
            data[fields[f]] = this.detail.data[fields[f]]

          }
          resourcePost(this.detail.application, this.detail.resource, this.detail.id, data).then(() => {
            resourceDetail(this.detail.application, this.detail.resource, this.detail.id).then(res => {
              this.detail.data = res
              this.$notify({
                title: "数据成功修改"
              });
            })

          })
          this.toggleEdit()
        } else {
          console.log('error submit!!');
          return false;
        }
      });


    },
    editCancel: function () {
      resourceDetail(this.detail.application, this.detail.resource, this.detail.id).then(res => {
        this.detail.data = res
        this.toggleEdit()
      })
    },

    toggleEdit: function () {
      this.detail.edit = !this.detail.edit
    },

    isEditable: function (name) {
      var fields = this.detail.data.events.find(e => e.name == "update").fields
      if (fields.indexOf(name) != -1) {
        return true;
      } else {
        return false
      }
    }
  }
};
</script>