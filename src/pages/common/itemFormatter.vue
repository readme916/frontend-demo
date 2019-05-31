<template>
  <el-tag v-if="format=='BOOLEAN' && !booleanCancel" :type="value?'success':'danger'">{{label}}
  </el-tag>
  <div v-else-if="format=='STRING' && richEditor" v-html="label"></div>
  <span v-else>{{label}}</span>
</template>
<script>
import mixins from "./mixins";

import setting from "@/setting"
export default {
  mixins: [mixins],
  props: {
    application: "",
    resource: "",
    field: "",
    item: {},
    booleanCancel:false
   
  },
  
};
</script>
