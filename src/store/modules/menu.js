import axios from '@/axios';
import api from '@/api/menu';

export const state = {
  categories: [],
  products: [],
  loading: false,
  statuses: {
    10: 'Активен',
    9: 'На модерации',
    0: 'Выключен',
  },
}

export const getters = {
  categories: (state) => state.categories,
  categoriesByParentId: (state) => (parent) => {
    if (!parent) {
      return state.categories.filter(cat => !cat.parent_category_id);
    }
    return state.categories.filter(cat => cat.parent_category_id === parent);
  },
  childlessCategories: state => {
    let childlessCategories = state.categories;
    state.categories.forEach(category => {
      if (category.parent_category_id) {
        childlessCategories = childlessCategories.filter(cat => cat.id !== category.parent_category_id);
      }
    });
    return childlessCategories;
  },
  productsByParentId: (state) => (parent) => {
    return state.products.filter(prod => Number(prod.category_id) === parent)
  },
  statuses: (state) => state.statuses,
  products: (state) => state.products,
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
      commit('SET_LOADING', false)
      api()
        .categories(rootState.organization)
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
    payload.append('bot_id', rootState.organization);
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .createCategory(payload)
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
    payload.append('bot_id', rootState.organization);
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .updateCategory(payload)
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

  deleteCategory({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .deactivateCategory(payload.id)
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
      commit('SET_LOADING', false)
      api()
        .items(rootState.organization)
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

  createProduct({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .createItem(payload)
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
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .updateItem(payload)
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

  deleteProduct({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_LOADING', false)
      api()
        .deactivateItem(payload)
        .then(({ data }) => {
          if (data.status === 'Success') {
            commit('DELETE_PRODUCT', payload.id);
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
