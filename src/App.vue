<script>
import { onMounted } from "vue";

export default {
  setup() {
    onMounted(() => {
      // document.getElementsByTagName("body")[0].click();
      const interval = setInterval(() => {
        if (document.fullscreenEnabled) {
          console.log("已经全屏");
          clearInterval(interval);
        }
        document.documentElement.requestFullscreen();
      }, 1000);
    });
  },
};
</script>

<template>
  <router-view></router-view>
</template>

<style></style>
