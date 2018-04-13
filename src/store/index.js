import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import user from './modules/user'
import getters from './getters'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    table: state.user.table,
    routers: state.permission.routers
  })
})

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  getters,
  plugins: [vuexLocal.plugin]
})

export default store
