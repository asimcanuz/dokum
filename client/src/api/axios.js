import axios from "axios";

const BASE_URL = "http://" + window.location.hostname + ":3003";
export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
