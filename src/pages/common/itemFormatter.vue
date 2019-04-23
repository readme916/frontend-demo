<template>
  <span>
    <el-tag v-if="format=='BOOLEAN'"
      :type="value?'success':'danger'"
    >{{label}}
    </el-tag>
    <span v-else>{{label}}</span>
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

};
</script>
