import axios from '@/api';

export default () => ({
  getMany: (organizationId) => axios.get(`${organizationId}/promocodes/`),
  getOne: (organizationId, promocode_id) => axios.get(`${organizationId}/promocodes/${promocode_id}`),
  updateOne: (organizationId, payload) => axios.post(`${organizationId}/orders/update`, payload),
  getManybyRequestBuilder: (organizationId, queryString) => axios.get(`${organizationId}/promocodes?${queryString}`),
})
