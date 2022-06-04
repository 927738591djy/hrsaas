import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: getToken(), // 初始化vuex中的token就从缓存中获取
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将传过来的token设置给vuex中的token
    setToken(token) // 并且将vuex中的token同步给缓存中token
  },
  removeToken(state) {
    state.token = null // 先把vuex中的token清空
    removeToken() // 再调用removeToken把缓存中的token清空
  },
  // 设置用户信息
  setUserInfo(state, result) {
    state.userInfo = result
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
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
    setTimeStamp()
  },

  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 将整个的个人信息设置到用户的vuex数据中
    return result // 这里为什么要返回 为后面埋下伏笔
  },
  // 登出的action
  logout(context) {
    context.commit('removeToken') // 也同时删除了缓存中的token
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
