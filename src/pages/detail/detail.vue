<template>
    <d2-container>
      <el-container>
      <el-aside width="60%">
          <leftDetail
           :structure="data.structure"
            :detail="data.detail"
            :application="data.application"
            :resource="data.resource"
            :id = "data.id"
            />
      </el-aside>
    
      <el-main>这里是关联对象</el-main>
      </el-container>
    </d2-container>
</template>

<script>
import { resourceDetail } from "@api/resource.detail";
export default {
  name: "detail",

  components: {
    leftDetail: () => import("./components/left/detail"),
    rightDetail: () => import("./components/right/detail"),
    rightDetailList: () => import("./components/right/detailList")
  },

   data() {
    return {
      datas: [],
      data: {
      }
    };
  },


methods: {

    switchData(to) {
      var initDataStructure = (to) => {
        let data = {
          detail:null,
          application: to.params.application,
          resource: to.params.resource,
          id: to.params.id,
          structure: {}
        };
        data.structure = this.$store.getters[
          "d2admin/structure/resourceStructure"
        ](to.params.application, to.params.resource);
        return data;
      };
      let application = to.params.application
      let resource = to.params.resource
      let id = to.params.id
      let appStructure = this.datas[application];
      let data;
      if (!appStructure) {
        this.datas[application] = {};
      }
      if (!this.datas[application][resource]) {
          this.datas[application][resource] = {};
      }
      if (!this.datas[application][resource][id]) {
          this.datas[application][resource][id] = initDataStructure(to);
      } 
      if(!this.datas[application][resource][id]['detail']) {
            resourceDetail(application,resource,id).then(res => {
          this.$notify({
            title: "数据请求完毕"
          });
          this.datas[application][resource][id]['detail'] = res
        })
      }
      this.data =  this.datas[application][resource][id];
    },
},

 // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter(to, from, next) {
    const application = to.params.application;
    const resource = to.params.resource;
    const id = to.params.id
    if (application && resource && id) {
      next(instance => {
        instance.switchData(to)
        });
    } else {
      next(new Error("未指定application"));
    }
  },
  // 在同一组件对应的多个路由间切换时触发
  beforeRouteUpdate(to, from, next) {
    const application = to.params.application;
    const resource = to.params.resource;
    const id = to.params.id
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
