import { ref } from "vue";
import { getUserInfo } from "../utils/user-manager";

const isFinished = ref(false);
const data = ref([]);
function useUserInfo({ fromDb = true } = { fromDb: true }) {
  getUserInfo({ fromDb: fromDb }).then((info) => {
    data.value = info;
    isFinished.value = true;
  });
  return {
    isFinished,
    data,
  };
}
export { useUserInfo };
