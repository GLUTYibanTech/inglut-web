import { createAxiosWithToken, axios } from "./api";
import Indexdb from "./indexdb";
import indexdb from "./indexdb";
async function bindJw(xh, mm) {
  var http = await axios.post("/webapi/bind", {
    studentId: xh,
    encryptedPassword: mm,
  });
  if (http.status === 200) {
    console.log(http.data);
    await indexdb.set("token", http.data.token);
    return http.data.token;
  } else {
    console.log("登录失败");
    return null;
  }
}
async function getUserInfo() {
  var http = await (await createAxiosWithToken()).get(`/webapi/info`);
  return http;
}
async function isNewUser() {
  return !(await Indexdb.hasKey("token"));
}
async function isLoginValid() {
  var http = await (await createAxiosWithToken()).get(`/isvalidToken`);
  return http.status == 200;
}
export { bindJw, getUserInfo, isLoginValid, isNewUser };
