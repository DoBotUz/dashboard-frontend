import axios from '@/api';

export default () => ({
  list: (organization) => axios.get(`/bot-users/${organization}/list`),
  update: (payload) => axios.post('/bot-users/update', payload),
});
