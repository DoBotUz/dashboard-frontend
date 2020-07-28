import axios from '@/axios';

export const state = {
  organizations: []
}

export const getters = {
  organizations: (state) => state.organizations,
}

export const mutations = {
  ADD_ORGANIZATION(state, payload) {
    state.organizations.push(payload.organization);
  },
  SET_ORGANIZATIONS(state, payload) {
    state.organizations = payload.organizations;
  }
}

export const actions = {
  fetchOrganizations({ commit }) {
    return axios.get('/organizations')
      .then(res => {
        commit('SET_ORGANIZATIONS', {
          organizations: res.data.data
        });
      });
  },
  addOrganization({ commit }, payload) {
    const { name, description, token } = payload;
    return axios.post('/organizations', {
      ru_title: name,
      ru_description: description,
      en_title: name,
      en_description: description,
      uz_title: name,
      uz_description: description,
      bot: {
        token: token
      },
      fixed_delivery_price: true,
    }).then(res => {
      commit('ADD_ORGANIZATION', {
        organization: res.data.data,
      });
    });
  }
}

export const namespaced = true;