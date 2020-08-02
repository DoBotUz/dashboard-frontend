import axios from '@/api';

export default () => ({
  categories: (organization) => axios.get(`/categories/${organization}/list`),
  createCategory: (payload) => axios.post('/categories/', payload),
  updateCategory: (payload) => axios.post('/categories/update', payload),
  categoryDeactivate: (id) => axios.post(`/categories/deactivate/${id}`),
  items: (organization) => axios.get(`/items/${organization}/list`),
  createItem: (payload) => axios.post('/items', payload),
  updateItem: (payload) => axios.post('/items/update', payload),
  itemDeactivate: (id) => axios.post(`/items/deactivate/${id}`),
});
