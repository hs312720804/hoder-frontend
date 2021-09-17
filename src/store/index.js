import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import configScheme from './modules/configScheme'

Vue.use(Vuex)

const store = new Vuex.Store({
  getters,
  modules: {
    configScheme
  }
})

export default store
