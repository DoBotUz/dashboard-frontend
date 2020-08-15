export const KEYS = {
  NEW_ORDER: 1,
  NEW_FEEDBACK: 2,
  NEW_MESSAGE: 3,
  NEW_BOT_USER: 4,
};

export const TYPES = {
  INFO: 1,
  WARNING: 2,
};

export const state = {
  notifications: [],
}

export const getters = {
  notifications: (state) => state.notifications,
  feedbackNotificationsCount: (state) => state.notifications.filter(n => n.key === KEYS.NEW_FEEDBACK).length,
  orderNotificationsCount: (state) => state.notifications.filter(n => n.key === KEYS.NEW_ORDER).length,
}

export const mutations = {
  SET_NOTIFICATIONS(state, notifications) {
    state.notifications = notifications;
  },
  ADD_NOTIFICATIONS(state, notifications) {
    state.notifications.unshift(notifications);
  }
}

export const actions = {
  setNotifications({commit}, notifications) {
    commit('SET_NOTIFICATIONS', notifications);
  },
  handleNewNotification({commit}, notification) {
    commit('ADD_NOTIFICATIONS', JSON.parse(notification));
  }
}

export const namespaced = false;
