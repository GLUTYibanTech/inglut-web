import { createAxiosWithToken } from "./api";

async function feedbackError(msg) {
  const axios = await createAxiosWithToken();
  return axios.get("/webapi/errorFeedback?error=" + msg);
}
export { feedbackError };
