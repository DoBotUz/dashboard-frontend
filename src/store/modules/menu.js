import axios from '@/axios';

export const state = {
  categories: [],
  products: [],
  statuses: {
    10: 'Активен',
    9: 'На модерации',
    0: 'Выключен',
  }
}

export const getters = {
  categories: (state) => state.categories,
  categoriesByParentId: (state) => (parent) => state.categories.filter(cat => cat.parent_category_id === parent),
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
    return state.products.filter(prod => prod.category_id === parent)
  },
  statuses: (state) => state.statuses
}

export const actions = {
  fetchCategories({ commit, rootState }) {
    return axios.get(`/categories/${rootState.organization}/list`)
      .then(res => {
        commit('SET_CATEGORIES', {
          categories: res.data.data
        });
      });
  },
  createCategory({ commit, rootState }, payload) {
    payload.append('bot_id', rootState.organization);
    return axios.post('/categories', payload, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(res => {
      commit('ADD_CATEGORY', {
        category: res.data.data
      });
    })
  },
  updateCategory({ commit, rootState }, payload) {
    payload.append('bot_id', rootState.organization);
    return axios.post('/categories/update', payload, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(res => {
      commit('UPDATE_CATEGORY', {
        category: res.data.data
      });
    });
  },
  deleteCategory({ commit, rootState }, payload) {
    return axios.post('/categories/deactivate/' + payload.id)
      .then(() => {
        commit('DELETE_CATEGORY', {
          id: payload.id
        });
      });
  },

  fetchProducts({ commit, rootState }, payload) {
    return axios.get(`/items/${rootState.organization}/list`)
      .then(res => {
        commit('SET_PRODUCTS', {
          products: res.data.data
        });
      });
  },
  createProduct({ commit, rootState }, payload) {
    return axios.post('/items', payload, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(res => {
      commit('ADD_PRODUCT', {
        product: res.data.data
      });
    });
  },
  updateProduct({ commit, rootState }, payload) {
    return axios.post('/items/update', payload, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(res => {
        commit('UPDATE_PRODUCT', {
          product: res.data.data
        });
      });
  },
  deleteProduct({ commit, rootState }, payload) {
    return axios.post('/items/deactivate/' + payload.id)
      .then(() => {
        commit('DELETE_PRODUCT', {
          id: payload.id
        });
      });
  },
}

export const mutations = {
  SET_CATEGORIES(state, payload) {
    state.categories = payload.categories;
  },
  ADD_CATEGORY(state, payload) {
    state.categories.push(payload.category);
  },
  UPDATE_CATEGORY(state, payload) {
    state.categories = state.categories.map(category => {
      if (category.id === payload.category.id) {
        return payload.category;
      }
      return category;
    });
  },
  DELETE_CATEGORY(state, payload) {
    state.categories = state.categories.filter(category => category.id !== payload.id);
  },

  SET_PRODUCTS(state, payload) {
    state.products = payload.products;
  },
  ADD_PRODUCT(state, payload) {
    state.products.push(payload.product);
  },
  UPDATE_PRODUCT(state, payload) {
    state.products = state.products.map(product => {
      if (product.id === payload.product.id) {
        return payload.product;
      }
      return product;
    });
  },
  DELETE_PRODUCT(state, payload) {
    state.products = state.products.filter(product => product.id !== payload.id);
  }
}

export const namespaced = true;
