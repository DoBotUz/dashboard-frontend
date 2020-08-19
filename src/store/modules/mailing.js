import api from '@/api/mailing';

export const state = {
  loading: false,
  mailings: [],
  mailing_filter: null,
  mailingCats: [],
  meta: {},
  mailingSearchQuery: '',
  STATUSES: {
    DELETED: 0,
    DRAFTS: 10,
    SENT: 11,
    SENDING: 12,
  },
  currentMailing: {},
}

export const getters = {
  getStatusValue: state => str => {
    for(let key in state.STATUSES) {
      if(key.toLocaleLowerCase() === str.toLocaleLowerCase()) {
        return state.STATUSES[key];
      }
    }
    return '';
  }
}

export const mutations = {
  SET_LOADING(state, flag) {
    state.loading = flag;
  },

  SET_MAILINGS (state, mailings) {
    state.mailings = mailings
  },

  SET_CATS (state, cats) {
    state.mailingCats = cats
  },

  SET_META (state, meta) {
    state.meta = meta
  },

  SET_MAILING_SEARCH_QUERY(state, query) {
    state.mailingSearchQuery = query;
  },

  UPDATE_MAILING_FILTER(state, filter) {
    state.mailing_filter = filter;
  },

  ADD_MAILING(state, mailing) {
    state.mailings.unshift(mailing);
  },

  SET_CURRENT_MAILING(state, mailing) {
    state.currentMailing = mailing;
  }
}

export const actions = {
  setMailingSearchQuery({ commit }, query) {
    commit('SET_MAILING_SEARCH_QUERY', query)
  },

  getMailing({ commit, rootState }, mailing_id) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .fetchOne(rootState.organization.id, mailing_id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_CURRENT_MAILING', data.data);
            resolve(data.data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  fetchMailings({ commit, rootState }, params) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .fetch(rootState.organization.id, params)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_MAILINGS', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  fetchMailingCats({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .fetchCats(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_CATS', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  saveToDrafts({ commit, rootState, state }, payload) {
    payload.append('status', state.STATUSES.DRAFTS);
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      if(payload.id) {
        api()
        .updateDraft(rootState.organization.bot.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_MAILING', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
      } else {
        api()
        .createDraft(rootState.organization.bot.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_MAILING', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
      }

    });
  },
}

export const namespaced = true;
