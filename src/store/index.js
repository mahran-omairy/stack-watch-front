import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import category from './modules/category'
import envelop from './modules/envelop'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    category,
    envelop
  },
  strict: debug
})
export const strict = false