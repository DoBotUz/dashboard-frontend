import axios from '@/api';

export default () => ({
  categories: (organization) => axios.get(`${organization}/categories`),
  createCategory: (organization, payload) => axios.post(`${organization}/categories/`, payload),
  updateCategory: (organization, id, payload) => axios.post(`${organization}/categories/${id}`, payload),
  categoryDeactivate: (id) => axios.post(`${organization}/categories/${id}/deactivate`),
  items: (organization) => axios.get(`${organization}/items/`),
  createItem: (organization, payload) => axios.post(`${organization}/items`, payload),
  updateItem: (organization, id, payload) => axios.post(`${organization}/items/${id}`, payload),
  itemDeactivate: (id) => axios.post(`/items/deactivate/${id}`),
});
