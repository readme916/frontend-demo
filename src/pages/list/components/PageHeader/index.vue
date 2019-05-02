<template>
  <el-form
    :inline="true"
    :model="params"
    ref="listFilterForm"
    size="mini"
    style="margin-bottom: -18px;"
    v-if="Object.keys(structure.listFilters).length!=0">
    <template v-for="(field) in structure.listFilters">
      <el-form-item
        v-if="field.formItem == 'INPUT'"
        :label="field.label"
        :key="field.prop+'['+field.relationship.toLowerCase()+']'"
      >
        <el-input
          v-model="params[field.prop+'['+field.relationship.toLowerCase()+']']"
          placeholder
          style="width: 120px;"
        />
      </el-form-item>

      <el-form-item
        v-else-if="field.formItem == 'SELECT'"
        :label="field.label"
        :key="field.prop+'['+field.relationship.toLowerCase()+']'"
      >
        <el-select
          clearable
          v-model="params[field.prop+'['+field.relationship.toLowerCase()+']']"
          placeholder="请选择"
        >
          <el-option
            v-for="item in structure.fieldDetailMap[field.name].values"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-else-if="field.formItem == 'CHECKBOX'"
        :label="field.label"
        :key="field.prop+'['+field.relationship.toLowerCase()+']'"
      >
        <el-checkbox-group
          v-model="params[field.prop+'['+field.relationship.toLowerCase()+']']"
          placeholder="请选择"
        >
          <el-checkbox
            v-for="item in structure.fieldDetailMap[field.name].values"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        v-else-if="field.formItem == 'DATE_PICKER'"
        :label="field.label"
        :key="field.prop+'['+field.relationship.toLowerCase()+']'"
      >
        <el-date-picker
          v-model="params[field.prop+'['+field.relationship.toLowerCase()+']']"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
    </template>

    <el-form-item>
      <el-button type="primary" @click="handleFormSubmit()">
        <d2-icon name="search"/>查询
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button @click="handleFormReset()">
        <d2-icon name="refresh"/>重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    structure: {
      default: () => {}
    },
    params: {
      default: () => {}
    }
  },

  methods: {
    handleFormSubmit() {
      this.$refs["listFilterForm"].validate(valid => {
        if (valid) {
          this.$emit("submit");
        } else {
          this.$notify.error({
            title: "错误",
            message: "表单校验失败"
          });
          return false;
        }
      });
    },
    handleFormReset() {
      for (var k in this.params) {
        if (k.endsWith("]")) {
          if(this.params[k] instanceof Array){
            this.params[k] = [];
          }else{
            this.params[k] = "";
          }
        }
      }
    }
  }
};
</script>
