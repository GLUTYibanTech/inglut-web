<template>
  <q-card class="my-card" flat bordered>
    <div class="q-mx-lg q-mt-md flex align-center">
      近期考试 <q-icon name="navigate_next" size="20px" />
    </div>
    <q-card-section v-if="isFinished">
      <div class="examListContainer">
        <div
          class="singleExam relative-position bg-primary q-px-sm"
          v-ripple
          v-for="(exam, index) in data"
          :key="index"
        >
          <div class="text-white text-h6 text-subtitle1 text-ellipsis">
            {{ exam[0] }}
          </div>
          <div class="text-white text-ellipsis text-subtitle1">
            {{ exam[1] }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useExam } from "../composables/useExam";
export default {
  setup() {
    const { data, isFinished } = useExam();
    return {
      isFinished,
      data,
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
    column-gap: 10px
    overflow: -moz-scrollbars-none
.text-ellipsis
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden
.singleExam
    flex-grow: 0
    flex-shrink: 0
    width: 109px
    height: 70px
    display: flex
    flex-direction: column
    justify-content: center
    border-radius: 3px
.examListContainer::-webkit-scrollbar
    display: none
</style>
