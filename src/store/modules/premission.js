import { constantRoutes } from '@/router/index'

const state = {
  routes: constantRoutes // 定义一个默认的路由表，静态路由是所有角色都可以访问的
}
const mutations = {
  // 定义一个添加路由的方法
  // newRoutes是要加进来的路由数组
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] // 每次都初始是静态再加
  }
}
const actions = {}
export default {
  state,
  mutations,
  actions
}
