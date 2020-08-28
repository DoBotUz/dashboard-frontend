export const state = {
  loading: false,
  users: [],
  user: {}
}

export const getters = {
  users: (state) => state.users,
  loading: (state) => state.loading,
}

export const mutations = {
  SET_USERS(state, payload) {
    state.users = payload;
  },
  ADD_USER(state, payload) {
    state.users.push(payload)
  },
}

export const actions = {
  fetchUsers({ commit, rootState }, payload) {

  },
  addUser({ commit, rootState }, payload) {

  },
}

export const namespaced = true;