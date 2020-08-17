import api from '@/api/branch';

export const state = {
  branches: [],
  statuses: {
    10: 'Активен',
    11: 'Неактивен',
  },
  loading: false
}

export const getters = {
  branches: (state) => state.branches,
  statuses: (state) => state.statuses,
  loading: (state) => state.loading,
}

export const mutations = {
  SET_BRANCHES(state, branches) {
    state.branches = branches.map(branch => ({
      ...branch,
      timetable: JSON.parse(branch.timetable)
    }));
  },
  ADD_BRANCH(state, branch) {
    state.branches.push({
      ...branch,
      timetable: JSON.parse(branch.timetable)
    });
  },
  UPDATE_BRANCH(state, branch) {
    state.branches = state.branches.map(el => {
      if (el.id === branch.id) {
        return {
          ...branch,
          timetable: JSON.parse(branch.timetable)
        };
      }
      return el;
    });
  },
  DELETE_BRANCH(state, branch) {
    state.branches = state.branches.filter(el => el.id !== branch.id);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
}

export const actions = {
  fetchBranches({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .list(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_BRANCHES', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  addBranch({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .create(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_BRANCH', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  updateBranch({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .update(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('UPDATE_BRANCH', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  deleteBranch({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .updateBranchStatus(rootState.organization.id, {
          id: payload.id,
          status: 0,
        })
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('DELETE_BRANCH', {
              id: payload.id
            });
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

export const namespaced = true
