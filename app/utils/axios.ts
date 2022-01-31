import axios from "axios";

export function initAxiosConfig() {
    axios.defaults.baseURL = process.env["API_URL"] || "http://localhost:4000"
}