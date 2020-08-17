import axios from '@/api';

export default () => ({
  categories: (organizationId) => axios.get(`/${organizationId}/categories`),
  createCategory: (organizationId, payload) => axios.post(`/${organizationId}/categories/`, payload),
  updateCategory: (organizationId, payload) => axios.post(`/${organizationId}/categories/update`, payload),
  items: (organizationId) => axios.get(`/${organizationId}/items/`),
  createItem: (organizationId, payload) => axios.post(`/${organizationId}/items`, payload),
  updateItem: (organizationId, payload) => axios.post(`/${organizationId}/items/update`, payload),
  updateCategoryStatus: (organizationId, payload) => axios.post(`/${organizationId}/categories/status`, payload),
  updateItemStatus: (organizationId, payload) => axios.post(`/${organizationId}/items/status`, payload),
});
