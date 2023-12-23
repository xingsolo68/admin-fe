import axios from 'axios';

axios.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

//All request will wait 2 seconds before timeout
axios.defaults.timeout = 2000;

axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('ACCESS_TOKEN');

    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Basic ${accessToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const axiosPrivate = axios;
