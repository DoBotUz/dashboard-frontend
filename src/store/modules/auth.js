import axios from '@/axios';
import api from '@/api/auth';

export const state = {
  token: localStorage.getItem('access_token') || null,
}

export const getters = {
  token(state) {
    return state.token;
  },
  isAuthenticated(state) {
    return !!state.token;
  }
}

export const mutations = {
  SET_TOKEN(state, payload) {
    const { access_token } = payload;
    state.token = access_token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    localStorage.setItem('access_token', access_token);
  },
  LOGOUT(state) {
    localStorage.removeItem('access_token');
    state.token = null;
    axios.defaults.headers.common['Authorization'] = null;
  }
}

export const actions = {
  setAuthHeaders({ getters, state }) {
    if (getters.isAuthenticated) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    }
  },

  login({ commit, dispatch}, payload) {
    const { email, password } = payload;
    return axios.post('/auth/login', { email, password })
      .then(res => {
        commit('SET_TOKEN', res.data.data);
        dispatch('getUserInfo');
      });
  },

  signUp({ commit }, payload) {
    const { first_name, last_name, email, password } = payload;
    return axios.post('/auth/signup', { first_name, last_name, email, password })
      .then(res => {
        return res.data.data;
      });
  },

  logout({ commit }) {
    return Promise.resolve(commit('LOGOUT'));
  },

  getUserInfo({ dispatch, getters }) {
    if (!getters.isAuthenticated) {
      return;
    }
    return new Promise((resolve, reject) => {
      api()
        .userInfo()
        .then(({ data }) => {
          if (data.status === 'Success') {
            dispatch('setNotifications', data.data.notifications);
            dispatch('updateUserInfo', data.data, {root: true});
            resolve(data);
          } else {
            dispatch('logout').then(() => { this.$router.push('/pages/login'); });
            reject(data);
          }
        })
        .catch((err) => {
          dispatch('logout').then(() => { this.$router.push('/pages/login'); });
        });
    });
  },

  activateAccount({ commit }, token) {
    return new Promise((resolve, reject) => {
      api()
        .activateByToken(token)
        .then(({ data }) => {
          if (data.status === 'Success' && data.data) {
            commit('SET_TOKEN', data.data);
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  },
}
