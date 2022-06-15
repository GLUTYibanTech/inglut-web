<template>
  <!-- 一节的课程信息弹出框 -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-list bordered v-for="(i, index) in dataArray" :key="index">
        <q-item>
          <q-item-section class="text-h5">
            {{ i[0].value }}
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          style="width: 100%"
          v-for="(n, index) in i"
          :key="index"
        >
          <q-item-section avatar>
            <q-icon color="primary" :name="n.icon" />
          </q-item-section>
          <q-item-section>{{ n.name }}</q-item-section>
          <q-item-section side class="text-right">
            {{ n.value }}
          </q-item-section>
        </q-item>
      </q-list>
      <!--
        ...content
        ... use q-card-section for it?
      -->

      <!-- buttons example -->
      <!-- <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from "quasar";
export default {
  props: {
    info: Array,
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
    const dataArray = [];
    props.info.forEach((item) => {
      dataArray.push([
        { name: "名称", value: item[0], icon: "menu_book" },
        { name: "教室", value: item[1], icon: "location_on" },
        { name: "教师", value: item[2], icon: "school" },
        { name: "周数", value: item[3], icon: "date_range" },
        { name: "节数", value: item[4], icon: "schedule" },
        { name: "类型", value: item[5], icon: "border_color" },
      ]);
    });
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    return {
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      dataArray,
      // props,
      // getList() {
      //   props.info.forEach((i) => {
      //     console.log(i);
      //   });
      // },
      onDialogHide,

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
