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
            <span v-if="!item.edit">
            <itemFormatter :application="application" :resource="resource" :field="item.prop" :item="detail" />
            <span v-if="isEditable(item.name)" @click="toggleEdit(item.prop)"><d2-icon name="edit"/></span>
            </span>
            <span v-else>
               <formFormatter :application="application" :resource="resource" :field="item.prop" :item="detail" @confirm="submit" @cancel="toggleEdit" />
              
            </span>

          </el-form-item>
        </template>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import itemFormatter from '@/pages/common/itemFormatter'
import formFormatter from '@/pages/common/formFormatter'
export default {

  components: {
    itemFormatter,
    formFormatter
  },
  props: {
    detail:null,
    application:'',
    resource:'',
    id:'',
    structure:{},
  },

  methods:{

   
    submit:function(value){
      console.log(value)
    },

    toggleEdit:function(prop){
      var item = this.structure.detailColumns.find(e => e.prop == prop)
      this.$set(item,"edit",!item.edit)
    },

    isEditable: function(name){
      var fields = this.detail.events.find(e=>e.name=="update").fields
      if(fields.indexOf(name)!=-1){
        return true;
      }
    }
  }
};
</script>