import axios from '@/api';

export default () => ({
  period: (organizationId, params) => axios.get(`${organizationId}/analytics/period-info`, { params }),
  geoOrders: (organizationId, params) => axios.get(`${organizationId}/analytics/orders-geo`, { params }),
});
