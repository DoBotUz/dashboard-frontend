import api from '@/api/analytics';

export const state = {
  ordersData: {},
  botUsersData: {},
  categoryOrdersData: {},
}

export const getters = {

}

export const mutations = {
  SET_ORDERS_DATA(state, data) {
    state.ordersData = data;
  },
  SET_BOT_USERS_DATA(state, data) {
    state.botUsersData = data;
  },
  SET_CATEGORY_ORDERS_DATA(state, data){
    state.categoryOrdersData = data;
  }
}

export const actions = {
  fetchOrdersData({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      api()
        .ordersMonthly(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORDERS_DATA', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  },
  fetchBotUsersData({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      api()
        .botUsersMonthly(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_BOT_USERS_DATA', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  },
  fetchCategoryOrdersData({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      api()
        .categoryOrders(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_CATEGORY_ORDERS_DATA', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  },
  fetchForPeriod({ commit, rootState }, params) {
    return new Promise((resolve, reject) => {
      api()
        .period(rootState.organization.id, params)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORDERS_DATA', data.data.orders);
            commit('SET_BOT_USERS_DATA', data.data.bot_users);
            commit('SET_CATEGORY_ORDERS_DATA', data.data.category_orders);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  },
}

export const namespaced = true
