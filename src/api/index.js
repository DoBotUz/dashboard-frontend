/* eslint-disable no-param-reassign */
import axios from '../axios';
export const TOKEN = 'access_token';

const noCrudUrls = ['auth/login'];

axios.interceptors.response.use(response => {
  if (response.data.status === 'Fail') {
    global.vm.$vs.notify({
      title: 'Неверный ввод',
      color: 'warning',
      iconPack: 'feather',
      icon: 'icon-alert-circle',
    });
  } else if (response.data.status === 'Error') {
    global.vm.$vs.notify({
      title: 'Ошибка',
      color: 'error',
      iconPack: 'feather',
      icon: 'icon-alert-circle',
    });
  } else if (response.data.status === 'Success') {
    if (response.config.method === 'post' && !noCrudUrls.includes(response.config.url)) {
      // global.vm.$vs.notify({
      //   title: 'Успех',
      //   color: 'success',
      //   iconPack: 'feather',
      //   icon: 'icon-alert-circle',
      // });
    }
  }
  if (!response) return { data: {} };
  return response;
});

export default axios;
