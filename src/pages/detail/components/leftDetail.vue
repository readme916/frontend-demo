<template>
  <el-container>
    <el-header>
      <div v-if="detail.data">
        <div v-if="!detail.edit">
          <template v-for="(event) in detail.data.events">
            <el-button size="small" type="primary" round :key="event.label" @click="eventClick(event)">{{event.label}}</el-button>
          </template>
        </div>
        <div v-else>
          <el-alert title="编辑模式" type="info">
          </el-alert>
        </div>
      </div>
    </el-header>
    <el-main>

      <el-row>
        <el-col :span="19">
          <el-form v-if="detail.data && detail.structure " ref="leftDetailForm" :model="detail.data" label-position="right" label-width="100px">

            <template v-for="(item) in detail.structure.detailColumns">
              <div v-if="!isObject(item.prop)" :key="item.prop">
                <div v-if="(!detail.edit || !isEditable(item.prop))">
                  <el-form-item :label="item.label" :prop="item.prop">
                    <itemFormatter :application="detail.application" :resource="detail.resource" :field="item.prop" :item="detail.data" />
                  </el-form-item>
                </div>
                <div v-else :key="item.prop">
                  <el-form-item :label="item.label" :prop="item.prop" :rules="detail.structure.fieldDetailMap[item.name].constrants">
                    <formFormatter :application="detail.application" :resource="detail.resource" :field="item.prop" :item="detail.data" :structure="detail.structure" />
                  </el-form-item>
                </div>
              </div>
            </template>
            <div v-if="detail.data && detail.edit" style="text-align:center">
              <el-button size="small" type="success" @click="editSubmit">提交</el-button>
              <el-button size="small" type="danger" @click="editCancel">取消</el-button>
            </div>
          </el-form>
        </el-col>
        <el-col :span="5">

          <el-menu v-if="detail.data" class="el-menu-vertical-demo" @select="handleSelect" :default-active="this.detail.activeIndex">

            <template v-for="(item) in detail.structure.detailColumns">
              <el-menu-item v-if="isReadableObject(item.prop)" :key="item.prop" :index="item.prop">
                <i class="el-icon-location"></i>
                <span slot="title">{{item.label}}</span>
              </el-menu-item>
            </template>

          </el-menu>
        </el-col>
      </el-row>

    </el-main>
    <el-dialog :title="clickEvent?clickEvent.label:''" :visible.sync="dialogFormVisible" :close-on-click-modal=false>
      <el-form ref="eventForm" :model="eventFormData" v-if="dialogFormVisible" label-position="right" label-width="100px">
        <template v-for="(item) in detail.structure.formColumns">
          <div :key="item.prop" v-if="isEventEditable(item.prop)">
            <el-form-item :label="item.label" :prop="item.prop" :rules="detail.structure.fieldDetailMap[item.prop].constrants">
              <formFormatter :application="detail.application" :resource="detail.resource" :field="item.prop" :item="eventFormData" :structure="detail.structure" />
            </el-form-item>
          </div>
        </template>
        <div style="text-align:center">
          <el-button size="small" type="success" @click="formSubmit">提交</el-button>
          <el-button size="small" type="danger" @click="formCancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-container>
</template>
<script>
import itemFormatter from '@/pages/common/itemFormatter'
import formFormatter from '@/pages/common/formFormatter'
import { resourceUpdate, resourceDelete } from '@/api/resource.post'
import { resourceDetail } from "@api/resource.get";
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
    localDetail: function () {
      return this.detail
    }
  },

  data: function () {
    return {
      clickEvent: null,
      eventFormData: {},
      dialogFormVisible: false
    }
  },


  methods: {

    formCancel: function () {
      this.dialogFormVisible = false
      this.eventFormData = {}
    },

    formSubmit: function () {
      this.$refs['eventForm'].validate((valid) => {
        if (valid) {
          this.eventFormData.event = this.clickEvent.name
          resourceUpdate(this.detail.application, this.detail.resource, this.detail.id, this.eventFormData).then((result) => {
            resourceDetail(this.detail.application, this.detail.resource, this.detail.id).then(res => {
              this.detail.data = res
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.eventFormData = {}
            })
          })

        } else {
          return false;
        }
      });

    },

    handleSelect(key, keyPath) {
      this.$emit('resourceClick', key)
      this.detail.activeIndex = key
    },
    eventClick: function (event) {
      if (event.name == "update") {
        this.toggleEdit(true)
      } else if (event.name == 'delete') {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resourceDelete(this.detail.application, this.detail.resource, this.detail.id).then(() => {

            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            this.$store.dispatch("d2admin/page/close", { tagName: this.$route.fullPath })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.clickEvent = event
        this.eventFormData = {}
        this.dialogFormVisible = true
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
          resourceUpdate(this.detail.application, this.detail.resource, this.detail.id, data).then(() => {
            resourceDetail(this.detail.application, this.detail.resource, this.detail.id).then(res => {
              this.detail.data = res
              this.$notify({
                title: "数据成功修改"
              });
            })

          })
          this.toggleEdit(false)
        } else {
          return false;
        }
      });


    },
    editCancel: function () {
      resourceDetail(this.detail.application, this.detail.resource, this.detail.id).then(res => {
        this.detail.data = res
        this.toggleEdit(false)
      })
    },

    toggleEdit: function (val) {
      this.localDetail.edit = val
    },

    isEditable: function (name) {
      var fields = this.localDetail.data.events.find(e => e.name == "update").fields
      if (fields.indexOf(name) != -1) {
        return true;
      } else {
        return false
      }
    },
    isEventEditable: function (name) {
      var fields = this.clickEvent.fields
      if (fields.indexOf(name) != -1) {
        return true;
      } else {
        return false
      }
    },

    isObject: function (name) {
      return this.detail.structure.fieldDetailMap[name] && this.detail.structure.fieldDetailMap[name].dataType == 'OBJECT'
    },
    isReadableObject: function (name) {
      if (this.detail.structure.fieldDetailMap[name]) {
        if (this.detail.structure.fieldDetailMap[name].dataType == 'OBJECT') {
          return this.detail.data.resources[name].read
        } else {
          return false
        }
      } else {
        return false;
      }
    }
  }
};
</script>