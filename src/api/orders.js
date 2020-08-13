import axios from '@/api';

export default () => ({
  orders: (organization) => axios.get(`${organization}/orders/`),
  order: (organization, order_id) => axios.get(`${organization}/orders/${order_id}`),
  updateOrder: (organization, order_id, payload) => axios.patch(`${organization}/orders/${order_id}`, payload)
})