<template>

  <el-container>
    <el-header>
      <el-alert title="操作模式" type="info" v-if="detail.listEdit">
      </el-alert>
      <el-alert title="编辑模式" type="info" v-if="detail.detailEdit">
      </el-alert>
    </el-header>
    <el-main>
      <div v-if="!detail.detailDisplay" key="detailList">

        <el-form :inline="true" size="mini">
          <el-form-item v-if="!detail.listEdit">
            <el-button size="small" type="primary" round v-if="canCreate()||canDelete()||canLink()||canUnlink()" @click="linkEdit">更改</el-button>

            <el-button size="small" type="primary" round v-if="detail.listData.goMainUrl" @click="goMainUrlList()">完整列表</el-button>
          </el-form-item>
          <div v-else>

            <el-form-item>
              <el-button size="small" type="danger" round @click="linkEditBack">返回</el-button>
              <el-button size="small" type="primary" round v-if="canCreate()" @click="subResourceCreateClick">创建</el-button>
              <el-button size="small" type="primary" round v-if="canDelete()" @click="subResourceDeleteClick">删除</el-button>

            </el-form-item>

          </div>

        </el-form>
        <el-table :data="detail.listData.items" size="mini" stripe style="width: 100%;" @selection-change="handleSelectionClick" ref="rightDetailTable">
          <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
          <template v-for="(col) in detail.structure.detailListColumns">
            <el-table-column :show-overflow-tooltip="true" :prop="col.prop" :label="col.label" :key="col.prop" :width="col.width > 0 ? col.width:null" :sortable="col.sortable?'custom':false">
              <template slot-scope="scope">
                <itemFormatter :application="detail.application" :resource="detail.structure.name" :field="scope.column.property" :item="scope.row" />
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" width="80" align="center" v-if="detail.listData.goDetail">
            <template slot-scope="scope" v-if="!detail.listEdit">
              <el-button size="mini" @click="gotoDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div v-else key="detailDetail">
        <el-container>
          <el-header>
            <div v-if="detail.detailData">
              <div v-if="!detail.detailEdit">
                <el-button size="small" type="danger" round @click="backToList">返回</el-button>
                <template v-for="(event) in detail.detailData.events">
                  <el-button size="small" type="primary" round :key="event.label" @click="eventClick(event)">{{event.label}}</el-button>
                </template>
                <el-button size="small" type="primary" round v-if="detail.detailData.goMainUrl" @click="goMainUrlDetail()">完整信息</el-button>
              </div>

            </div>
          </el-header>
          <el-main>
            <el-form v-if="detail.detailData && detail.structure " ref="rightDetailForm" :model="detail.detailData">

              <template v-for="(item) in detail.structure.detailColumns">
                <div v-if="!detail.detailEdit || !isEditable(item.prop) " :key="item.prop">
                  <el-form-item :label="item.label" :prop="item.prop">
                      <img v-if="detail.structure.type=='IMAGE' && item.prop=='url'" :src="baseUrl+detail.detailData.url" />
                      <a v-else-if="detail.structure.type=='FILE' && item.prop=='url'" :href="baseUrl+detail.detailData.url" >{{detail.detailData.name}}</a>
                    <itemFormatter v-else :application="detail.application" :resource="detail.structure.name" :field="item.prop" :item="detail.detailData"/>
                    
                  </el-form-item>
                </div>
                <div v-else :key="item.prop">
                  <el-form-item :label="item.label" :prop="item.prop" :rules="detail.structure.fieldDetailMap[item.name].constrants">
                    <formFormatter :application="detail.application" :resource="detail.structure.name" :field="item.prop" :item="detail.detailData" :structure="detail.structure" />
                  </el-form-item>
                </div>

              </template>
              <div v-if="detail.detailData && detail.detailEdit" style="text-align:center">
                <el-button size="small" type="success" @click="editSubmit">提交</el-button>
                <el-button size="small" type="danger" @click="editCancel">取消</el-button>
              </div>
            </el-form>
          </el-main>
        </el-container>
      </div>
      <el-dialog :title="detail.structure.label" :visible.sync="dialogFormVisible" :close-on-click-modal=false>

        <div v-if="detail.structure.type=='IMAGE'">
          <el-upload class="avatar-uploader" :action="uploadUrl" :on-success="handleAvatarSuccess" :on-remove="handleAvatarRemove" ref="fileUpload">
            <div v-if="eventFormData.files">
              <img v-for="(file) in eventFormData.files" :src="baseUrl+file.url" class="avatar" :key="file.url">
            </div>
            <i v-if="detail.relationship=='ONE_TO_MANY' ||!eventFormData.files || eventFormData.files.length==0" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div style="text-align:center">
            <el-button size="small" type="success" @click="fileFormSubmit">提交</el-button>
            <el-button size="small" type="danger" @click="formCancel">取消</el-button>
          </div>
        </div>
        <div v-else-if="detail.structure.type=='FILE'">
          <el-upload class="avatar-uploader" :action="uploadUrl" :on-success="handleAvatarSuccess" :on-remove="handleAvatarRemove" ref="fileUpload" multiple>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <div style="text-align:center">
            <el-button size="small" type="success" @click="fileFormSubmit">提交</el-button>
            <el-button size="small" type="danger" @click="formCancel">取消</el-button>
          </div>
        </div>

        <el-form ref="subResourceEventForm" :model="eventFormData" v-else-if="dialogFormVisible" label-position="right" label-width="100px">
          <template v-for="(item) in detail.structure.formColumns">
            <div :key="item.prop" v-if="isEventEditable(item.prop)">
              <el-form-item :label="item.label" :prop="item.prop" :rules="detail.structure.fieldDetailMap[item.prop].constrants">
                <formFormatter :application="detail.application" :resource="detail.structure.name" :field="item.prop" :item="eventFormData" :structure="detail.structure" />
              </el-form-item>
            </div>
          </template>
          <div style="text-align:center">
            <el-button size="small" type="success" @click="formSubmit">提交</el-button>
            <el-button size="small" type="danger" @click="formCancel">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import itemFormatter from '@/pages/common/itemFormatter'
import formFormatter from '@/pages/common/formFormatter'
import { resourceList, resourceDetail, subResourceList, subResourceDetail } from "@api/resource.get";
import { subResourceCreate, subResourceDelete, subResourceUpdate } from "@api/resource.post"
import { constants } from 'fs';
import setting from '@/setting'
import util from '@/libs/util'
import { Promise } from 'q';

export default {

  components: {
    itemFormatter,
    formFormatter
  },
  props: {
    detail: {
      listEdit: false
    }
  },
  data: function () {
    return {
      baseUrl: setting.baseUrl,
      uploadUrl: setting.fileUrl,

      clickEvent: null,
      dialogFormVisible: false,
      eventFormData: {}
    }
  },

  methods: {

    handleAvatarSuccess(res, file) {
      if (!this.eventFormData.files) {
        this.$set(this.eventFormData, 'files', [])
      }
      var f = {
        url: res.url,
        name: res.name,
        size: res.size,
        format: res.format,
      }
      if (this.detail.structure.type == 'IMAGE') {
        f.height = res.height
        f.width = res.width
      }
      this.eventFormData.files.push(f)
    },


    handleAvatarRemove(file, fileList) {
      this.eventFormData.files = this.eventFormData.files.filter(f => {
        return f.url != file.response.url
      })
    },


    goMainUrlDetail: function () {

      this.$router.push({
        path: '/' + this.detail.application + '/rest' + this.detail.detailData.goMainUrl
      })
    },
    goMainUrlList: function () {

      this.$router.push({
        path: '/' + this.detail.application + '/rest' + this.detail.listData.goMainUrl
      })
    },

    fileFormSubmit: function () {

      if (this.eventFormData.files) {

        this.$refs.fileUpload['uploadFiles'].length = 0
        let request = []
        this.eventFormData.files.forEach(file => {
          request.push(subResourceCreate(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, file))
        })

        Promise.all(request).then(res => {

          this.dialogFormVisible = false
          this.$emit('subResourceUpdate', this.detail.subResource, this.eventFormData)
          this.eventFormData = {}
          this.subResourceToggle()
        })
      }

    },
    formSubmit: function () {
      this.$refs['subResourceEventForm'].validate((valid) => {
        if (valid) {
          if (this.clickEvent.name == 'create') {
            subResourceCreate(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, this.eventFormData).then(res => {
              this.dialogFormVisible = false
              this.$emit('subResourceUpdate', this.detail.subResource, this.eventFormData)
              this.eventFormData = {}
              this.subResourceToggle()
            })
          } else {
            this.eventFormData.event = this.clickEvent.name
            let request = subResourceUpdate(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, this.detail.subResourceId, this.eventFormData).then(res => {
              this.dialogFormVisible = false
              this.$emit('subResourceUpdate', this.detail.subResource, this.eventFormData)
              this.eventFormData = {}
              subResourceDetail(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, this.detail.subResourceId).then(res => {
                this.detail.detailData = res
               
              })
            })
          }

        }
      });
    },
    formCancel: function () {
      this.dialogFormVisible = false
      this.eventFormData = {}
    },
    subResourceCreateClick: function () {
      this.clickEvent = this.detail.listData.events.find(e => e.name == 'create')
      this.eventFormData = {}
      this.dialogFormVisible = true
    },
    subResourceDeleteClick: function () {
      if (this.detail.multipleSelection.length == 0) {
        this.$message({
          message: '请选择删除的行',
          type: 'warning'
        })
        return false
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var updateList = []
        this.detail.multipleSelection.forEach(row => {
          updateList.push(subResourceDelete(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, row.uuid))
        })
        Promise.all(updateList).then((result) => {
          this.$message({
            message: '批量删除成功',
            type: 'success'
          })
          this.subResourceToggle()
          this.$emit('subResourceUpdate', this.detail.subResource, {})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    subResourceToggle() {
      if (this.detail.subResource) {

        this.detail.loading = true
        subResourceList(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource).then(res => {
          this.detail.listData = res
          this.detail.listEdit = false
          this.detail.loading = false
        })
      }
    },

    gotoDetail: function (row) {

      subResourceDetail(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, row.uuid).then(res => {
        this.detail.detailDisplay = true
        this.detail.detailData = res
        this.detail.subResourceId = row.uuid
      })
    },
    selectable: function () {
      return this.detail.listEdit
    },

    linkEdit: function () {

      if (this.detail.relationship == "ONE_TO_ONE" || this.detail.relationship == "ONE_TO_MANY") {

      } else {
        this.detail.loading = true
        let p1 = resourceList(this.detail.application, this.detail.structure.name)
        let p2 = subResourceList(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource)

        Promise.all([p1, p2]).then((results) => {
          this.detail.listData = results[0]
          this.detail.subResourceItems = results[1].items
          let seleted = []
          results[1].items.forEach(row => {
            var find = this.detail.listData.items.find(e => { return e.uuid == row.uuid })
            if (find) {
              seleted.push(find)
            }
          })
          this.$nextTick(() => {
            seleted.forEach(r => {
              this.$refs.rightDetailTable.toggleRowSelection(r, true)
            })
            this.detail.loading = false
          })
        })
      }
      this.detail.listEdit = true
    },

    linkEditBack: function () {
      this.detail.loading = true
      subResourceList(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource).then(res => {
        this.detail.listData = res
        this.detail.listEdit = false
        this.detail.loading = false
      })
    },
    backToList: function () {
      this.detail.detailDisplay = false
    },
    handleSelectionClick: function (rows) {

      if (this.detail.relationship == 'ONE_TO_ONE' || this.detail.relationship == 'ONE_TO_MANY') {
        this.detail.multipleSelection = rows
      } else {
        if (this.detail.loading == true || this.detail.listEdit == false) {
          return
        }
        let add = false;
        rows.forEach(r => {
          let find = this.detail.subResourceItems.find(e => { return e.uuid == r.uuid })
          if (!find) {
            add = true
            subResourceCreate(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, r).then(res => {
              this.$emit('subResourceUpdate', this.detail.subResource, r)
              this.linkEdit()
            })
          }

        })
        if (!add) {
          this.detail.subResourceItems.forEach(ii => {
            let find = rows.find((rr) => {
              return ii.uuid == rr.uuid
            })

            if (!find) {
              subResourceDelete(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, ii.uuid).then(res => {
                this.$emit('subResourceUpdate', this.detail.subResource, {})
                this.linkEdit()
              })
            }
          })
        }
      }
    },
    canRead: function () {
      return this.detail.mode.read
    },

    canCreate: function () {
      if (this.detail.relationship == 'ONE_TO_MANY') {
        return this.detail.mode.write
      } else if (this.detail.relationship == 'ONE_TO_ONE') {
        if (this.detail.mode.write && this.detail.listData.items.length == 0) {
          return true;
        } else {
          return false;
        }
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
        this.toggleEdit(true)
      } else if (event.name == 'delete') {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          subResourceDelete(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, this.detail.subResourceId).then(() => {

            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.subResourceToggle()
            this.detail.detailDisplay = false
          })

        }).catch(() => {
          this.subResourceToggle()
          this.detail.detailDisplay = false
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

      this.$refs['rightDetailForm'].validate((valid) => {
        if (valid) {
          var fields = this.detail.detailData.events.find(e => e.name == "update").fields
          var data = {};
          for (var f in fields) {
            data[fields[f]] = this.detail.detailData[fields[f]]

          }
          subResourceUpdate(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, this.detail.subResourceId, data).then(() => {
            subResourceDetail(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, this.detail.subResourceId).then(res => {
              this.detail.detailData = res
              this.$notify({
                title: "数据成功修改"
              });
            })
            subResourceList(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource).then(res => {
              this.detail.listData = res
            })
          })
          this.toggleEdit(false)
        } else {
          console.log('error submit!!');
          return false;
        }
      });


    },
    editCancel: function () {
      subResourceDetail(this.detail.application, this.detail.resource, this.detail.id, this.detail.subResource, this.detail.subResourceId).then(res => {
        this.detail.detailData = res
        this.toggleEdit(false)
      })
    },

    toggleEdit: function (val) {
      this.detail.detailEdit = val
    },

    isEditable: function (name) {
      var fields = this.detail.detailData.events.find(e => e.name == "update").fields
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
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>