import axios from '@/axios';

export const state = {
  branches: [],
  statuses: {
    10: 'Активен',
    11: 'Неактивен',
  }
}

export const getters = {
  branches: (state) => state.branches,
  statuses: (state) => state.statuses
}

export const mutations = {
  SET_BRANCHES(state, payload) {
    state.branches = payload.branches;
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
  }
}

export const actions = {
  fetchBranches({ commit, rootState }) {
    return axios.get(`/branches/${rootState.organization}/list`)
      .then(res => {
        commit('SET_BRANCHES', {
          branches: res.data.data
        });
        return res.data;
      });
  },
  addBranch({ commit, rootState }, payload) {
    return axios.post('/branches', {
      organization_id: rootState.organization,
      ...payload,
    }).then(res => {
      commit('ADD_BRANCH', {
        branch: res.data.data
      });
    })
  },
  updateBranch({ commit, rootState }, payload) {
    const { id, ...branch } = payload;
    return axios.post('/branches/update', {
      organization_id: rootState.organization,
      id,
      ...branch
    }).then(res => {
      commit('UPDATE_BRANCH', {
        branch: res.data.data
      });
    });
  },
  deleteBranch({ commit }, payload) {
    const { id } = payload;
    return axios.delete(`branches/${id}`)
      .then(res => {
        commit('DELETE_BRANCH', {
          id: id
        });
      });
  },
}

export const namespaced = true
