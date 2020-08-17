import axios from '@/axios';
import api from '@/api/menu';

export const state = {
  categories: [],
  products: [],
  loading: false,
  statuses: {
    11: 'Не активен',
    10: 'Активен',
    9: 'На модерации',
  },
}

export const getters = {
  categories: (state) => state.categories,
  categoriesByParentId: (state) => (parent) => {
    if (!parent) {
      return state.categories.filter(cat => !cat.parentCategoryId);
    }
    return state.categories.filter(cat => cat.parentCategoryId === parent);
  },
  childlessCategories: state => {
    let childlessCategories = state.categories;
    state.categories.forEach(category => {
      if (category.parentCategoryId) {
        childlessCategories = childlessCategories.filter(cat => cat.id !== category.parentCategoryId);
      }
    });
    return childlessCategories;
  },
  productsByParentId: (state) => (parent) => {
    return state.products.filter(prod => Number(prod.categoryId) === parent)
  },
  statuses: (state) => state.statuses,
  products: (state) => state.products,
  loading: (state) => state.loading,
}

export const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading;
  },

  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },

  ADD_CATEGORY(state, category) {
    state.categories.push(category);
  },

  UPDATE_CATEGORY(state, category) {
    state.categories = state.categories.map(el => {
      if (el.id === category.id) {
        return category;
      }
      return el;
    });
  },

  DELETE_CATEGORY(state, category_id) {
    state.categories = state.categories.filter(el => el.id !== category_id);
  },

  SET_PRODUCTS(state, products) {
    state.products = products;
  },

  ADD_PRODUCT(state, product) {
    state.products.push(product);
  },

  UPDATE_PRODUCT(state, product) {
    state.products = state.products.map(el => {
      if (el.id === product.id) {
        return product;
      }
      return el;
    });
  },

  DELETE_PRODUCT(state, product_id) {
    state.products = state.products.filter(el => el.id !== product_id);
  },
}


export const actions = {
  fetchCategories({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .categories(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_CATEGORIES', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  createCategory({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .createCategory(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_CATEGORY', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  updateCategory({ commit, rootState }, payload) {
    let id = payload.id || payload.get('id');
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .updateCategory(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('UPDATE_CATEGORY', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  deleteCategory({ commit, rootState }, payload) {
    let id = payload.id || payload.get('id');
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .updateCategoryStatus(rootState.organization.id, {
          id: id,
          status: 0
        })
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('DELETE_CATEGORY', payload.id);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  fetchProducts({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .items(rootState.organization.id)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('SET_PRODUCTS', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  createProduct({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .createItem(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('ADD_PRODUCT', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  updateProduct({ commit, rootState }, payload) {
    let id = payload.id || payload.get('id');
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .updateItem(rootState.organization.id, payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('UPDATE_PRODUCT', data.data);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },

  deleteProduct({ commit, rootState }, payload) {
    let id = payload.id || payload.get('id');
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', true)
      api()
        .updateItemStatus(rootState.organization.id, {
          id: id,
          status: 0
        })
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('DELETE_PRODUCT', id);
            resolve(data);
          } else {
            reject(data);
          }
        })
        .catch(reject)
        .finally(() => commit('SET_LOADING', false));
    });
  },
}

export const namespaced = true;
