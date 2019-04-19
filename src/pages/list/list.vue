<template>
  <d2-container :filename="filename">
    <page-header slot="header" @submit="handleSubmit" ref="header" :structure="data.structure" :params="data.params"/>
    <page-main
      :table-data="data.table"
      :loading="data.loading"
      :application="data.application"
      :resource="data.resource"
      :structure="data.structure"
    />
    <page-footer
      v-show="pager"
      slot="footer"
      :current="data.params.page+1"
      :size="data.params.size"
      :total="data.total"
      @change="handlePaginationChange"
    />
  </d2-container>
</template>

<script>
import { resourceList } from "@api/resource.list";
import { mapState, mapGetters } from "vuex";
import { resolve } from 'url';
export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: "list",
  components: {
    PageHeader: () => import("./componnets/PageHeader"),
    PageMain: () => import("./componnets/PageMain"),
    PageFooter: () => import("./componnets/PageFooter")
  },

  data() {
    return {
      filename: __filename,
      datas: {},
      data: {
        structure:{},
        params: {page:0,size:20}
      }
    };
  },

  computed: {
    pager: function() {
      if (this.data.params.page != undefined) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    switchData(application, resource, to) {
      var initDataStructure = (application, resource, to) => {
        let data = {
          table: [],
          loading: false,
          application: application,
          resource: resource,
          total: 0,
          params: {},
          structure:{}
        };
        data.structure = this.$store.getters[
          "d2admin/structure/resourceStructure"
        ](to.params.application, to.params.resource);
        data.structure.listFilters.forEach(i => {
          data.params[i.prop + "[" + i.relationship.toLowerCase() + "]"] = "";
        });
        Object.keys(to.query).forEach(key => {
          if (decodeURI(to.query[key]) != "*") {
            data.params[key] = to.query[key];
          } else {
            if (key == "page") {
              data.params[key] = 0;
            } else if(key == "size") {
              data.params[key] = 20;
            }else
              data.params[key] = "";
            }
        });
        return data;
      };

      let appStructure = this.datas[application];
      let data;
      if (!appStructure) {
        this.datas[application]={}
        this.datas[application][resource] = {}
        this.datas[application][resource][to.fullPath] = data =  initDataStructure(application, resource, to);
      } else {
         appStructure = this.datas[application][resource];
         if(!appStructure){
            this.datas[application][resource] = {}
            this.datas[application][resource][to.fullPath] = data =  initDataStructure(application, resource, to);
         }else{
           appStructure = this.datas[application][resource][to.fullPath];
           if(!appStructure){
            this.datas[application][resource][to.fullPath] = data = initDataStructure(application, resource, to);
           }else{
            data = this.datas[application][resource][to.fullPath]
           }
         }
      }
      this.data = data;
    },

    handlePaginationChange(val) {
      this.data.params.page = val.current-1
      this.data.params.size = val.size
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
    handleSubmit(form) {
      this.data.loading = true;
      resourceList(
        {
          ...this.data.params
        },
        this.data.application,
        this.data.resource
      )
        .then(res => {
          this.data.loading = false;
          this.$notify({
            title: "表格数据请求完毕"
          });
          this.data.table = res.items;
          this.data.total = res.total;
        })
        .catch(err => {
          this.data.loading = false;
          this.$notify({
            title: "表格数据请求异常"
          });
          console.log("err", err);
        });
    }
  },

  // 第一次进入或从其他组件对应路由进入时触发
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter => ", to);
    const application = to.params.application;
    const resource = to.params.resource;
    if (application && resource) {
      next(instance => instance.switchData(application, resource, to));
    } else {
      next(new Error("未指定application"));
    }
  },
  // 在同一组件对应的多个路由间切换时触发
  beforeRouteUpdate(to, from, next) {
    console.log("beforeRouteUpdate => ", to);
    const application = to.params.application;
    const resource = to.params.resource;
    if (application && resource) {
      this.switchData(application, resource, to);
      next();
    } else {
      next(new Error("未指定application"));
    }
  }
};
</script>
