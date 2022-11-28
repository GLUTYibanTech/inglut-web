<template>
  <div>
    <!-- transition-prev="scale"
    transition-next="scale" -->
    <!-- arrows -->
    <!-- control-color="white" -->
    <!-- navigation -->
    <!-- <q-carousel infinite animated v-model="slide" height="200px" swipeable>
      <q-carousel-slide name="first">
        <q-img
          src="https://placeimg.com/500/300/nature"
          :ratio="16 / 9"
          spinner-color="primary"
          spinner-size="82px"
          no-spinner
          placeholder-src="https://cdn.quasar.dev/img/parallax1.jpg"
        />
        <div class="absolute-bottom custom-caption">
          <div class="text-h5">
            第{{ weekCount + 1 }}周 周{{ dayIndextoChineseChar(todayofWeek) }}
          </div>
          <div class="text-subtitle2">本学期第{{ dayCount }}天</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        name="second"
        img-src="https://cdn.quasar.dev/img/parallax1.jpg"
      >
        <div class="absolute-bottom custom-caption">
          <div class="text-h5">活动2</div>
          <div class="text-subtitle2">活动描述活动描述活动描述活动描述</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        name="third"
        img-src="https://cdn.quasar.dev/img/parallax2.jpg"
      >
        <div class="absolute-bottom custom-caption" style="text-align: right">
          <div class="text-h5">活动3</div>
          <div class="text-subtitle2">活动描述活动描述活动描述活动描述</div>
        </div>
      </q-carousel-slide>
    </q-carousel> -->
    <q-card class="my-card" flat>
      <div class="q-mx-lg q-mt-md">最近使用</div>
      <q-card-section class="q-pb-sm">
        <div class="row">
          <div class="col-3 text-center" @click="push">
            <q-avatar
              size="50px"
              font-size="24px"
              color="primary"
              text-color="white"
              icon="calendar_today"
            />
            <div class="flex-center q-ma-sm" style="font-size: 0.9em">
              课程表
            </div>
          </div>
          <div class="col-3 text-center" @click="router.push('/chat')">
            <q-avatar
              size="50px"
              font-size="24px"
              color="primary"
              text-color="white"
              icon="chat"
            />
            <div class="flex-center q-ma-sm" style="font-size: 0.9em">
              ChatRoom
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-separator inset />
    <NewsNoticeVue class="q-ma-sm" />
    <!-- <q-separator inset /> -->
    <DayClassListVue class="q-mx-sm" />
    <RecentExamListVue class="q-ma-sm" />
    <NewsBroadcastVue class="q-ma-sm" />
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

import {
  weekCount,
  todayofWeek,
  dayIndextoChineseChar,
  dayCount,
} from "../utils/today";

import { isLoginValid, isNewUser } from "../utils/user-manager";
import NewsNoticeVue from "./../components/NewsNotice.vue";
import DayClassListVue from "../components/DayClassList.vue";
import RecentExamListVue from "../components/RecentExamList.vue";
import NewsBroadcastVue from "./../components/NewsBroadcast.vue";
export default {
  components: {
    NewsBroadcastVue,
    NewsNoticeVue,
    DayClassListVue,
    RecentExamListVue,
  },
  setup() {
    const router = useRouter();
    onMounted(() => {
      window.addEventListener("popstate", function () {
        // window.history.go(-100);
        window.close();
      });
    });
    onMounted(async () => {
      if ((await isNewUser()) || !(await isLoginValid())) {
        router.push("/login");
      }
    });

    return {
      push() {
        router.push("/class");
      },
      router,
      pushToLocal() {
        window.location.href = "http://localhost:3000/";
      },
      dayIndextoChineseChar,
      todayofWeek,
      weekCount,
      dayCount,
      slide: ref("first"),
    };
  },
};
</script>

<style lang="sass" scoped>
.q-carousel__slide, .q-carousel .q-carousel--padding
    padding: 0
.align-center
  align-items: center
.notice
  align-items: center
.custom-caption
  text-align: left
  padding: 12px
  color: white
</style>
<style lang="sass">
*
  user-select: none
.flex-1
  flex:1
.align-center
  align-items: center
</style>
