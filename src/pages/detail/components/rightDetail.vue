<template>
  <el-container>
    <page-main v-bind="data" @submit="handleSubmit" />
    <!-- <page-footer v-show="pager" slot="footer" :current="data.params.page+1" :size="data.params.size" :total="data.total" @change="handlePaginationChange" /> -->
  </el-container>
</template>
<script>
import itemFormatter from '@/pages/common/itemFormatter'
import formFormatter from '@/pages/common/formFormatter'
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