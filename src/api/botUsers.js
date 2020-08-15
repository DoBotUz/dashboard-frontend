import axios from '@/api';

export default () => ({
  list: (organizationId) => axios.get(`${organizationId}/bot-users`),
  update: (payload) => axios.post('/bot-users/update', payload),
});
