<template>
  <!-- 课程表页面 -->
  <div class="class-background">
    <div
      class="current-week relative-position q-pa-sm"
      v-ripple
      @click="showSlider"
    >
      第{{ currentIndex + 1 }}周{{ weekCount == currentIndex ? "(本周)" : "" }}
    </div>
    <div class="days flex no-wrap">
      <div class="time-slot-place-holder"></div>
      <div
        class="day-row"
        v-for="i in setting.daysPerWeek"
        :key="i"
        :style="{
          background:
            i - 1 == todayofWeek && weekCount == currentIndex ? '#c6bdbd' : '',
        }"
      >
        {{ dayIndextoChineseChar(i - 1) }} <br />
        {{ calcDateFromWeekandDay(currentIndex, i) }}
      </div>
    </div>
    <div class="days flex no-wrap">
      <div class="time-slot-place-holder">
        <div
          class="time-block ellipsis text-center"
          v-for="(i, index) in classPeriodNames"
          :key="index"
        >
          {{ i }} <br />
          {{ classPeriods[index].startTime }} <br />
          {{ classPeriods[index].endTime }}
        </div>
      </div>

      <!-- 使用swiper组件，可左右滑动 -->
      <swiper v-if="isFinished" @swiper="onSwiper" @slideChange="onSlideChange">
        <swiper-slide v-for="(aWeek, weekIndex) in data" :key="weekIndex">
          <div class="classes-container flex no-wrap">
            <!-- 一周 -->
            <div
              class="class-day-column"
              v-for="(aDay, dayIndex) in aWeek"
              :key="dayIndex"
            >
              <!-- 一天 -->
              <div
                class="class-card-container"
                v-for="(aClass, classIndex) in aDay"
                :key="classIndex"
                :style="{ height: aClass.cardHeight + 'px' }"
              >
                <!-- 一节课 -->
                <div
                  class="class-card"
                  v-ripple
                  v-if="!aClass.isEmpty"
                  @click="showClassInfo(aClass)"
                  :style="{ backgroundColor: aClass.color }"
                >
                  <div class="text-card text-white">
                    {{ aClass.className }} <br />
                    {{ aClass.room }}
                  </div>
                  <!-- 针对课程冲突，有两节课的情况，显示数字角标 -->
                  <q-badge
                    rounded
                    color="red"
                    :label="aClass.badge"
                    class="badge"
                    v-if="aClass.badge != 1"
                  />
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useClassTable } from "./../composables/useClassTable";
import ClassInfoDialog from "./../components/classTable/ClassInfoDialog.vue";
import WeekSlider from "./../components/classTable/WeekSlider.vue";
import { getUserInfo, isNewUser } from "../utils/user-manager";
import { ref } from "vue";
import { useRouter } from "vue-router";
// 引入 Swiper 样式
import "swiper/css";
import { watch } from "vue-demi";
import { feedbackError } from "../utils/errorFeedback";
import Indexdb from "../utils/indexdb";
import {
  dayIndextoChineseChar,
  todayofWeek,
  weekCount,
  calcDateFromWeekandDay,
} from "../utils/today.js";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    Indexdb.get("background").then((x) => {
      console.log(x);
      if (x) {
        document.getElementsByClassName(
          "class-background"
        )[0].style.backgroundImage = `url(${x.data})`;
      }
    });
    const $q = useQuasar();
    const router = useRouter();
    isNewUser().then((x) => {
      if (x) router.replace("/login?routeAfterSuccess=/class");
    });
    //使用课程表数据
    let { currentIndex, data, isFinished, setting, status } = useClassTable();
    //status从0变为200，202，
    watch(status, (value) => {
      if (value == 200) {
        $q.notify({
          type: "positive",
          message: "课表更新成功！",
          timeout: 2000,
          position: "top",
        });
      } else {
        const info = getUserInfo();
        if (info && info.studentId) {
          feedbackError("课表错误：" + info.studentId);
        }
        $q.notify({
          type: "negative",
          message: "课表获取失败",
          // caption: "客服群：1111111",
          timeout: 2000,
          position: "top",
        });
      }
      //若没有绑定
      if (value === 211) {
        router.push("/login?routeAfterSuccess=/class");
      }
    });

    //swiper实例，可控制滑动
    let swiper;
    const onSwiper = (_swiper) => {
      swiper = _swiper;
      //初始化滑到本周
      swiper.slideTo(currentIndex.value);
    };
    const onSlideChange = () => {
      //直接左右滑动时同步页面索引
      currentIndex.value = swiper.activeIndex;
    };
    const currentIndexforSlider = ref(currentIndex.value);
    //监听周数滑动条滑动
    watch(currentIndexforSlider, () => {
      var c = currentIndexforSlider.value;
      setTimeout(() => {
        //防止短时间内大量堆积事件导致滑动卡顿
        if (
          c == currentIndexforSlider.value &&
          currentIndexforSlider.value != swiper.activeIndex
        ) {
          currentIndex.value = currentIndexforSlider.value;
          console.log("更换页面");
          swiper.slideTo(currentIndexforSlider.value, 700);
        }
      }, 500);
    });

    return {
      todayofWeek,
      weekCount,
      calcDateFromWeekandDay,
      dayIndextoChineseChar,
      isFinished,
      setting,
      currentIndex,
      data,
      onSwiper,
      onSlideChange,
      classPeriodNames: [
        1,
        2,
        3,
        4,
        "中午1",
        "中午2",
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
      ],
      classPeriods: setting.times,
      showClassInfo(aClass) {
        //点击课程块弹出课程信息
        $q.dialog({
          component: ClassInfoDialog,
          componentProps: {
            info: aClass.primativeData,
          },
        });
      },
      showSlider() {
        //点击周数弹出滑动条
        currentIndexforSlider.value = currentIndex.value;
        $q.dialog({
          component: WeekSlider,
          componentProps: {
            currentIndex: currentIndexforSlider,
          },
        });
      },
    };
  },
};
</script>

<style lang="sass" scoped>
.badge
  position: absolute
  top: 0
  right: 0
//文本过长，换行
.text-card
  width: 100%
  padding: 3px
  overflow-wrap: break-word
  word-break: break-all
  font-size: 0.9em

.class-card
  border-radius: 5px
  height: 100%
  width: 100%
  overflow: hidden
  position: relative

.class-card-container
  height: 60px
  width: 100%
  box-sizing: border-box
  overflow: hidden
  padding-bottom: 1px
  padding-top: 1px

.class-day-column
  flex: 1
  padding-left: 1px
  padding-right: 1px

.current-week
  text-align: center
  line-height: 40px
  border-radius: 7px
  letter-spacing: 1px
  font-size: 1.15em

.days
  width: 100%

.day-row
  /* height: 22px;
  text-align: center
  flex: 1
  border-radius:5px

.time-slot-place-holder
  min-width: 9.5vw
  max-width: 10.5vw

.time-block
  height: 60px
  display: flex
  justify-content: center
  align-items: center
  font-size: 0.8em
.class-background
  background-repeat:no-repeat
  background-position: center top
  background-size: cover
</style>
