import api from '@/api/promocodes';

export const state = {
  loading: false,
  promocode: {},
  promocode_statuses: {
    10: 'Действует',
    11: 'Не действует',
  },
  promocode_types: {
    10: 'Скидка в %',
    11: 'Скидка на сумму',
    12: 'Бесплатная доставка',
    13: 'Бесплатные продукты',
    14: 'Другое'
  }
}


export const getters = {
  promocode_statuses: (state) => state.promocode_statuses,
  promocode_types: (state) => state.promocode_types,
  promocode: (state) => state.promocode,
  loading: (state) => state.loading,
  statusOptions: (state) => {
    let out = [];
    for(let key in state.promocode_statuses){
      out.push({
        value: key,
        label: state.promocode_statuses[key]
      })
    }
    return out;
  },
  typeOptions: (state) => {
    let out = [];
    for(let key in state.promocode_types){
      out.push({
        value: key,
        label: state.promocode_types[key]
      })
    }
    return out;
  },
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
  fetchCrudPromocodes({ rootState }, queryString) {
    return new Promise((resolve, reject) => {
      api().getManybyRequestBuilder(rootState.organization.id, queryString).then(({ data }) => {
        if (data.status === 'Success') {
          resolve(data.data);
        } else {
          reject(data);
        }
      })
      .catch(reject);
    });
  },

  fetchPromocode({ commit, rootState }, order_id) {
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

  updatePromocode({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .updateOne(rootState.organization.id, payload)
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
