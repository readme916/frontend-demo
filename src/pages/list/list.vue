<template>
  <d2-container :filename="filename">
    <page-header slot="header" @submit="handleSubmit" ref="header" :structure="data.structure" :params="data.params" />
    <page-main :table-data="data.table" :loading="data.loading" :application="data.application" :resource="data.resource" :structure="data.structure" :params="data.params" :events="data.events" @submit="handleSubmit" />
    <page-footer v-show="pager" slot="footer" :current="data.params.page+1" :size="data.params.size" :total="data.total" @change="handlePaginationChange" />
  </d2-container>
</template>

<script>
import { resourceList } from "@api/resource.list";
import { mapState, mapGetters } from "vuex";
import { resolve } from "url";
export default {
  // name 值和本页的 $route.name 一致才可以缓存页面
  name: "list",
  components: {
    PageHeader: () => import("./components/PageHeader"),
    PageMain: () => import("./components/PageMain"),
    PageFooter: () => import("./components/PageFooter"),

  },

  data() {
    return {
      filename: __filename,
      datas: [],
      data: {
        structure: {},
        params: { page: 0, size: 20, sort: '' }
      }
    };
  },

  computed: {
    pager: function () {
      if (this.data.params.page != undefined) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    switchData(to) {
      var initDataStructure = (to) => {
        let data = {
          table: [],
          loading: false,
          application: to.params.application,
          resource: to.params.resource,
          total: 0,
          params: {},
          structure: this.$store.getters["d2admin/structure/resourceStructure"](to.params.application, to.params.resource),
          events: [],
          fetched: false
        };

        if (data.structure && data.structure.listFilters) {
          data.structure.listFilters.forEach(i => {
            if (i.formItem == "CHECKBOX") {
              data.params[i.prop + "[" + i.relationship.toLowerCase() + "]"] = [];
            } else {
              data.params[i.prop + "[" + i.relationship.toLowerCase() + "]"] = "";
            }
          });
        }

        Object.keys(to.query).forEach(key => {
          if (decodeURI(to.query[key]) != "*") {
            data.params[key] = to.query[key];
          } else {
            if (key == "page") {
              data.params[key] = 0;
            } else if (key == "size") {
              data.params[key] = 20;
            } else if (key == 'sort') {
              data.params[key] = ''
            }

          }
        });
        return data;
      };
      let application = to.params.application
      let resource = to.params.resource
      if (!this.datas[application]) {
        this.datas[application] = {};
      }
      if (!this.datas[application][resource]) {
        this.datas[application][resource] = {};
      }
      if (!this.datas[application][resource][to.fullPath]) {
        this.datas[application][resource][to.fullPath] = initDataStructure(to);
      }
      this.data = this.datas[application][resource][to.fullPath];
    },

    handlePaginationChange(val) {
      this.data.params.page = val.current - 1;
      this.data.params.size = val.size;
      // nextTick 只是为了优化示例中 notify 的显示
      this.$nextTick(() => {
        this.$refs.header.handleFormSubmit();
      });
    },
    handleSubmit() {
      this.data.loading = true;
      var newObj = JSON.parse(JSON.stringify(this.data.params));
      for (var i in newObj) {
        if (newObj[i] instanceof Array) {
          var name = i;
          if (i.indexOf("[") != -1) {
            name = i.substring(0, i.indexOf("["));
          }
          var enums = this.data.structure.fieldDetailMap[name].values;

          var arr = [];
          for (var e in enums) {
            if (newObj[i].indexOf(enums[e].label) != -1) {
              arr.push(enums[e].value);
            }
          }
          newObj[i] = arr.join(",");
        }
      }
      resourceList(
        {
          ...newObj
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
          this.data.events = res.events;
          this.data.total = res.total;
          this.data.fetched = true
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
    const application = to.params.application;
    const resource = to.params.resource;
    if (application && resource) {
      next(instance => {
        instance.switchData(to)
        if (instance.data.fetched == false) {
          instance.handleSubmit()
        }
      });
    } else {
      next(new Error("未指定application"));
    }
  },
  // 在同一组件对应的多个路由间切换时触发
  beforeRouteUpdate(to, from, next) {
    const application = to.params.application;
    const resource = to.params.resource;
    if (application && resource) {
      this.switchData(to);
      if (this.data.fetched == false) {
        this.handleSubmit()
      }
      next();
    } else {
      next(new Error("未指定application"));
    }
  }
};
</script>
