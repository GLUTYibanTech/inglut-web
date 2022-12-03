<template>
  <q-card flat bordered>
    <div class="q-ml-md q-mt-md flex align-center" @click="pushToExam">
      近期考试 <q-icon name="navigate_next" size="20px" />
    </div>
    <q-card-section>
      <div class="examListContainer" v-if="isFinished && data.length >= 1">
        <div
          class="singleExam relative-position bg-primary q-px-sm"
          v-ripple
          v-for="(exam, index) in data"
          :key="index"
          @click="pushToExam"
        >
          <div class="text-white text-h6 text-subtitle1 text-ellipsis">
            {{ exam[0] }}
          </div>
          <div class="text-white text-ellipsis text-subtitle1">
            {{ exam[1].slice(5) }} {{ exam[2].substring(0, 5) }}
          </div>
        </div>
      </div>
      <div v-if="data.length == 0" class="text-center">暂无考试</div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useRouter } from "vue-router";
import { useExam } from "../composables/useExam";
export default {
  setup() {
    const router = useRouter();
    const { data, isFinished } = useExam({ filterFinished: true });

    return {
      isFinished,
      data,
      pushToExam() {
        router.push("/exam");
      },
    };
  },
};
</script>

<style lang="sass" scoped>
.examListContainer
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
.singleExam
    flex-grow: 0
    flex-shrink: 0
    margin-left: 5px
    margin-right: 5px
    width: 109px
    height: 70px
    display: flex
    flex-direction: column
    justify-content: center
    border-radius: 3px
.examListContainer::-webkit-scrollbar
    display: none
</style>
