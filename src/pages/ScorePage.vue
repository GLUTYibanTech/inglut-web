<template>
  <div class="progressControl q-pa-lg flex justify-between">
    <div class="controlItem">
      <q-icon name="navigate_before" size="30px" />
    </div>
    <div class="text-center text-subtitle1">2020年秋</div>
    <div class="controlItem" style="text-align: right">
      <q-icon name="navigate_next" size="30px" />
    </div>
  </div>
  <div class="q-pa-md">
    <q-table
      grid
      :card-container-class="cardContainerClass"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
      :rows-per-page-options="rowsPerPageOptions"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-card-section class="text-center">
              Calories for
              <br />
              <strong>{{ props.row.name }}</strong>
            </q-card-section>
            <q-separator />
            <q-card-section
              class="flex flex-center"
              :style="{ fontSize: props.row.calories + 'px' }"
            >
              <div>{{ props.row.calories }} g</div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>

  <!-- <div class="row q-px-md">
    <div class="col-4 q-px-sm q-py-sm">
      <div
        class="bg-amber block relative-position text-center q-pa-md flex scoreBlock"
        v-ripple
      >
        <div class="text-h4 w-100 score">90</div>
        <div class="text-subtitle1 w-100">大学物理</div>
      </div>
    </div>
    <div class="col-4 q-px-sm q-py-sm">
      <div class="bg-amber block relative-position" v-ripple></div>
    </div>
    <div class="col-4 q-px-sm q-py-sm">
      <div class="bg-amber block relative-position" v-ripple></div>
    </div>
    <div class="col-4 q-px-sm q-py-sm">
      <div class="bg-amber block relative-position" v-ripple></div>
    </div> -->
</template>

<script>
import useGrade from "../composables/useGrade";
import { useQuasar } from "quasar";
import { ref, computed, watch } from "vue";

const deserts = [
  "Frozen Yogurt",
  "Ice cream sandwich",
  "Eclair",
  "Cupcake",
  "Gingerbread",
  "Jelly bean",
  "Lollipop",
  "Honeycomb",
  "Donut",
  "KitKat",
];

const rows = [];

deserts.forEach((name) => {
  for (let i = 0; i < 24; i++) {
    rows.push({
      name: name + " (" + i + ")",
      calories: 20 + Math.ceil(50 * Math.random()),
    });
  }
});

rows.sort(() => -1 + Math.floor(3 * Math.random()));
export default {
  setup() {
    const { data, isFinished } = useGrade();
    const $q = useQuasar();

    function getItemsPerPage() {
      if ($q.screen.lt.sm) {
        return 3;
      }
      if ($q.screen.lt.md) {
        return 6;
      }
      return 9;
    }

    const filter = ref("");
    const pagination = ref({
      page: 1,
      rowsPerPage: getItemsPerPage(),
    });

    watch(
      () => $q.screen.name,
      () => {
        pagination.value.rowsPerPage = getItemsPerPage();
      }
    );

    return {
      rows,

      filter,
      pagination,

      columns: [
        { name: "name", label: "Name", field: "name" },
        { name: "calories", label: "Calories (g)", field: "calories" },
      ],

      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? "grid-masonry grid-masonry--" + ($q.screen.gt.sm ? "3" : "2")
          : null;
      }),

      rowsPerPageOptions: computed(() => {
        return $q.screen.gt.xs ? ($q.screen.gt.sm ? [3, 6, 9] : [3, 6]) : [3];
      }),
    };
    // return {
    //   data,
    //   isFinished,
    // };
  },
};
</script>

<style scoped lang="sass">
.block
    height: 170px
    width: 100%
    border-radius: 15px
.progressControl
    width: 100%
    height: 70px
    align-items: center
.controlItem
    min-width: 60px
.scoreBlock
    height: 100%
    flex-direction: column
.w-100
    width: 100%
.score
    flex: 1
    height: 100%
</style>
