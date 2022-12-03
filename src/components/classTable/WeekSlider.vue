<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide" position="bottom">
    <q-card class="q-dialog-plugin" style="height: 200px">
      <q-card-section>
        <!-- label-always -->
        <q-slider
          style="margin-top: 20px"
          v-model="value"
          :min="0"
          :max="19"
          :step="1"
          :label-value="value + 1"
          color="primary"
        />
      </q-card-section>
      <!-- <div class="row">
        <div class="col-3">
          <q-icon name="print" size="100px" />
        </div>
        <div class="col-3"></div>
        <div class="col-3"></div>
        <div class="col-3"></div>
      </div> -->
      <q-tabs indicator-color="transparent">
        <q-tab icon="schedule" label="切换校区" @click="setSchool" />
        <q-tab icon="image" label="设置背景" @click="showFileSelector" />
        <!-- <q-tab icon="date_range" label="忽略周末" @click="showWeekend" /> -->
        <q-tab icon="delete" label="恢复默认" @click="returnBack" />
        <q-tab icon="refresh" label="立即更新" @click="refresh" />
      </q-tabs>
    </q-card>
    <q-file
      v-model="filesImages"
      class="hidden fileselector"
      accept=".jpg,.png,image/*"
      max-file-size="5000000"
      @update:model-value="fileSelected"
      @rejected="onRejected"
    />
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { ref } from "vue";
import image2base64 from "../../utils/image2base64";
import Indexdb from "../../utils/indexdb";
import { useRouter } from "vue-router";
export default {
  props: {
    currentIndex: Object,
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup(props) {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const $q = useQuasar();
    const router = useRouter();
    // console.log(props);
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome
    // const emitChange = (e) => {
    //   context.emit("change", e);
    // };
    // const value = ref(props.currentIndex);
    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      filesImages: ref(null),
      showFileSelector() {
        document.getElementsByClassName("fileselector")[0].click();
      },
      dialogRef,
      setSchool() {
        let school = localStorage.getItem("school");
        if (school == null || school == "yanshan") {
          localStorage.setItem("school", "pingfeng");
        } else localStorage.setItem("school", "yanshan");
        router.go(0);
      },
      async returnBack() {
        await Indexdb.del("background");
        await Indexdb.del("school");
        await Indexdb.del("daysPerWeek");
        await Indexdb.del("classtable");
        router.go(0);
      },
      async showWeekend() {
        let daysPerWeek = localStorage.getItem("daysPerWeek");
        if (daysPerWeek == null || daysPerWeek == "7") {
          localStorage.setItem("daysPerWeek", "5");
        } else localStorage.setItem("daysPerWeek", "7");
        await Indexdb.del("classtable");
        router.go(0);
      },
      async refresh() {
        await Indexdb.del("classtable");
        router.go(0);
      },
      onRejected() {
        $q.notify({
          message: "文件过大",
        });
      },
      async fileSelected(e) {
        let file = await image2base64(e);
        await Indexdb.set("background", file);
        router.go(0);
      },
      onDialogHide,
      value: props.currentIndex,
      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK();
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
};
</script>
