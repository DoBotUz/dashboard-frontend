import api from '@/api/botUsers';

export const state = {
  botUsers: [],
}

export const getters = {
  botUsers: (state) => state.botUsers,
}

export const mutations = {
  SET_BOT_USERS(state, botUsers) {
    state.botUsers = botUsers;
  },
  UPDATE_BOT_USER(state, botUser) {
    state.botUsers = state.botUsers.map(el => {
      if (el.id === botUser.id) {
        return {
          ...botUser,
          timetable: JSON.parse(botUser.timetable)
        };
      }
      return el;
    });
  },
}

export const actions = {
  fetchBotUsers({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      api()
        .list(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            console.log(data);
            commit('SET_BOT_USERS', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject);
    });
  },
  banBotUser({ commit }, botUserId) {
    return new Promise((resolve, reject) => {
      api()
        .ban(botUserId)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('UPDATE_BOT_USER', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
    });
  }
}

export const namespaced = true
