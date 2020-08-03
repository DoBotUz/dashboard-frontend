import axios from '@/axios';
import api from '@/api/organizations';

export const state = {
  organizations: [],
  loading: false,
  organizationObj: {},
}

export const getters = {
  organizations: (state) => state.organizations,
}

export const mutations = {
  ADD_ORGANIZATION(state, payload) {
    state.organizations.push(payload.organization);
  },
  SET_ORGANIZATIONS(state, organizations) {
    state.organizations = organizations;
  },
  UPDATE_ORGANIZATION(state, organization) {
    state.organizations = state.organizations.map(org => org.id === organization.id ? organization : org);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ORGANIZATION(state, org) {
    state.organizationObj = org;
  },
}

export const actions = {
  getOrganization({ commit }, organization_id) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .get(organization_id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORGANIZATION', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  fetchOrganizations({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .list()
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORGANIZATIONS', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  addOrganization({ commit }, payload) {
    const { name, description, token } = payload;
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .create({
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
        })
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_ORGANIZATION', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  updateOrganization({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .update(payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('UPDATE_ORGANIZATION', data.data);
            resolve(data);
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
