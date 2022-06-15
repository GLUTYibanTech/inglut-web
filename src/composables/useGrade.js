import indexdb from "../utils/indexdb";
import { ref, onMounted } from "vue";
import { createAxiosWithToken } from "../utils/api";
import { year, term } from "../utils/today";
export default useGrade;
const data = ref([]);
const isFinished = ref(false);
export { data, isFinished };
function useGrade({ fromDb = true } = { fromDb: true }) {
  const keyName = "grade";
  onMounted(async () => {
    if (fromDb) {
      const keyData = await indexdb.get(keyName);
      if (keyData) {
        isFinished.value = true;
        data.value = keyData.data;
        return;
      }
    }
    const axios = await createAxiosWithToken();
    const classes = await axios.get(`/webapi/grade/${year}/${term}`);
    await indexdb.set(keyName, classes.data);
    console.log(classes);
    data.value = classes.data;
    isFinished.value = true;
  });
  return {
    data,
    isFinished,
  };
}
