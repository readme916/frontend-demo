<template>
  <el-input v-if="format=='STRING' && !richEditor" v-model="localItem" placeholder="请输入内容">
  </el-input>

  <d2-quill v-else-if="format=='STRING' && richEditor" style="min-height: 200px; margin-bottom: 20px;" v-model="localItem" @text-change="textChangeHandler" @selection-change="selectionChangeHandler" @editor-change="editorChangeHandler" />

  <el-input v-else-if="format=='DOUBLE' || format=='INTEGER'" v-model.number="localItem" placeholder="请输入内容">
  </el-input>
  <el-switch v-else-if="format=='BOOLEAN'" v-model="booleanItem" active-color="#13ce66" inactive-color="#ff4949">
  </el-switch>
  <el-date-picker v-else-if="format=='DATE'" v-model="localItem" type="datetime" placeholder="选择日期时间" value-format='yyyy-MM-ddTHH:mm:ss'>
  </el-date-picker>

  <el-select v-else-if="format == 'ENUM'" clearable v-model="localItem" placeholder="请选择">
    <el-option v-for="item in resourceStructure.fieldDetailMap[field].values" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>

  <!-- <span v-else>{{getLabel(item,field)}}</span> -->
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


  methods: {
    textChangeHandler(delta, oldDelta, source) {
      // console.group('QuillEditor textChangeHandler')
      // console.log(delta, oldDelta, source)
      // console.groupEnd()
    },
    selectionChangeHandler(range, oldRange, source) {
      // console.group('QuillEditor selectionChangeHandler')
      // console.log(range, oldRange, source)
      // console.groupEnd()
    },
    editorChangeHandler(eventName, ...args) {
      // console.group('QuillEditor editorChangeHandler')
      // console.log(eventName, args)
      // console.groupEnd()
    }
  },

  computed: {
    localItem: {
      get: function () {
        return this.item[this.field]
      },
      set: function (val) {
        this.$set(this.item, this.field, val)
        this.item[this.field] = val
      }
    },
    booleanItem: {
      get: function () {
        if (this.item[this.field] == undefined) {
          this.$set(this.item, this.field, false)
          this.item[this.field] = false
        }
        return this.item[this.field]
      },
      set: function (val) {
        this.$set(this.item, this.field, val)
        this.item[this.field] = val
      }
    }
  }
};
</script>