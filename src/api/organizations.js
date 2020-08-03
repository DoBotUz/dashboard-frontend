import axios from '@/api';

export default () => ({
  list: () => axios.get('/organizations/'),
  get: (organization_id) => axios.get(`/organizations/${organization_id}`),
  create: (payload) => axios.post('/organizations/', payload),
  update: (payload) => axios.post('/organizations/update', payload),
});
