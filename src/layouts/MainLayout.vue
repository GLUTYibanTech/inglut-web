<template>
  <q-layout view="hhh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <!-- 全屏占位，防止遮挡 -->
      <q-bar dark class="bg-primary text-white"> </q-bar>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title style="user-select: none"> in桂工 </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- 左侧抽屉 -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      behavior="mobile"
      :width="220"
    >
      <!-- 个人信息 -->
      <q-img
        class="absolute-top"
        src="../assets/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent" v-if="isFinished">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="../assets/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">{{ userInfo.realName }}</div>
          <div>{{ userInfo.className }}</div>
        </div>
      </q-img>
      <!-- 导航菜单 -->
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <q-item
            clickable
            v-ripple
            v-for="(item, index) in naviItem"
            @click="goto(item.to)"
            :active="item.to == route.path"
            :key="index"
          >
            <!-- 头像 -->
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>

            <q-item-section> {{ item.name }} </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
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
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useUserInfo } from "./../composables/useUserInfo";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    $q.addressbarColor.set("#1976D2"); //浏览器链接栏颜色
    const naviItem = [
      { to: "/home", name: "首页", icon: "star" },
      { to: "/class", name: "课程", icon: "history_edu" },
      { to: "/exam", name: "考试", icon: "mode" },
      { to: "/grade", name: "成绩", icon: "school" },
      { to: "/discover", name: "发现", icon: "search" },
      { to: "/about", name: "关于", icon: "info" },
    ];
    //将用户信息显示在抽屉
    const { data: userInfo, isFinished } = useUserInfo();
    return {
      userInfo,
      isFinished,
      naviItem,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      notify() {
        $q.notify("Message");
      },
      goto(path) {
        // 可以保证用户在其他页面（非/home）按返回键时不会直接退出网站，而是回到主页。
        if (path == "/home") {
          router.push(path);
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
