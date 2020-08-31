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
import * as moduleAnalytics from './modules/analytics';
import * as moduleBotUsers from './modules/botUsers';
import * as moduleMassNotifs from './modules/massNotifs';
import * as moduleOrders from './modules/orders';
import * as moduleFeedbacks from './modules/feedbacks';
import * as moduleNotifications from './modules/notifications';
import * as moduleMailing from './modules/mailing';
import * as moduleChat from './modules/chat';

export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    modules: {
      auth: moduleAuth,
      organizations: moduleOrganizations,
      branches: moduleBranches,
      menu: moduleMenu,
      analytics: moduleAnalytics,
      botUsers: moduleBotUsers,
      massNotifs: moduleMassNotifs,
      orders: moduleOrders,
      feedbacks: moduleFeedbacks,
      notifications: moduleNotifications,
      mailing: moduleMailing,
      chat: moduleChat,
    },
})
