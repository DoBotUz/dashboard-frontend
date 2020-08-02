/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Vuex from 'vuex'

import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

Vue.use(Vuex)

// modules
import * as moduleAuth from './modules/auth';
import * as moduleOrganizations from './modules/organizations';
import * as moduleBranches from './modules/branches';
import * as moduleMenu from './modules/menu';
import * as moduleBotUsers from './modules/botUsers';

export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    strict: process.env.NODE_ENV !== 'production',
    modules: {
      auth: moduleAuth,
      organizations: moduleOrganizations,
      branches: moduleBranches,
      menu: moduleMenu,
      botUsers: moduleBotUsers
    },
})
