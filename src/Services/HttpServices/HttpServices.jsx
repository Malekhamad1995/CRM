import axios from "axios";
import { RefreshToken } from "../LoginService";
import { Log } from "../../Helper";
import { config } from "../../config";

axios.interceptors.request.use(
  (configurations) => {
    const configurationsLocal = configurations;
    if (
      localStorage.getItem("session") &&
      JSON.parse(localStorage.getItem("session")).token !== ""
    ) {
      configurationsLocal.headers.Authorization = `Bearer ${
        JSON.parse(localStorage.getItem("session")).token
      }`;
    }
    configurationsLocal.headers.source = config.source;
    return configurationsLocal;
  },
  (error) => {
    // Promise.reject('request', error);

    Log(error);
  }
);

// interceptors for handle any  response
axios.interceptors.response.use(
  (response) =>
    // Do something with response data

    response,
  (error) => {
    // Do something with response error
    if (error && error.response && error.response.status === 401) {
      const obj = JSON.parse(localStorage.getItem("session"));
      const { token } = obj;
      const refreshTokenId = obj.refreshToken;
      obj.token = "";
      localStorage.setItem("session", JSON.stringify(obj));
      RefreshToken({ refreshTokenId, token }).then((result) => {
        if (result) localStorage.setItem("session", JSON.stringify(result));
      });
    }
    // else if(error.response.status === 404)
    // GlobalHistory.push("/error");
    // Trow errr again (may be need for some other catch)
    Log(error);
    return Promise.reject(error);
  }
);

export const HttpServices = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
