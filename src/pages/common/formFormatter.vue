<template>
  <span>
    <el-input v-if="format=='STRING' || format=='DOUBLE' || format=='INTEGER'" v-model="localItem">
    </el-input>
    <el-switch v-else-if="format=='BOOLEAN'" v-model="localItem" active-color="#13ce66" inactive-color="#ff4949">
    </el-switch>
    <el-date-picker v-else-if="format=='DATE'" v-model="localItem" type="datetime" placeholder="选择日期时间" value-format='yyyy-MM-ddTHH:mm:ss'>
    </el-date-picker>

    <el-select v-else-if="format == 'ENUM'" clearable v-model="localItem" placeholder="请选择">
      <el-option v-for="item in resourceStructure.fieldDetailMap[field].values" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>

    <!-- <span v-else>{{getLabel(item,field)}}</span> -->
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
    item: {},
  },

  computed: {
    localItem: {
      get: function () {
        return this.item[this.field]
      },
      set: function (val) {
        this.$set(this.item,this.field,val)
        this.item[this.field] = val
      }
    }
  }
};
</script>