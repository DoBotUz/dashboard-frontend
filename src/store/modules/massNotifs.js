import api from '@/api/massNotifs';

export const state = {
  massNotifs: [],
  form: {},
  addPopup: false,
}

export const getters = {
  massNotifs: (state) => state.massNotifs,
}

export const mutations = {
  SET_MASS_NOTIFS(state, massNotifs) {
    state.massNotifs = massNotifs;
  },

  SET_MASS_NOTIF_FORM(state, form) {
    state.form = form;
  },

  ADD_MASS_NOTIF(state, massNotif) {
    state.massNotifs.push(massNotif);
  },

  SET_ADD_POPUP(state, st) {
    state.addPopup = st;
  },
}

export const actions = {
  fetchMassNotifs({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      api()
        .list(rootState.organization)
        .then(({ data }) => {
          if (data.status === 'Success') {
            console.log(data);
            commit('SET_MASS_NOTIFS', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  },
  createMassSend({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api()
        .create(payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_MASS_NOTIF', data.data);
            dispatch('resetFormFields');
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  },
  resetFormFields({ commit }) {
    commit('SET_MASS_NOTIF_FORM', {});
  },
}

export const namespaced = true
