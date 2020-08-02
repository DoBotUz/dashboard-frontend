/* eslint-disable no-param-reassign */
import axios from 'axios';
import { notify } from 'vuesax';
export const TOKEN = 'access_token';

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

const noCrudUrls = ['auth/login'];

http.interceptors.request.use((config) => {
  if (localStorage.getItem(TOKEN)) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(TOKEN)}`;
  }

  if (config.method === 'get' && config.params) {
    const params = {};
    Object.keys(config.params).forEach((key) => {
      if (config.params[key]) params[key] = config.params[key];
    });
    config.params = params;
  }

  return config;
});

http.interceptors.response.use(response => {
  if (response.data.status === 'Fail') {
    notify({
      title: 'Неверный ввод',
      color: 'warning',
      iconPack: 'feather',
      icon: 'icon-alert-circle',
    });
  } else if (response.data.status === 'Error') {
    notify({
      title: 'Ошибка',
      color: 'error',
      iconPack: 'feather',
      icon: 'icon-alert-circle',
    });
  } else if (response.data.status === 'Success') {
    if (response.config.method === 'post' && !noCrudUrls.includes(response.config.url)) {
      notify({
        title: 'Успех',
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
      });
    }
  }
  if (!response) return { data: {} };
  return response;
}, (response) => {
  if (response && response.message === 'Request failed with status code 401') {
    localStorage.removeItem(TOKEN);
    window.location.href = '/signin';
  } else {
    return { data: 'Network Error' };
  }
});

export default http;
