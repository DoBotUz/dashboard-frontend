import axios from '@/axios';

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
  SET_BRANCHES(state, payload) {
    state.branches = payload.branches.map(branch => ({
      ...branch,
      timetable: JSON.parse(branch.timetable)
    }));
  },
  ADD_BRANCH(state, payload) {
    state.branches.push({
      ...payload.branch,
      timetable: JSON.parse(payload.branch.timetable)
    });
  },
  UPDATE_BRANCH(state, payload) {
    state.branches = state.branches.map(branch => {
      if (branch.id === payload.branch.id) {
        return {
          ...payload.branch,
          timetable: JSON.parse(payload.branch.timetable)
        };
      }
      return branch;
    });
  },
  DELETE_BRANCH(state, payload) {
    state.branches = state.branches.filter(branch => branch.id !== payload.id);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
}

export const actions = {
  fetchBranches({ commit, rootState }) {
    commit('SET_LOADING', true);
    return axios.get(`${rootState.organization}/branches/`)
      .then(res => {
        commit('SET_BRANCHES', {
          branches: res.data.data
        });
        return res.data;
      })
      .finally(() => {
        commit('SET_LOADING', false);
      })
  },
  addBranch({ commit, rootState }, payload) {
    commit('SET_LOADING', true);
    return axios.post(`${rootState.organization}/branches`, {
      ...payload,
    }).then(res => {
      commit('ADD_BRANCH', {
        branch: res.data.data
      });
    }).finally(() => {
      commit('SET_LOADING', false);
    })
  },
  updateBranch({ commit, rootState }, payload) {
    commit('SET_LOADING', true);
    const { id, } = payload;
    return axios.patch(`${rootState.organization}/branches/${id}`, payload).then(res => {
      commit('UPDATE_BRANCH', {
        branch: res.data.data
      });
    }).finally(() => {
      commit('SET_LOADING', false);
    })
  },
  deleteBranch({ commit, rootState }, payload) {
    commit('SET_LOADING', true);
    const { id } = payload;
    return axios.patch(`${rootState.organization}/branches/${id}`, {
      status: 0
    })
      .then(res => {
        commit('DELETE_BRANCH', {
          id: id
        });
      }).finally(() => {
        commit('SET_LOADING', false);
      })
  },
}

export const namespaced = true
