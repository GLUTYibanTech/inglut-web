import indexdb from "../utils/indexdb";
import { ref, onMounted } from "vue";
import { getUserInfo } from "../utils/user-manager";
export { useUserInfo };
const isFinished = ref(false);
const data = ref([]);
function useUserInfo({ fromDb = true } = { fromDb: true }) {
  const keyName = "userinfo";
  onMounted(async () => {
    const hasDataInDb = await indexdb.hasKey(keyName);
    if (fromDb && hasDataInDb) {
      console.log("从IndexDb中获取用户信息");
      const info = (await indexdb.get(keyName)).data;
      console.log(info);
      data.value = info;
      isFinished.value = true;
      return;
    } else {
      const http = await getUserInfo();
      console.log("请求用户信息中");
      if (http.status == 200) {
        console.log("请求成功");
        await indexdb.set(keyName, http.data);
        data.value = http.data;
        isFinished.value = true;
        console.log(data);
      } else {
        console.log("请求失败");
      }
    }
  });
  return {
    isFinished,
    data,
  };
}
