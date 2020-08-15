export const state = {
  notifications: []
}

export const getters = {
  notifications: (state) => state.notifications,
}

export const mutations = {
  SET_NOTIFICATIONS(notifications) {
    state.notifications = notifications;
  },
  ADD_NOTIFICATIONS(notifications) {
    state.notifications.push(notifications);
  }
}

export const actions = {
  
}

export const namespaced = false;