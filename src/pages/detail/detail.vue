<template>
  <d2-container>
    <el-container>
      <el-aside width="60%">
        <leftDetail v-bind="data.leftDetail" />
      </el-aside>

      <el-main>
  <leftDetail v-bind="data.rightDetail" />

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
    switchData(to) {
      var initDataStructure = to => {
        let data = {
          leftDetail: {
            application: to.params.application,
            resource: to.params.resource,
            id: to.params.id,
            structure: this.$store.getters["d2admin/structure/resourceStructure"](to.params.application, to.params.resource),
            detail: null,
            edit:null
          },
          rightDetail: {
            relationship: "",
            application: "",
            resource: "",
            id:"",
            subResource:"",
            structure: {},
            detail: null,
            edit:null
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
      if (!this.datas[application][resource][id]['leftDetail']["detail"]) {
        resourceDetail(application, resource, id).then(res => {
          this.$notify({
            title: "数据请求完毕"
          });
          this.datas[application][resource][id]["leftDetail"]["detail"] = res;
          this.datas[application][resource][id]["leftDetail"]["edit"] = JSON.parse(JSON.stringify(res));
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
