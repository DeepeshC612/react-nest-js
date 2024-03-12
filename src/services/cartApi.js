import { getEnv } from "../config/config";
import axios from "axios";

export async function cartAPI(id, token, method, payload) {
  let axiosConfig = {
    method: method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (id) {
    axiosConfig.url = `${getEnv("REACT_APP_API_ENDPOINT")}/cart/${id}`;
  } else {
    axiosConfig.url = `${getEnv("REACT_APP_API_ENDPOINT")}/cart`;
  }
  if (method === "POST") {
    axiosConfig.data = payload;
  }
  const res = await axios(axiosConfig);
  const { status, data, message } = res?.data;
  if (message === "Cart is empty") {
    return data;
  }
  if (status) {
    return data;
  }
}
