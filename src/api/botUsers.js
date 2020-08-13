import axios from '@/api';

export default () => ({
  list: (organization) => axios.get(`${organization}/bot-users`),
  update: (payload) => axios.post('/bot-users/update', payload),
});
