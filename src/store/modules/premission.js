import { constantRoutes, asyncRoutes } from '@/router/index'

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
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus: ["settings","permissions"]
  // asyncRoutes是所有的动态路由
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes(context, menus) {
    const routes = []
    //   筛选出 动态路由中和menus中能够对上的路由
    menus.forEach(key => {
      // key就是标识
      // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
    })
    // 得到的routes是所有模块中满足权限要求的路由数组
    // routes就是当前用户所拥有的 动态路由的权限
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
