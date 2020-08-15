import axios from '@/api';

export default () => ({
  orders: (organizationId) => axios.get(`${organizationId}/orders/`),
  order: (organizationId, order_id) => axios.get(`${organizationId}/orders/${order_id}`),
  updateOrder: (organizationId, order_id, payload) => axios.patch(`${organizationId}/orders/${order_id}`, payload)
})
