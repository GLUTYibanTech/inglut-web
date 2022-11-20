<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page padding class="bg-primary page">
        <div class="text-h5 text-center q-mt-lg text-white">教务登录</div>
        <q-card class="my-card" style="margin-top: 100px">
          <!-- <img src="https://cdn.quasar.dev/img/mountains.jpg"> -->
          <q-card-section>
            <q-input v-model="studentId" label="学号" />
            <q-separator spaced inset dark />
            <q-input
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              label="教务处密码"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </q-card-section>
          <!-- icon="east" -->
          <q-card-section>
            <q-btn
              color="primary"
              style="width: 100%"
              label="登录"
              @click="login"
            />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { bindJw } from "./../utils/user-manager";
import { useQuasar } from "quasar";
export default {
  props: {
    routeAfterSuccess: { type: String, default: "/" },
  },
  setup(props) {
    console.log("登录成功后回调到：", props.routeAfterSuccess);
    const router = useRouter();
    const $q = useQuasar();
    const isPwd = ref(true);
    const studentId = ref("");
    const password = ref("");
    return {
      isPwd,
      studentId,
      password,
      async login() {
        const notify = $q.notify({
          type: "ongoing",
          message: "正在登录中",
          timeout: 1000,
          position: "top",
        });
        var res = await bindJw(studentId.value, password.value);
        if (res) {
          notify({
            type: "positive",
            message: "登录成功！",
            timeout: 2000,
          });
          router.replace(props.routeAfterSuccess);
        } else {
          notify({
            type: "negative",
            message: "登录失败，请检查学号密码正确性",
            caption: "客服群：1111111",
            timeout: 2000,
          });
        }
      },
    };
  },
};
</script>

<style scoped>
/* .page {
  display: flex;
  align-items: center;
} */
/* .my-card {
  width: 100%;
} */
</style>
