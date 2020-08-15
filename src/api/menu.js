import axios from '@/api';

export default () => ({
  categories: (organizationId) => axios.get(`${organizationId}/categories`),
  createCategory: (organizationId, payload) => axios.post(`${organizationId}/categories/`, payload),
  updateCategory: (organizationId, id, payload) => axios.patch(`${organizationId}/categories/${id}`, payload),
  categoryDeactivate: (id) => axios.post(`${organizationId}/categories/${id}/deactivate`),
  items: (organizationId) => axios.get(`${organizationId}/items/`),
  createItem: (organizationId, payload) => axios.post(`${organizationId}/items`, payload),
  updateItem: (organizationId, id, payload) => axios.patch(`${organizationId}/items/${id}`, payload),
  itemDeactivate: (id) => axios.post(`/items/deactivate/${id}`),
});
