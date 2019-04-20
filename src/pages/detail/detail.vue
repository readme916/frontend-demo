<template>
  <d2-container>
    <div>这是个详细页,应用:{{ $route.params.application }}, 实体：{{ $route.params.resource }}，UUID：{{ $route.params.id }}</div>
  </d2-container>
</template>

<script>
export default {
  name: "detail"
};
</script>
