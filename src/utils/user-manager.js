import { ref } from "vue";
import { createAxiosWithToken, axios } from "./api";
import indexdb from "./indexdb";
const loginHttpStatus = ref(0);
async function bindJw(xh, mm) {
  var http = await axios.post("/webapi/bind", {
    studentId: xh,
    encryptedPassword: mm,
  });
  loginHttpStatus.value = http.status;
  if (http.status === 200) {
    console.log(http.data);
    await indexdb.set("token", http.data.token);
    return { res: http.status, token: http.data.token };
  } else {
    console.log("登录失败");
    return { res: http.status, token: null };
  }
}
const keyName = "userinfo";
async function getUserInfo({ fromDb = true } = { fromDb: true }) {
  const hasDataInDb = await indexdb.hasKey(keyName, 24 * 10);
  if (fromDb && hasDataInDb) {
    console.log("从IndexDb中获取用户信息");
    const info = (await indexdb.get(keyName)).data;
    console.log(info);
    return info;
  } else {
    const http = await (await createAxiosWithToken()).get(`/webapi/info`);
    console.log("请求用户信息中");
    if (http.status == 200) {
      console.log("请求成功");
      await indexdb.set(keyName, http.data);
      return http.data;
    } else {
      console.log("请求失败");
      return null;
    }
  }
}
async function isNewUser() {
  return !(await indexdb.hasKey("token"));
}
async function isLoginValid() {
  var http = await (await createAxiosWithToken()).get(`/webapi/isvalidToken`);
  return http.status == 200;
}
async function setNickName(nickname) {
  var http = await (
    await createAxiosWithToken()
  ).post(`/webapi/setNickName?nickName=${nickname}`);
  await getUserInfo({ fromDb: false });
  return http.status == 200;
}
export {
  bindJw,
  getUserInfo,
  isLoginValid,
  isNewUser,
  setNickName,
  loginHttpStatus,
};
