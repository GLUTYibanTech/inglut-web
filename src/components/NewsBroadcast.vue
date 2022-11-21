<template>
  <q-card class="my-card q-ma-sm" flat bordered>
    <div class="q-ml-md q-mt-md flex align-center">
      通知公告 <q-icon name="navigate_next" size="20px" />
    </div>
    <q-card-section>
      <div class="row">
        <div class="col-12" v-for="i in 7" :key="i">
          <div class="q-ml-sm ellipsis text-no-wrap q-mb-sm">
            【桂林理工大学易班】测试通知测试通知测试通知测试通知
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
