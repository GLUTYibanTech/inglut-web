<template>
  <q-card flat bordered>
    <div
      class="q-ml-md q-mt-md flex flex align-center"
      @click="pushToClassTable"
    >
      今日课程 <q-icon name="navigate_next" size="20px" />
    </div>
    <q-card-section>
      <div class="classListContainer" v-if="isFinished && !isEmptyClassToday">
        <div
          class="singleClass relative-position bg-primary q-px-sm"
          v-ripple
          v-for="(aClass, index) in getTodayClass()"
          @click="showDialog(aClass)"
          :key="index"
        >
          <div class="room text-white text-h5 text-ellipsis">
            {{ aClass.room }}
          </div>
          <div class="className text-white text-ellipsis">
            {{ aClass.className }}
          </div>
          <div class="timeDesc text-white text-ellipsis">
            {{ aClass.primativeData[0].at(-1) }}
          </div>
          <q-badge
            rounded
            color="red"
            :label="aClass.badge"
            class="badge"
            v-if="aClass.badge !== 1"
          />
        </div>
      </div>
      <div v-if="isEmptyClassToday" class="text-center">今日无课程</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useClassTable } from "../composables/useClassTable";
import { todayofWeek, weekCount } from "../utils/today";
import ClassInfoDialog from "./../components/classTable/ClassInfoDialog.vue";
import { setting } from "./classTableDefaultConfig";
export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const { isFinished, data, currentIndex } = useClassTable();
    currentIndex.value = weekCount; //回到本周

    const isEmptyClassToday = ref(false);
    //滤出今天的课程
    const getTodayClass = () => {
      if (setting.daysPerWeek == 5 && todayofWeek > 4) {
        isEmptyClassToday.value = true;
        return [];
      }
      const todayClassdata = data.value[currentIndex.value][todayofWeek].filter(
        (x) => !x.isEmpty
      );
      if (todayClassdata.length === 0) isEmptyClassToday.value = true;
      return todayClassdata;
    };

    return {
      isEmptyClassToday,
      isFinished,
      currentIndex,
      getTodayClass,
      pushToClassTable() {
        router.push("/class");
      },
      showDialog(aClass) {
        $q.dialog({
          component: ClassInfoDialog,
          componentProps: {
            info: aClass.primativeData,
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
.classListContainer
    display: flex
    flex-wrap: nowrap
    box-sizing: border-box
    overflow-x: scroll
    overflow-y: hidden
    // column-gap: 10px
    overflow: -moz-scrollbars-none
.text-ellipsis
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden
.singleClass
    flex-grow: 0
    flex-shrink: 0
    margin-left: 5px
    margin-right: 5px
    width: 109px
    height: 79px
    display: flex
    flex-direction: column
    justify-content: center
    border-radius: 3px
.classListContainer::-webkit-scrollbar
    display: none
</style>
