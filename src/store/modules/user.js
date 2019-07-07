import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/tokenCookie'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: {},
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userId, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userId: userId.trim(), password: password }).then(response => {
        const { data } = response
        const nameInfo = {}
        nameInfo.id = data.id
        nameInfo.name = data.name
        nameInfo.userId = data.userId
        nameInfo.isAdmin = data.isAdmin
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', nameInfo)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    const nameInfoTemp = state.name
    commit('SET_ROLES', (nameInfoTemp.isAdmin === true || nameInfoTemp.isAdmin === 'true') ? ['admin'] : ['editor'])
  },

  // user logout
  logout({ commit, state }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

