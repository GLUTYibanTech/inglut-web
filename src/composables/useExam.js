import { ref, onMounted } from "vue";
import { createAxiosWithToken } from "../utils/api";
import indexdb from "../utils/indexdb";
let isFinished = ref(false);
const indexDbkey = "exam";
const status = ref(0);
const data = ref();
function useExam({ fromDb = true } = { fromDb: true }) {
  onMounted(async () => {
    const hasDataInDb = await indexdb.hasKey(indexDbkey);
    if (fromDb && hasDataInDb) {
      console.log("从IndexDb中获取考试");
      const dbData = (await indexdb.get(indexDbkey)).data;
      console.log(dbData);
      data.value = dbData;
      isFinished.value = true;
      return;
    }
    let http = await (await createAxiosWithToken()).get(`/webapi/exam`);
    status.value = http.status;
    if (http.status == 200) {
      let dataModel = http.data;
      console.log(dataModel);
      await indexdb.set(indexDbkey, dataModel);
      data.value = dataModel;
    }
  });
  return {
    isFinished,
    data,
  };
}
export { useExam };
