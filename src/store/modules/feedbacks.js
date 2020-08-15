import api from '@/api/feedbacks';

export const state = {
  loading: false,
  feedbacks: [],
  feedback_types: {
    1: 'text',
    2: 'photo',
    3: 'video',
    4: 'audio',
    5: 'voice'
  },
}

export const getters = {
  feedbacks: (state) => state.feedbacks,
  feedback_types: (state) => state.feedback_types,
}

export const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SET_FEEDBACKS(state, feedbacks) {
    state.feedbacks = feedbacks;
  },
}

export const actions = {
  fetchFeedbacks({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .list(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_FEEDBACKS', data.data);
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

export const namespaced = true;
