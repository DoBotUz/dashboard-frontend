import axios from '@/api';

export default () => ({
  list: (organizationId) => axios.get(`/${organizationId}/chat/messages/chats`),
  messages: (organizationId, botUserId) => axios.get(`/${organizationId}/chat/messages/${botUserId}`),
  readMessages: (organizationId, botUserId) => axios.get(`/${organizationId}/chat/messages/read/${botUserId}`),
  sendMessage: (organizationId, body) => axios.post(`/${organizationId}/chat/messages`, body),
});
