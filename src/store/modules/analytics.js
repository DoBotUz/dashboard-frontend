import api from '@/api/analytics';

export const state = {
  ordersData: {},
  botUsersData: {},
  categoryOrdersData: {},
  metaData: {
    bot_users_num: 0,
    orders_num: 0,
    feedbacks_num: 0,
  },
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
  },
  SET_META_DATA(state, data) {
    state.metaData = data;
  }
}

export const actions = {
  fetchForPeriod({ commit, rootState }, params) {
    return new Promise((resolve, reject) => {
      api()
        .period(rootState.organization.id, params)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORDERS_DATA', data.data.orders);
            commit('SET_BOT_USERS_DATA', data.data.bot_users);
            commit('SET_CATEGORY_ORDERS_DATA', data.data.category_orders);
            commit('SET_META_DATA', data.data.metaData);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  },
  fetchGeoOrders( { rootState }, params) {
    return new Promise((resolve, reject) => {
      api()
        .geoOrders(rootState.organization.id, params)
        .then(({ data }) => {
          if (data.status === 'Success') {
            resolve(data.data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  }
}

export const namespaced = true
