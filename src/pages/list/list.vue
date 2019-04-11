<template>
  <d2-container>
    <div>这是个列表,应用:{{ $route.params.application }}, 实体：{{ $route.params.entity }}</div>
  </d2-container>
</template>

<script>
export default {
  name: "list"
};
</script>
