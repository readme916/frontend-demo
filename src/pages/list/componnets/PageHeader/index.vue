<template>
  <el-form
    :inline="true"
    :model="params"
    :rules="rules"
    ref="form"
    size="mini"
    style="margin-bottom: -18px;">

    <template v-for="(field) in structure.listFilters">
    <el-form-item :label="field.label" :prop="field.prop" :key="field.prop">
      <el-input
        v-model="params[field.prop+'['+field.relationship.toLowerCase()+']']"
        placeholder=""
        style="width: 120px;"/>
    </el-form-item>
    </template>

    <el-form-item>
      <el-button
        type="primary"
        @click="handleFormSubmit">
        <d2-icon name="search"/>
        查询
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        @click="handleFormReset">
        <d2-icon name="refresh"/>
        重置
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {

  props:{
    structure:{
      default: () => {}
    },
    params:{
      default: () => {}
    }
  },

  data () {
    return {
      rules:{},
      form: {
        type: '1',
        user: 'FairyEver',
        key: '',
        note: ''
      },
 
    }
  },
  methods: {
    handleFormSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          this.$notify.error({
            title: '错误',
            message: '表单校验失败'
          })
          return false
        }
      })
    },
    handleFormReset () {
      this.$refs.form.resetFields()
    }
  }
}
</script>
