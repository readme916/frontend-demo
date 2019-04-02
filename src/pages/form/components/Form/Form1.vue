<template>
  <el-form ref="form" :model="form" label-position="top">
    <el-form-item label="姓名">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="姓名">
      <el-radio-group v-model="form.usersex">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="0">女</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
    name:"Form1",
    index:1,
    title:'基础',
    props:{
        value:{
            default: () => ({
                username:"",
                usersex:1
            })
        }
    },
    data () {
        return {
            'form': {
                username:"",
                usersex:1
            }
        }
    },
    watch : {
        'form':{
            handler(value){
                this.$emit("input",value)
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
