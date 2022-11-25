import axios from "axios";
import db from "./indexdb";

async function createAxiosWithToken() {
  const api = axios.create();
  api.defaults.headers.common["token"] = await db.getToken();
  console.log("axios inited from created");
  return api;
}
export { createAxiosWithToken, axios };
export default axios;
