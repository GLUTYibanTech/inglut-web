<script>
import { onMounted } from "vue";

export default {
  setup() {
    onMounted(() => {
      // document.getElementsByTagName("body")[0].click();\
      const jsBridgeApi = function (action, arg, callback) {
        arg = arg || {};
        if (typeof callback === "function") {
          var randomFunc =
            "jsApi_" +
            Math.random().toString().substr(2) +
            new Date().getTime();
          var fn = callback;
          window[randomFunc] = function () {
            window[randomFunc] = null;
            fn.apply(null, arguments);
          };
          callback = randomFunc;
        } else callback = callback || null;
        window.webAppBridge.jsApi(
          JSON.stringify({
            action: action,
            arg: arg,
            callback: callback,
          })
        );
      };
      setTimeout(() => {
        jsBridgeApi("portrait", {});
        const div = document.getElementsByClassName("vue-main")[0];
        div.style.width = window.innerWidth + "px";
        div.style.height = window.innerHeight + "px";
        div.style.transform = "";
        div.style.position = "fixed";
      }, 3000);
      const interval = setInterval(() => {
        // if (o.flag.screenOrientation == 0) return true;//已经是纵向显示了
        // o.flag.screenOrientation = 0;
        // if (o.flag.is_App) {
        // 	return;
        // }
        // o.work.style.width = window.innerWidth + 'px';
        // o.work.style.height = window.innerHeight + 'px';
        // o.work.style.transform = "";
        // if (document.fullscreenEnabled) {
        //   console.log("已经全屏");
        //   clearInterval(interval);
        // }
        // document.documentElement.requestFullscreen();
      }, 1000);
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
