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
  async login(context, data) {
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
