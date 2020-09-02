import axios from '@/api';

export default () => ({
  ordersMonthly: (organizationId) => axios.get(`${organizationId}/analytics/orders-info-monthly`),
  botUsersMonthly: (organizationId) => axios.get(`${organizationId}/analytics/bot-users-info-monthly`),
  categoryOrders: (organizationId) => axios.get(`${organizationId}/analytics/orders-info-categories`),
  period: (organizationId, params) => axios.get(`${organizationId}/analytics/period-info`, { params }),
  geoOrders: (organizationId, params) => axios.get(`${organizationId}/analytics/geo-orders`, { params }),
});
