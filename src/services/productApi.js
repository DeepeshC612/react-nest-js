import { getEnv } from "../config/config";
import axios from 'axios';

export async function productAPI(id, token, method, payload) {
  if (id) {
    const axiosConfig = {
      method: method,
      url: `${getEnv("REACT_APP_API_ENDPOINT")}/product/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if(method === "PUT") {
      axiosConfig.headers["Content-Type"] = "multipart/form-data"
      axiosConfig.data = payload
    }
    const res = await axios(axiosConfig)
    const { status, data, message } = res?.data;
    if (status) {
      if(method === 'DELETE') {
        return message
      } else {
        return method === 'PUT' ? {data: data, message: message} : data;
      }
    }
  }
}
