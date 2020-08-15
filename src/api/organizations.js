import axios from '@/api';

export default () => ({
  list: () => axios.get('/organizations/'),
  get: (organizationId) => axios.get(`/organizations/${organizationId}`),
  create: (payload) => axios.post('/organizations/', payload),
  update: (payload) => axios.post('/organizations/update', payload),
});
