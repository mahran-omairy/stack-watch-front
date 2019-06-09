import axios from "axios";
import { baseUrl } from "../../api";
import router from "../../router";
// initial state
const state = {
  categories: [],
  errors: [],
  success: [],
  income: 0,
  spent: 0,
  category: { envelops: [] }
}

// getters
const getters = {
  getCategories(state) {
    return state.categories;
  },
  getErrors(state) {
    return state.errors;
  },
  getSuccess(state) {
    return state.success;
  },
  getIncome(state) {
    return state.income;
  },
  getSpent(state) {
    return state.spent;
  },
  getCategory(state) {
    return state.category;
  }
}

// actions
const actions = {

  // handle create new category
  createCategory({ commit }, payload) {
    const accessToken = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

    axios.post(baseUrl + "categories", payload)
      .then(response => {
        localStorage.setItem("token", response.data.token);
        commit("updateSuccess", [response.data.message]);
        commit("updateErrors", []);
      })
      .catch(errorObj => {
        const ar = [];
        ar.push(errorObj.response.data.error)
        for (let key in errorObj.response.data.extra) {
          for (let i = 0; i < errorObj.response.data.extra[key].length; i++)
            ar.push(errorObj.response.data.extra[key][i]);
        }
        commit("updateErrors", ar);
        commit("updateSuccess", []);
      })
  },
  // handle list all categories
  getCategories({ commit }, payload) {
    const accessToken = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

    axios.get(baseUrl + "categories", payload)
      .then(response => {
        localStorage.setItem("token", response.data.token);
        commit("updateCategories", response.data.categories);
        commit("updateErrors", []);
      })
      .catch(errorObj => {
        const ar = [];
        ar.push(errorObj.response.data.error)
        for (let key in errorObj.response.data.extra) {
          for (let i = 0; i < errorObj.response.data.extra[key].length; i++)
            ar.push(errorObj.response.data.extra[key][i]);
        }
        commit("updateErrors", ar);
        commit("updateSuccess", []);
      })
  },

  // handle delete category
  deleteCategory({ commit }, payload) {
    const accessToken = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

    axios.delete(baseUrl + "categories/" + payload.id)
      .then(response => {
        localStorage.setItem("token", response.data.token);
        commit("updateErrors", []);
        commit("updateSuccess", [response.data.message]);
      })
      .catch(errorObj => {
        const ar = [];
        ar.push(errorObj.response.data.error)
        for (let key in errorObj.response.data.extra) {
          for (let i = 0; i < errorObj.response.data.extra[key].length; i++)
            ar.push(errorObj.response.data.extra[key][i]);
        }
        commit("updateErrors", ar);
        commit("updateSuccess", []);
      })
  },

  // handle edit cateoguy
  editCategory({ commit }, payload) {
    const accessToken = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

    axios.put(baseUrl + "categories/" + payload.id, {
      name: payload.name,
      icon: payload.icon
    })
      .then(response => {
        localStorage.setItem("token", response.data.token);
        commit("updateErrors", []);
        commit("updateSuccess", [response.data.message]);
      })
      .catch(errorObj => {
        const ar = [];
        ar.push(errorObj.response.data.error)
        for (let key in errorObj.response.data.extra) {
          for (let i = 0; i < errorObj.response.data.extra[key].length; i++)
            ar.push(errorObj.response.data.extra[key][i]);
        }
        commit("updateErrors", ar);
        commit("updateSuccess", []);
      })
  },
  // get overall summary
  getSummary({ commit }) {
    const accessToken = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

    axios.get(baseUrl + "envelops/surmmary")
      .then(response => {
        const index1 = response.data.summary.findIndex(el => el.type == "income");
        const index2 = response.data.summary.findIndex(el => el.type == "spent");
        if (index1 !== -1) {
          commit("updateIncome", response.data.summary[index1].amount);
        } else {
          commit("updateIncome", 0);
        }

        if (index2 !== -1) {
          commit("updateSpent", response.data.summary[index2].amount);
        } else {
          commit("updateSpent", 0);
        }

        commit("updateErrors", []);

      })
      .catch(errorObj => {
        const ar = [];
        ar.push(errorObj.response.data.error)
        for (let key in errorObj.response.data.extra) {
          for (let i = 0; i < errorObj.response.data.extra[key].length; i++)
            ar.push(errorObj.response.data.extra[key][i]);
        }
        commit("updateErrors", ar);
        commit("updateSuccess", []);
      })
  },
  // load category
  loadCategory({ commit }, payload) {
    const accessToken = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

    axios.get(baseUrl + "categories/" + payload.id, {
      params:{
        month: payload.month,
        year: payload.year
      }
    })
      .then(response => {
        localStorage.setItem("token", response.data.token);
        commit("updateCategory", response.data.category);
        commit("updateErrors", []);

      })
      .catch(errorObj => {
        const ar = [];
        ar.push(errorObj.response.data.error)
        for (let key in errorObj.response.data.extra) {
          for (let i = 0; i < errorObj.response.data.extra[key].length; i++)
            ar.push(errorObj.response.data.extra[key][i]);
        }
        if(errorObj.response.status === 404){
          router.push("/404");
        }
        commit("updateErrors", ar);
        commit("updateSuccess", []);
      })
  },
  emptyMessages({ commit }) {
    commit("updateSuccess", []);
    commit("updateErrors", []);
  }
}

// mutations
const mutations = {
  updateErrors(state, payload) {
    state.errors = [...payload];
  },
  updateSuccess(state, payload) {
    state.success = [...payload]
  },
  updateCategories(state, payload) {
    state.categories = [...payload]
  },
  updateIncome(state, income) {
    state.income = income
  },
  updateSpent(state, spent) {
    state.spent = spent
  },
  updateCategory(state, category) {
    state.category = { ...category }
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}