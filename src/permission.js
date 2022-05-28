// 权限拦截 导航守卫 路由守卫  router
import store from '@/store' // 引入vuex store实例
import router from './router' // 引入路由实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  //  首先判断有无token
  if (store.getters.token) {
    //   如果有token 继续判断是不是去登录页
    if (to.path === '/login') {
      //  表示去的是登录页
      next('/') // 跳到主页
    } else {
      // 只有放过去的时候才获取用户资料
      if (!store.getters.userId) {
        // 没有用户资料才要获取
        await store.dispatch('user/getUserInfo')
        // 要等拿到用户资料再放行所以写await
      }
      next() // 直接放行
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

router.afterEach(() => {
  NProgress.done()
})
