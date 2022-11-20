<template>
  <div class="q-pa-md" v-if="isFinished">
    <div class="text-h3">我的信息</div>
    <div class="text-h5">姓名：{{ data.realName }}</div>
    <div class="text-h6">学号：{{ data.studentId }}</div>
    <q-list bordered separator class="q-mt-sm">
      <q-item clickable>
        <q-item-section>
          <q-item-label overline>班级</q-item-label>
          <q-item-label>{{ data.className }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable>
        <q-item-section>
          <q-item-label overline>学院</q-item-label>
          <q-item-label>{{ data.college }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable>
        <q-item-section>
          <q-item-label overline>年级</q-item-label>
          <q-item-label>{{ data.grade }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>
          <q-item-label overline>更新时间</q-item-label>
          <q-item-label>{{ data.updateTime }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn
      color="primary"
      style="width: 100%"
      class="q-mt-lg"
      @click="quitLogin"
    >
      <div class="ellipsis">退出登录</div>
    </q-btn>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserInfo } from "../composables/useUserInfo";
const { data, isFinished } = useUserInfo();
const router = useRouter();
async function quitLogin() {
  window.indexedDB.deleteDatabase("inglutDb");
  router.replace("/home");
  // req.onsuccess = function () {

  //   // router.go(0);
  // };
  // req.onblocked = function () {
  //   console.log("s");
  // };
}
</script>

<style scoped></style>
