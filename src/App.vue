<template>
  <div id="vue-admin-beautiful">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    mounted() {},
  }
</script>
<style>
  .transfer-title {
    margin-top: 0;
  }
  .list-form {
    display: flex;
    justify-content: flex-end;
  }
  .tag {
    margin-right: 4px;
  }
  .male {
    color: #409eff;
  }
  .female {
    color: pink;
  }
</style>
