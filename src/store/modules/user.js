import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken() // 初始化vuex中的token就从缓存中获取
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将传过来的token设置给vuex中的token
    setToken(token) // 并且将vuex中的token同步给缓存中token
  },
  removeToken(state) {
    state.token = null // 先把vuex中的token清空
    removeToken() // 再调用removeToken把缓存中的token清空
  }
}
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来mobile和password
  async login(context, data) {
    // 发起axios请求
    const result = await login(data)
    if (result.data.success) {
      // 如果login返回的结果成功了，返回结果里面就包含token了，就可以向mutations提交，并且传入那个token
      context.commit('setToken', result.data.data)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
