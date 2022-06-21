<script>
import { onMounted } from "vue";

export default {
  setup() {
    onMounted(() => {
    });
  },
};
</script>

<template>
  <div class="vue-main">
    <router-view></router-view>
  </div>
</template>

<style>
.vue-main {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
