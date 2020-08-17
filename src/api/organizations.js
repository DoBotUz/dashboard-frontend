import axios from '@/api';

export default () => ({
  list: () => axios.get('/organizations/'),
  get: (id) => axios.get(`/organizations/${id}`),
  create: (payload) => axios.post('/organizations/', payload),
  update: (payload) => axios.post('/organizations/update', payload),
  delete: (id) => axios.delete(`/organizations/${id}`),
});
