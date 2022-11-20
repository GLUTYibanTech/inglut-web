import { createRouter, createWebHashHistory } from "vue-router";
const routes = [
  {
    path: "/",
    component: () => import("./layouts/MainLayout.vue"),
    children: [
      { path: "", redirect: "/home" },
      { path: "home", component: () => import("./pages/IndexPage.vue") },
      { path: "class", component: () => import("./pages/ClassTable.vue") },
      { path: "exam", component: () => import("./pages/ExamPage.vue") },
      { path: "grade", component: () => import("./pages/ScorePage.vue") },
      { path: "mine", component: () => import("./pages/MyInfoPage.vue") },
    ],
  },
  { path: "/about", component: () => import("./pages/AboutPage.vue") },
  {
    path: "/login",
    component: () => import("./pages/LoginPage.vue"),
    props: (route) => ({ routeAfterSuccess: route.query.routeAfterSuccess }),
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("./pages/Error404.vue"),
  },
];

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});
export default router;
