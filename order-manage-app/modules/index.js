import Vuex from 'vuex'

const store = {
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
			console.log(data, 'data')
			state.userInfo = data;
        }
    },
    actions: {
        demoactions: ({ commit }, localeVal) => {
            commit(demoname.fn, localeVal)
        }
    }
}
export default new Vuex.Store(store)