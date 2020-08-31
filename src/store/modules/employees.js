import api from '@/api/employees';

export const state = {
  loading: false,
  employees: [],
  employee: {}
}

export const getters = {
  employees: (state) => state.employees,
  loading: (state) => state.loading,
}

export const mutations = {
  SET_EMPLOYEES(state, payload) {
    state.employees = payload;
  },
  ADD_EMPLOYEE(state, payload) {
    state.employees.push(payload)
  },
  SET_LOADING(state, flag) {
    state.loading = flag;
  }
}

export const actions = {
  fetchEmployees({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .list(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_EMPLOYEES', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  createEmployee({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .create(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_EMPLOYEE', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  updateEmployee({ commit, rootState }, payload) { // todo
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .create(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_EMPLOYEE', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
}

export const namespaced = true;