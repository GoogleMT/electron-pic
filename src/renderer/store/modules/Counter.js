const state = {
  network_stae: true
}

const mutations = {
  NO_NETWORK_CONNECTION (state) {
    state.network_stae = false
  },
  NETWORK_CONNECTION_NORMAL (state) {
    state.network_stae = true
  }
}

const actions = {
  networkDis ({ commit }) {
    // do something async
    commit('NO_NETWORK_CONNECTION')
  },
  networkSuccess ({ commit }) {
    commit('NETWORK_CONNECTION_NORMAL')
  }
}

export default {
  state,
  mutations,
  actions
}
