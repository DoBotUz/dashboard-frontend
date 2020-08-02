/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import App from './App.vue'

// Vuesax Component Framework
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css' //Material Icons
import 'vuesax/dist/vuesax.css'; // Vuesax
Vue.use(Vuesax)


// axios
import axios from "./axios.js"
Vue.prototype.$http = axios


// Head managing plugin
import VueHead from 'vue-head'
Vue.use(VueHead, {
  inner: 'DoBot',
  complement: 'DoBot'
})
// Theme Configurations
import '../themeConfig.js'


// Globally Registered Components
import './globalComponents.js'


// Styles: SCSS
import './assets/scss/main.scss'


// Tailwind
import '@/assets/css/main.css'


// Vue Router
import router from './router'


// Vuex Store
import store from './store/store'


// Vuejs - Vue wrapper for hammerjs
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)


// PrismJS
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'


// Feather font icon
require('./assets/css/iconfont.css')

// acl
import acl from './acl'

// filters
import  './filters';

// VeeValidate
import VeeValidate from 'vee-validate'
import ruValidationMessages from 'vee-validate/dist/locale/ru'
Vue.use(VeeValidate, {
  locale: 'ru',
  dictionary: {
    ru: ruValidationMessages
  }
})

// i18n
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'ru',
});

// Vue select css
// Note: In latest version you have to add it separately
// import 'vue-select/dist/vue-select.css';

Vue.prototype.$url = process.env.VUE_APP_BASE_URL;
Vue.config.productionTip = false

global.vm = new Vue({
    router,
    store,
    acl,
    i18n,
    render: h => h(App)
}).$mount('#app')
