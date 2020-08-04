import axios from '@/api';

export default () => ({
  orders: (organization) => axios.get(`/orders/${organization}/list`),
  order: (order_id) => axios.get(`/orders/${order_id}`),
  updateOrder: (payload) => axios.post(`orders/update`, payload)
})