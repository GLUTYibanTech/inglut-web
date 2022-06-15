<template>
  <!-- 课程表页面 -->
  <div>
    <div
      class="current-week relative-position q-ma-sm"
      v-ripple
      @click="showSlider"
    >
      第{{ currentIndex + 1 }}周{{ weekCount == currentIndex ? "(本周)" : "" }}
    </div>
    <div class="days flex no-wrap">
      <div class="time-slot-place-holder"></div>
      <div
        class="day-row"
        v-for="i in 7"
        :key="i"
        :style="
          (i - 1 == todayofWeek && weekCount == currentIndex
            ? 'background: #c6bdbd;color: #3d95c6;'
            : '') + 'border-radius: 7px;'
        "
      >
        {{ dayIndextoChineseChar(i - 1) }} <br />
        {{ calcDateFromWeekandDay(currentIndex, i) }}
      </div>
    </div>
    <div class="days flex no-wrap">
      <div class="time-slot-place-holder">
        <div class="time-block" v-for="i in 14" :key="i">{{ i }}</div>
      </div>
      <!-- 使用swiper组件，可左右滑动 -->
      <swiper
        v-if="isFinished"
        class="classes-swiper"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
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
                :style="'height:' + aClass.cardHeight + 'px'"
              >
                <!-- 一节课 -->
                <div
                  class="class-card"
                  v-ripple
                  v-if="!aClass.isEmpty"
                  @click="showClassInfo(aClass)"
                  :style="'background-color:' + aClass.color"
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
import { ref } from "vue";
// 引入 Swiper 样式
import "swiper/css";
import { onMounted, watch } from "vue-demi";
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
    const $q = useQuasar();
    //使用课程表数据
    let { currentIndex, data, isFinished, setting } = useClassTable();
    //swiper实例，可控制滑动
    let swiper;
    const onSwiper = (_swiper) => {
      swiper = _swiper;
      //初始化滑到本周
      swiper.slideTo(currentIndex.value);
    };
    onMounted(() => {});
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
  height: 40px
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

.time-slot-place-holder
  min-width: 9.5vw
  max-width: 10.5vw

.time-block
  height: 60px
  display: flex
  justify-content: center
  align-items: center
</style>
