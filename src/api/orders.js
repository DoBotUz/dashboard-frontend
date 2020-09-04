import axios from '@/api';

export default () => ({
  orders: (organizationId) => axios.get(`${organizationId}/orders/`),
  order: (organizationId, order_id) => axios.get(`${organizationId}/orders/${order_id}`),
  updateOrder: (organizationId, payload) => axios.post(`${organizationId}/orders/update`, payload),
  ordersByRequestBuilder: (organizationId, queryString) => axios.get(`${organizationId}/orders?${queryString}`),
})
