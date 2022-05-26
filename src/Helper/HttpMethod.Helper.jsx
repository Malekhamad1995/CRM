import axios from 'axios';

axios.interceptors.request.use(
  (configurations) => {
    const configurationsLocal = configurations;
    if (
      !configurationsLocal.headers.isPublic &&
      localStorage.getItem('session') &&
      JSON.parse(localStorage.getItem('session')).token !== ''
    ) {
      configurationsLocal.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('session')).token
        }`;
    }
    return configurationsLocal;
  },
  (error) => {
    Promise.reject(error);
  }
);

// interceptors for handle any  response
axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Do something with response error
    if (error && error.response && error.response.status === 401) {
      const obj = JSON.parse(localStorage.getItem('session'));
      obj.token = '';
      localStorage.setItem('session', JSON.stringify(obj));
    }
    return Promise.reject(error);
  }
);

export const HttpServices = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
