import axios from '@/api';

export default () => ({
  list: () => axios.get('/organizations/'),
  create: (payload) => axios.post('/organizations/', payload),
  update: (payload) => axios.post('/organizations/update', payload),
});
