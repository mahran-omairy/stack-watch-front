import axios from "axios";
import { baseUrl } from "../../api";
import router from "../../router";
// initial state
const state = {
  user: {},
  errors: [],
  success:[],
}

// getters
const getters = {
  getErrors(state) {
    return state.errors;
  },
  getSuccess(state) {
    return state.success;
  },
  getUser(state) {
    return state.user;
  }
}

// actions
const actions = {
// handle user login
  login({ commit }, payload) {

    axios.post(baseUrl + "user/login", payload)
      .then(response => {
        localStorage.setItem("settings", JSON.stringify(response.data.settings));
        localStorage.setItem("token", response.data.token);
        commit("updateUser", response.data.user);
        router.push("/overview");
      })
      .catch(errorObj => {
        const ar = [];
        ar.push(errorObj.response.data.error)
        for (let key in errorObj.response.data.extra) {
          for (let i = 0; i < errorObj.response.data.extra[key].length; i++)
            ar.push(errorObj.response.data.extra[key][i]);
        }
        commit("updateErrors", ar);
      })
  },
// handle user register
  register({ commit }, payload) {
    axios.post(baseUrl + "user/register", payload)
      .then(response => {
        localStorage.setItem("settings", JSON.stringify(response.data.settings));
        localStorage.setItem("token", response.data.token);
        commit("updateUser", response.data.user);
        router.push("/overview");
      })
      .catch(errorObj => {
        const ar = [];
        ar.push(errorObj.response.data.error)
        for (let key in errorObj.response.data.extra) {
          for (let i = 0; i < errorObj.response.data.extra[key].length; i++)
            ar.push(errorObj.response.data.extra[key][i]);
        }
        commit("updateErrors", ar);
      })
  },
// handle user logout
  logout({ commit }) {
    localStorage.clear();
    commit("updateUser", {});
    router.push("/login");
  },
  // check if user is logged in
  checkLogin({ commit, dispatch }, { next }) {
    const accessToken = localStorage.getItem("token");
    if (accessToken === null) {
      next(false);
      dispatch("logout")
      return;
    }
    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
    axios.get(baseUrl + "user")
      .then(response => { 
        localStorage.setItem("token", response.data.token); 
        commit("updateUser", response.data.user); 
        next()
       })
      .catch(() => { 
        next(false); 
        dispatch("logout")
     
      })
  },
  // auto log in
  autoLogin({ commit, dispatch }, { next }){
    const accessToken = localStorage.getItem("token");
    if (accessToken === null) {
      next();
      return;
    }

    axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
    axios.get(baseUrl + "user")
      .then(response => { 
        localStorage.setItem("token", response.data.token); 
        commit("updateUser", response.data.user); 
        router.push("/overview");
       })
      .catch(() => { 
        dispatch("logout")
      })

  },
// handle update user information 
updateUserData({ commit }, payload){
  const accessToken = localStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
    axios.put(baseUrl + "user", payload)
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
// handle update user password 
updateUserPassword({ commit }, payload){
  const accessToken = localStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
    axios.put(baseUrl + "user/update-password", payload)
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

// handle delete user account 
deleteAccount({ commit , dispatch}){
  const accessToken = localStorage.getItem("token");
  axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
    axios.delete(baseUrl + "user")
      .then(() => { 
        dispatch("logout")
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
emptyMessages({commit}){
  commit("updateSuccess", []);
  commit("updateErrors", []);
}
}

// mutations
const mutations = {
  updateErrors(state, payload) {
    state.errors = [...payload];
  },
  updateUser(state, payload) {
    state.user = { ...payload }
  },
  updateSuccess(state, payload) {
    state.success = [ ...payload ]
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}