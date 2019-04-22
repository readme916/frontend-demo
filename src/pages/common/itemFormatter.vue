<template>
  <span>
    <el-tag v-if="columnFormat(field)=='BOOLEAN'"
      :type="getValue(data,field)?'success':'danger'"
    >{{getLabel(data,field)}}
    </el-tag>
    <span v-else>{{getLabel(data,field)}}</span>
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
    data: {}
  }
};
</script>
