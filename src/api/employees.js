import axios from '@/api';

export default () => ({
  list: (organizationId) => axios.get(`/${organizationId}/users`),
  create: (organizationId, payload) => axios.post(`/${organizationId}/users/`, payload),
  update: (organizationId, payload) => axios.post(`/${organizationId}/users/update`, payload),
});
