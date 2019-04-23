<template>
  <el-container>
    <el-header>
      <el-button-group v-if="detail">
        <template v-for="(event) in detail.events">
          <el-button size="small" type="primary" round :key="event.label">{{event.label}}</el-button>
        </template>
      </el-button-group>
    </el-header>
    <el-main>
      <el-form v-if="detail">
        <template v-for="(item) in structure.detailColumns">
          <el-form-item :label="item.label" :prop="item.prop" :key="item.prop">
            <div v-if="isEditable(item.name)">editable</div>
            <itemFormatter :application="application" :resource="resource" :field="item.prop" :item="detail" />
          </el-form-item>
        </template>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import itemFormatter from '@/pages/common/itemFormatter'
export default {

  components: {
    itemFormatter
  },
  props: {
    detail:null,
    application:'',
    resource:'',
    id:'',
    subResource:"",
    structure:{},
    relationship:""
  },

 data: function () {
  return {
    edit: false
  }
},
  methods:{
    isEditable: function(name){
      var fields = this.detail.events.find(e=>e.name=="update").fields
      if(fields.indexOf(name)!=-1){
        return true;
      }
    }
  }
};
</script>