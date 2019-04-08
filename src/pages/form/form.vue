<template>
  <d2-container>
    <template slot="header">可配置的表单例子</template>
    <div class="questionnaire">
      <el-container>
        <Form1></Form1>

      </el-container>
    </div>
    <template slot="footer">左侧选择，右侧查看</template>
  </d2-container>
</template>

<script>
export default {
  name: "page1",
  components: {
      Form1 : () => import("./components/Form/Form1.vue")
  },
  data() {
    return {
      formList: [{
          title:'基础',
          name:'Form1'
      }],
      form: []
    };
  }
};
</script>
