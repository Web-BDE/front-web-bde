import axios from "axios";
import { getToken } from "~/services/authentication";

export function initAxiosConfig() {
  axios.defaults.baseURL = process.env["API_URL"] || "http://localhost:4000";
  axios.defaults.headers.common["Authorization"] = "Bearer";
}

export function handleAPIError(err: unknown) {
  if (axios.isAxiosError(err) && err.response?.data) {
    throw new Error(`${err.response?.data?.message}`);
  }
  throw err;
}

export async function buildAxiosHeaders(request: Request) {
  return { Authorization: `Bearer ${await getToken(request)}` };
}
