import { ref, onMounted } from "vue";
import { createAxiosWithToken } from "../utils/api";
import indexdb from "../utils/indexdb";
let isFinished = ref(false);
const indexDbkey = "exam";
const status = ref(0);
const data = ref([]);
function useExam(
  { fromDb = true, filterFinished = false } = {
    fromDb: true,
    filterFinished: false,
  }
) {
  onMounted(async () => {
    const hasKey = await indexdb.hasKey(indexDbkey);
    if (hasKey) {
      const dbData = (await indexdb.get(indexDbkey)).data;
      data.value = dbData;
    }
    const hasDataInDbIn1hour = await indexdb.hasKey(indexDbkey, 1);
    if (fromDb && hasDataInDbIn1hour) {
      console.log("从IndexDb中获取考试", data.value);
    } else {
      let http = await (await createAxiosWithToken()).get(`/webapi/exam`);
      status.value = http.status;
      if (http.status == 200) {
        let dataModel = http.data;
        console.log("http获取考试", dataModel);
        await indexdb.set(indexDbkey, dataModel);
        data.value = dataModel;
      }
    }
    if (filterFinished) {
      data.value = data.value.filter((x) => !x[6]);
    }
    isFinished.value = true;
  });
  return {
    isFinished,
    data,
  };
}
export { useExam };
