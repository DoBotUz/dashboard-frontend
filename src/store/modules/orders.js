import api from '@/api/orders';

export const state = {
  loading: false,
  orders: [],
  order: {},
  order_statuses: {
    10: 'Принят',
    9: 'Новый',
    0: 'Отменен',
    12: 'Доставлен',
  },
  payment_types: {
    10: 'Наличные',
    0: 'Терминал'
  }
}

export const getters = {
  orders: (state) => state.orders,
  order_statuses: (state) => state.order_statuses,
  payment_types: (state) => state.payment_types,
  order: (state) => state.order,
  loading: (state) => state.loading,
}

export const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SET_ORDERS(state, orders) {
    state.orders = orders;
  },
  ADD_ORDER(state, order) {
    state.orders.push(order);
  },
  UPDATE_ORDER(state, order) {
    state.orders = state.orders.map(el => {
      if (el.id === order.id) {
        return order;
      }
      return el;
    });
  },

  SET_ORDER(state, order) {
    state.order = order;
  }
}

export const actions = {
  fetchCrudOrders({ rootState }, queryString) {
    return new Promise((resolve, reject) => {
      api().ordersByRequestBuilder(rootState.organization.id, queryString).then(({ data }) => {
        if (data.status === 'Success') {
          resolve(data.data);
        } else {
          reject(data);
        }
      })
      .catch(reject);
    });
  },

  fetchOrders({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .orders(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORDERS', data.data);
            resolve(data.data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  fetchOrder({ commit, rootState }, order_id) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .order(rootState.organization.id, order_id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORDER', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  updateOrder({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .updateOrder(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORDER', payload);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  }
}

export const namespaced = true
