<template>
  <el-container>
    <el-header>
      <div v-if="detail.data && !detail.edit">
        <template v-for="(event) in detail.data.events">
          <el-button size="small" type="primary" round :key="event.label" @click="eventClick(event)">{{event.label}}</el-button>
        </template>
      </div>
    </el-header>
    <el-main>
      <el-form v-if="detail.data && detail.structure " ref="leftDetailForm" :model="detail.data">

        <template v-for="(item) in detail.structure.detailColumns">
          <div v-if="!detail.edit || !isEditable(item.prop) " :key="item.prop">
            <el-form-item :label="item.label" :prop="item.prop">
              <itemFormatter :application="detail.application" :resource="detail.resource" :field="item.prop" :item="detail.data" />
              <el-button size="small" type="primary" @click="resourceClick(item.name)" v-if="detail.structure.fieldDetailMap[item.name] && detail.structure.fieldDetailMap[item.name].dataType=='OBJECT'">查看</el-button>
            </el-form-item>
          </div>
          <div v-else :key="item.prop">
            <el-form-item :label="item.label" :prop="item.prop" :rules="detail.structure.fieldDetailMap[item.name].constrants">
              <formFormatter :application="detail.application" :resource="detail.resource" :field="item.prop" :item="detail.data" :structure="detail.structure" />
            </el-form-item>
          </div>

        </template>
        <div v-if="detail.data && detail.edit">
          <el-button size="small" type="primary" @click="editSubmit">提交</el-button>
          <el-button size="small" type="danger" @click="editCancel">取消</el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import itemFormatter from '@/pages/common/itemFormatter'
import formFormatter from '@/pages/common/formFormatter'
import { resourcePost } from '@/api/resource.post'
import { resourceDetail } from "@api/resource.detail";
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



  methods: {

    eventClick: function (event) {
      if (event.name == "update") {
        this.toggleEdit()
      }
    },
    resourceClick: function (resourceName) {
      this.$emit('resourceClick',resourceName)
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
      this.localDetail.edit = !this.localDetail.edit
    },

    isEditable: function (name) {
      var fields = this.localDetail.data.events.find(e => e.name == "update").fields
      if (fields.indexOf(name) != -1) {
        return true;
      } else {
        return false
      }
    }
  }
};
</script>