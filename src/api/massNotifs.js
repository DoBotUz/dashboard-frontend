import axios from '@/api';

export default () => ({
  list: (organization) => axios.get(`/bot-notifications/${organization}/list`),
  create: (payload) => axios.post('/bot-notifications/mass-send', payload),
});
