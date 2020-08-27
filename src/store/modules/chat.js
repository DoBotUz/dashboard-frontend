import Vue from 'vue';
import api from '@/api/chat';

export const state = {
  chats: [],
  search: [],
  loading: false,
  messages: {},
}

export const getters = {
  chats: (state) => state.chats,
  chatUser: (state) => (userId) => state.chats.find(chat => chat.id == userId) || {},
  chatLastMessaged: (state) => (userId) => {
    const chat = state.chats.find(chat => chat.id == userId);
    return chat ? chat.lastMessage : {};
  },
  chatUnseenMessages: (state) => (userId) => {
    const chat = state.chats.find(chat => chat.id == userId);
    return chat ? chat.unreadCount : 0;
  },
  messages: (state) => (chatId) => {
    const msgs = state.messages[chatId];
    return msgs || [];
  },
}

export const mutations = {
  SET_LOADING(state, flag) {
    state.loading = flag;
  },
  SET_CHATS(state, payload) {
    state.chats = payload;
  },
  SET_MESSAGES(state, payload) {
    Vue.set(state.messages, payload.botUserId, payload.messages);
  },
  MARK_AS_READ(state, payload) {
    state.chats = state.chats.map(chat => {
      if (chat.id == payload.botUserId) {
        chat.unreadCount = 0;
      }
      return chat;
    });
  },
  ADD_NEW_MESSAGE(state, payload) {
    let messages = state.messages[payload.botUserId];
    messages.push(payload.message);
    Vue.set(state.messages, payload.botUserId, messages);
    state.chats = state.chats.map(chat => {
      if (chat.id == payload.botUserId) {
        return {
          ...chat,
          lastMessage: payload.message
        }
      }
      return chat;
    })
  }
}

export const actions = {
  fetchChats({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .list(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_CHATS', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  fetchMessages({ commit, rootState }, botUserId) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .messages(rootState.organization.id, botUserId)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_MESSAGES', {
              botUserId: botUserId,
              messages: data.data
            });
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  markSeenAllMessages({ commit, rootState }, botUserId) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .readMessages(rootState.organization.id, botUserId)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('MARK_AS_READ', { botUserId });
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  sendChatMessage({ commit, rootState }, payload) {
    let body = {
      operator: {
        id: rootState.AppActiveUser.id,
      },
      author: -1,
      is_read: true,
      ...payload,
    }
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .sendMessage(rootState.organization.id, body)
        .then(({ data }) => {
          if (data.status === 'Success') {
            console.log(data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
  addNewMessage({ commit, rootState }, payload) {
    commit('ADD_NEW_MESSAGE', payload);
  }
}

export const namespaced = true;