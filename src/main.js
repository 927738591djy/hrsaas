import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import checkPermission from './mixin/checkPermission'
import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'
import Component from '@/components'
import * as filters from '@/filters'
import i18n from '@/lang'

Vue.mixin(checkPermission)
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 注册fitlter文件夹里面的方法注册成过滤器
// 循环遍历
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI, {
  // t方法是去找 对应的语言下的 显示值
  i18n: (key, value) => i18n.t(key, value)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI, { i18n: (key, value) => i18n.t(key, value) })
// // locale的值改变，语言变

Vue.config.productionTip = false

Vue.use(Component) // 注册自己的插件

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

