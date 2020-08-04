import axios from '@/api';

export default () => ({
  orders: (organization) => axios.get(`/orders/${organization}/list`),
})