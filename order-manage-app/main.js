import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
// import store from './modules/index.js'

Vue.use(Vuex)
import basics from './pages/basics/home.vue'
Vue.component('basics',basics)

import components from './pages/component/home.vue'
Vue.component('components',components)

import plugin from './pages/plugin/home.vue'
Vue.component('plugin',plugin)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

const store = new Vuex.Store({
  state: {
      userInfo: {}
  },
  getters: {
      getInfo: state => {
          return state.userInfo
      }
  },
  mutations: {
      setInfo: (state, data) => {
  		state.userInfo = data;
		uni.setStorageSync('role', data.role)
      }
  },
  actions: {
      demoactions: ({ commit }, localeVal) => {
          commit(demoname.fn, localeVal)
      }
  }
})

const app = new Vue({
	store,
    ...App
})
app.$mount()

 



