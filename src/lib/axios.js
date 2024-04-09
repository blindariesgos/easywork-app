import axios from 'axios';

const config = axios.defaults;
config.headers.common = {
  ...config.headers.common,
  ["Content-Type"]: "application/json",
  "Authorization": "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6W3siaWQiOiIzZmY3ODZkNi04Y2M5LTRkMjktODQxMC0xNzE5N2QyNWVmMGYiLCJuYW1lIjoidXNlciJ9XSwiaXNUd29GYWN0b3JFbmFibGVkIjpmYWxzZSwiaWF0IjoxNzEyNzAzNzU1LCJleHAiOjE3MTI3MDczNTUsInN1YiI6IjM3ZTNiOTQ3LWI1NmItNDNiMy1hNjE3LTMwODk3ZjRmNTE5MyJ9.GUh4xKxzlva4pH-Lm95Wh1kUfC7GW_bcMdduUDAj8sM"
};
const instance = axios.create({
  baseURL: 'http://52.8.72.245/v1',
  ...config.headers.common
});

// Data Response Interceptor
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // console.log("error axios", Promise.reject(error))
    // throw new Error(error)
    return Promise.reject(error);
  }
);


export default instance;
