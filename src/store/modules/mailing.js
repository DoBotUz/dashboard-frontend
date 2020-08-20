import api from '@/api/mailing';
import router from '@/router';

const STATUSES = {
  DELETED: 0,
  DRAFTS: 10,
  SENT: 11,
  SENDING: 12,
};

const COLOR_STATUSES = {};
COLOR_STATUSES[STATUSES.DRAFTS] = 'danger';
COLOR_STATUSES[STATUSES.SENDING] = '#2196f3';
COLOR_STATUSES[STATUSES.SENT] = 'success';

const LABEL_STATUSES = {};
LABEL_STATUSES[STATUSES.DRAFTS] = 'Черновики';
LABEL_STATUSES[STATUSES.SENDING] = 'Отправляется';
LABEL_STATUSES[STATUSES.SENT] = 'Доставлено';

export const state = {
  loading: false,
  mailings: [],
  mailing_filter: null,
  mailingCats: [],
  meta: {},
  mailingSearchQuery: '',
  STATUSES,
  COLOR_STATUSES,
  LABEL_STATUSES,
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
  },
  getStatusColor: state => status => {
    for(let key in state.COLOR_STATUSES) {
      if(Number(key) === Number(status)) {
        return state.COLOR_STATUSES[key];
      }
    }
    return '';
  },
  getStatusLabel: state => status => {
    for(let key in state.LABEL_STATUSES) {
      if(Number(key) === Number(status)) {
        return state.LABEL_STATUSES[key];
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

  UPDATE_MAILING(state, mailing) {
    for(let index = 0;index<state.mailings.length; index++){
      if(Number(state.mailings[index].id) === Number(mailing.id)) {
        state.mailings[index] = Object.assign({}, mailing);
        break;
      }
    }
  },

  REMOVE_MAILING(state, id) {
    for(let index = 0;index<state.mailings.length; index++){
      if(Number(state.mailings[index].id) === Number(id)) {
        state.mailings.splice(index, 1);
        break;
      }
    }
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
            commit('SET_MAILINGS', []);
            setTimeout(() => {
              commit('SET_MAILINGS', data.data);
            }, 100)
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
            resolve(data.data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  saveToDrafts({ commit, rootState, state }, payload) {
    payload.set('status', state.STATUSES.DRAFTS);
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      if(payload.has('id') && payload.get('id')) {
        api()
        .updateDraft(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('UPDATE_MAILING', data.data);
            resolve(data.data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
      } else {
        api()
        .createDraft(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            if(router.currentRoute.params.filter === 'drafts')
              commit('ADD_MAILING', data.data);
            resolve(data.data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
      }

    });
  },

  deleteOne({ commit, rootState, state }, templateId) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
      .delete(rootState.organization.id, templateId)
      .then(({ data }) => {
        if (data.status === 'Success') {
          commit('REMOVE_MAILING', templateId);
          resolve(data.data);
        } else {
          reject(data);
        }
      })
      .catch(reject)
      .finally(() => commit('SET_LOADING', false));
    });
  },

  createNewAndSend({ commit, rootState, state }, payload) {
    payload.set('status', state.STATUSES.DRAFTS);
    payload.set('start', true);
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
      .createDraft(rootState.organization.id, payload)
      .then(({ data }) => {
        if (data.status === 'Success') {
          if(router.currentRoute.params.filter === 'sent')
            commit('ADD_MAILING', data.data);

          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(reject)
      .finally(() => commit('SET_LOADING', false));
    });
  },

  startDraft({ commit, rootState, state }, mailing) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
      .startOne(rootState.organization.id, rootState.organization.bot.id, mailing.id)
      .then(({ data }) => {
        if (data.status === 'Success') {
          commit('REMOVE_MAILING', mailing.id);
          resolve(data.data);
        } else {
          reject(data);
        }
      })
      .catch(reject)
      .finally(() => commit('SET_LOADING', false));
    });
  },

  duplicateToDrafts({ commit, rootState, state }, mailingId) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
      .duplicateOne(rootState.organization.id, mailingId)
      .then(({ data }) => {
        if (data.status === 'Success') {
          if(router.currentRoute.params.filter === 'drafts')
            commit('ADD_MAILING', data.data);

          resolve(data.data);
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
