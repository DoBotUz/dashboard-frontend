import axios from '@/axios';

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
  login({ commit }, payload) {
    const { email, password } = payload;
    return axios.post('/auth/login', { email, password })
      .then(res => {
        console.log(res.data);
        commit('SET_TOKEN', res.data.data);
      });
  },
  signUp({ commit }, payload) {
    const { first_name, last_name, email, password } = payload;
    return axios.post('/auth/signup', { first_name, last_name, email, password })
      .then(res => {
        return res.data.data;
      });
  },
  logout({ commit }, payload) {
    commit('LOGOUT');
  }
}