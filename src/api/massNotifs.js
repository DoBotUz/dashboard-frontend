import axios from '@/api';

export default () => ({
  list: (organizationId) => axios.get(`/bot-notifications/${organizationId}/list`),
  create: (payload) => axios.post('/bot-notifications/mass-send', payload),
});
