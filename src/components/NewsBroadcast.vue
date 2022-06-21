<template>
  <q-card class="my-card q-ma-sm" flat bordered>
    <div class="q-mx-lg q-mt-md flex align-center">
      通知公告 <q-icon name="navigate_next" size="20px" />
    </div>
    <q-card-section>
      <div class="row">
        <div class="col-12" v-for="i in 7" :key="i">
          <div class="q-ml-md ellipsis text-no-wrap">
            【桂林理工大学易班】通知公告测试通知公告测试通知公告测
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {};
</script>

<style></style>
