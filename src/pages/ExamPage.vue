<template>
  <q-list bordered class="rounded-borders" v-if="isFinished">
    <q-item-label header>近期考试</q-item-label>
    <div v-for="(exam, index) in data" :key="index">
      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label lines="1"
            >{{ exam[0]
            }}<q-chip size="10px" disable> 正常考试 </q-chip></q-item-label
          >
          <q-item-label caption lines="1">
            <q-icon name="calendar_month" size="17px" />
            <span class="text-weight-bold"> {{ exam[1] }} {{ exam[2] }}</span>
          </q-item-label>
          <q-item-label caption lines="1">
            <q-icon name="location_on" size="17px" />
            <span class="text-weight-bold">{{ exam[3] }}</span>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-chip
            class="glossy"
            :color="exam[6] ? 'positive' : 'warning'"
            text-color="white"
          >
            {{ exam[5] }}
          </q-chip>
        </q-item-section>
      </q-item>
      <q-separator />
    </div>
  </q-list>
</template>

<script>
import { useExam } from "../composables/useExam";
export default {
  setup() {
    const { isFinished, data } = useExam();
    return {
      data,
      isFinished,
    };
  },
};
</script>

<style></style>
