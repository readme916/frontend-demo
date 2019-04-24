<template>
  <d2-container>
    <el-container>
      <el-aside width="50%">
        <leftDetail :detail="data.leftDetail" @resourceClick="subResourceToggle" />
      </el-aside>

      <el-main>
        <leftDetail :detail="data.rightDetail" />

      </el-main>
    </el-container>
  </d2-container>
</template>

<script>
import { resourceDetail } from "@api/resource.detail";
export default {
  name: "detail",

  components: {
    leftDetail: () => import("./components/leftDetail"),
    rightDetail: () => import("./components/rightDetail"),
  },

  data() {
    return {
      datas: [],
      data: {
        leftDetail: {},
        rightDetail: {}
      }
    };
  },

  methods: {

    subResourceToggle: function(resourceName){

      this.rightDetail.application = this.leftDetail.application
      this.rightDetail.resource = this.leftDetail.resource
      this.rightDetail.id = this.leftDetail.id
      this.rightDetail.subResource = resourceName
      
      this.data.rightDetail = resourceName
    },

    switchData(to) {
      var initDataStructure = to => {
        let data = {
          leftDetail: {
            application: to.params.application,
            resource: to.params.resource,
            id: to.params.id,
            structure: this.$store.getters["d2admin/structure/resourceStructure"](to.params.application, to.params.resource),
            data: null,
            edit:false
          },
          rightDetail: {
            relationship: "",
            application: "",
            resource: "",
            id:"",
            subResource:"",
            structure: {},
            data: null,
            edit:false,
            mode:{}
          }
        };
        return data;
      };
      let application = to.params.application;
      let resource = to.params.resource;
      let id = to.params.id;
      if (!this.datas[application]) {
        this.datas[application] = {};
      }
      if (!this.datas[application][resource]) {
        this.datas[application][resource] = {};
      }
      if (!this.datas[application][resource][id]) {
        this.datas[application][resource][id] = initDataStructure(to);
      }
      if (!this.datas[application][resource][id]['leftDetail']["data"]) {
        resourceDetail(application, resource, id).then(res => {
          this.$notify({
            title: "数据请求完毕"
          });
          this.datas[application][resource][id]["leftDetail"]["data"] = res;
        });
      }
      this.data = this.datas[application][resource][id];
    }
  },

  // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter(to, from, next) {
    const application = to.params.application;
    const resource = to.params.resource;
    const id = to.params.id;
    if (application && resource && id) {
      next(instance => {
        instance.switchData(to);
      });
    } else {
      next(new Error("未指定application"));
    }
  },
  // 在同一组件对应的多个路由间切换时触发
  beforeRouteUpdate(to, from, next) {
    const application = to.params.application;
    const resource = to.params.resource;
    const id = to.params.id;
    if (application && resource && id) {
      this.switchData(to);
      next();
    } else {
      next(new Error("未指定application"));
    }
  }
};
</script>

<style  scoped>
</style>
