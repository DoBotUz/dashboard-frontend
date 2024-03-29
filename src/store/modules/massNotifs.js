import api from '@/api/massNotifs';

export const state = {
  massNotifs: [],
  addPopup: false,
}

export const getters = {
  massNotifs: (state) => state.massNotifs,
}

export const mutations = {
  SET_MASS_NOTIFS(state, massNotifs) {
    state.massNotifs = massNotifs;
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
        .list(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
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
  }
}

export const namespaced = true
