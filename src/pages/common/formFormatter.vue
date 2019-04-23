<template>
  <span>
    <el-input v-if="format=='STRING' || format=='DOUBLE' || format=='INTEGER'" v-model="value">
    </el-input>
    <!-- <span v-else>{{getLabel(item,field)}}</span> -->

    <el-button size="mini" type="primary" @click="submit()">确定</el-button>
    <el-button size="mini" type="danger" @click="cancel()">取消</el-button>
  </span>
</template>
<script>
import mixins from "./mixins";
export default {
  mixins: [mixins],
  props: {
    application: "",
    resource: "",
    field: "",
    item: {}
  },

  data: function () {
    return {
      temp: ""
    }
  },

  watch:{
      value(val){
          this.temp = val
      }
  },
  methods: {
    cancel: function () {
      this.temp = this.value
      this.$emit("cancel", this.field)
    },
    submit: function () {
      this.$emit("confirm", this.temp)
    }
  }
};
</script>