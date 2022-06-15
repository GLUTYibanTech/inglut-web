import axios from "axios";
import db from "./indexdb";

async function setToken(_axios) {
  _axios.defaults.headers.common["token"] = await db.getToken();
}
// setToken();
async function createAxiosWithToken() {
  const api = axios.create();
  // api.defaults.baseURL = window.location.origin;
  await setToken(api);
  console.log("axios inited from created");
  return api;
}
export { createAxiosWithToken, axios };
export default axios;
