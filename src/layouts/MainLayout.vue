<template>
  <q-layout view="hhh lpR fFf">
    <!-- <q-header reveal elevated class="bg-primary text-white"> -->
    <!-- 全屏占位，防止遮挡 -->
    <!-- <q-bar dark class="bg-primary text-white"> </q-bar>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title style="user-select: none"> in桂工 </q-toolbar-title>
      </q-toolbar>
    </q-header> -->
    <q-page-container>
      <!-- 路由页面 -->
      <router-view v-slot="{ Component }">
        <!-- 过渡动画 -->
        <Transition>
          <!-- 组件选择 -->
          <component :is="Component" />
        </Transition>
        <!-- 过渡动画 -->
      </router-view>
      <!-- 路由页面 -->
    </q-page-container>
    <q-footer>
      <q-tabs
        v-model="tab"
        indicator-color="primary"
        class="bg-white text-primary shadow-2"
      >
        <q-tab
          v-for="(item, index) in naviItem"
          :key="index"
          :name="item.name"
          :icon="item.icon"
          :label="item.name"
          @click="goto(item.to)"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { isLoginValid, isNewUser } from "../utils/user-manager";
export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    onMounted(async () => {
      if ((await isNewUser()) || !(await isLoginValid())) {
        router.push("/login");
      }
    });
    $q.addressbarColor.set("#1976D2"); //浏览器链接栏颜色
    const naviItem = [
      { to: "/home", name: "首页", icon: "home" },
      // { to: "/apps", name: "应用", icon: "apps" },
      // { to: "/discover", name: "发现", icon: "search" },
      { to: "/mine", name: "我的", icon: "school" },
    ];
    return {
      tab: ref("首页"),
      naviItem,
      goto(path) {
        // 可以保证用户在其他页面（非/home）按返回键时不会直接退出网站，而是回到主页。
        if (route.path == path) {
          console.log("无需路由");
          return;
        }
        //直接替换当前路径，防止无限返回。
        router.replace(path);
      },
      route,
    };
  },
};
</script>

<style lang="sass" scoped>
//过渡动画
.v-enter-active,
.v-leave-active
  transition: opacity 0.01s ease
.v-enter-from,
.v-leave-to
  opacity: 0
</style>
