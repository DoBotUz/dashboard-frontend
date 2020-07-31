/* eslint-disable no-unused-vars */
import axios from '@/axios';

export const state = {
  organizations: {}
}

export const getters = {
  organizations: (state) => state.organizations,
}

export const mutations = {

}

export const actions = {
  fetchOrganizations() {
    return axios.get('/organizations')
      .then(res => {
        console.log(res.data);
      });
  },
  addOrganization(_, payload) {
    const { name: title, description, token } = payload;
    return axios.post('/organizations', {
      ru_title: name,
      ru_description: description,
      bot: {
        token: token
      }
    }).then(res => {
      console.log(res.data);
    })
  }
}

export const namespaced = true;
