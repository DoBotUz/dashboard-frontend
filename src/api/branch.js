import axios from '@/api';

export default () => ({
  list: (organizationId) => axios.get(`/${organizationId}/branches`),
  create: (organizationId, payload) => axios.post(`/${organizationId}/branches/`, payload),
  update: (organizationId, payload) => axios.post(`/${organizationId}/branches/update`, payload),
  updateBranchStatus: (organizationId, payload) => axios.post(`/${organizationId}/branches/status`, payload),
});
