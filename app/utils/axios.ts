import axios from "axios";
import { json } from "remix";
import { requireAuth } from "~/services/authentication";

export function initAxiosConfig() {
  axios.defaults.baseURL = process.env["API_URL"] || "http://localhost:4000";
  axios.defaults.headers.common["Authorization"] = "Bearer";
}

export class APIError {
  error: Error;
  code: number;

  constructor(error: Error, code: number) {
    this.error = error;
    this.code = code;
  }
}

export function handleAPIError(err: unknown) {
  if (axios.isAxiosError(err) && err.response?.data) {
    throw new APIError(
      new Error(err.response.data.message),
      err.response.status
    );
  }
  throw err;
}

export function buildAxiosHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function buildSearchParams(...args: Array<string | undefined>) {
  if (args.length) {
    let result = "?";
    args.forEach((val) => {
      result += val ? val : "";
    });
    console.log(result);
    return result.slice(-1);
  } else return "";
}
