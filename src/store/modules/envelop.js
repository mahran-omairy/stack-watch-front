import axios from "axios";
import { baseUrl } from "../../api";

// initial state
const state = {
  success:[],
  errors:[],
}

// getters
const getters = {
  getSuccess(state) {
    return state.success;
  },
  getErrors(state) {
    return state.errors;
  },

}

// actions
const actions = {

  // handle create new envelop
  createEnvelop({ commit }, payload) {
    const accessToken = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

    axios.post(baseUrl + "envelop", payload)
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


  // handle delete envelop
  deleteEnvelop({ commit }, payload) {
    const accessToken = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

    axios.delete(baseUrl + "envelop/" + payload.id)
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

}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}