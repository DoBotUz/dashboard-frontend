/*=========================================================================================
  File Name: actions.js
  Description: Vuex Store - actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
import organizationsApi from '@/api/organizations';
import profileApi from '@/api/profile';

const actions = {

    // /////////////////////////////////////////////
    // COMPONENTS
    // /////////////////////////////////////////////

    // Vertical NavMenu
    updateVerticalNavMenuWidth({ commit }, width) {
      commit('UPDATE_VERTICAL_NAV_MENU_WIDTH', width)
    },

    // VxAutoSuggest
    updateStarredPage({ commit }, payload) {
      commit('UPDATE_STARRED_PAGE', payload)
    },

    // The Navbar
    arrangeStarredPagesLimited({ commit }, list) {
      commit('ARRANGE_STARRED_PAGES_LIMITED', list)
    },
    arrangeStarredPagesMore({ commit }, list) {
      commit('ARRANGE_STARRED_PAGES_MORE', list)
    },

    // /////////////////////////////////////////////
    // UI
    // /////////////////////////////////////////////

    toggleContentOverlay({ commit }) {
      commit('TOGGLE_CONTENT_OVERLAY')
    },
    updateTheme({ commit }, val) {
      commit('UPDATE_THEME', val)
    },

    // /////////////////////////////////////////////
    // User/Account
    // /////////////////////////////////////////////

    updateUserInfo({ commit }, payload) {
      commit('UPDATE_USER_INFO', payload)
    },

    fetchOrganization({ commit }, organizationId) {
      return new Promise((resolve, reject) => {
        organizationsApi()
        .get(organizationId)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_ORGANIZATION', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
      });
    },

    deleteAvatar({ commit }) {
      return new Promise((resolve, reject) => {
        profileApi()
        .deleteAvatar()
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('UPDATE_USER_INFO', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
      });
    },

    updateProfile({ commit }, payload) {
      return new Promise((resolve, reject) => {
        profileApi()
        .update(payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('UPDATE_USER_INFO', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
      });
    }
}

export default actions
