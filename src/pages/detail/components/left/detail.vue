<template>
  <el-container v-if="detail">
    <el-header>
      <el-button-group>
        <template v-for="(event) in detail.events">
          <el-button size="small" type="primary" round :key="event.label">{{event.label}}</el-button>
        </template>
      </el-button-group>
    </el-header>
    <el-main>
      <el-form>
        <template v-for = "(item) in structure.detailColumns">
          <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
            <itemFormatter :application="application" :resource="resource" :field="item.prop" :data="detail" />
          </el-form-item>
        </template>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import itemFormatter from '@/pages/common/itemFormatter'
export default {

  components:{
    itemFormatter
  },
  props: {
    detail: {},
    application: "",
    resource: "",
    id: "",
    structure: {}
  }
};
</script>