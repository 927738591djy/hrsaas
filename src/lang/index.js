import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的包
import Cookie from 'js-cookie' // 引入cookie的工具
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 中文包
import elementEN from 'element-ui/lib/locale/lang/en' // 英文包
import elementJA from 'element-ui/lib/locale/lang/ja' // 日语包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包

Vue.use(VueI18n) // 全局注册国际化包

export default new VueI18n({
// i18n 的选项
  locale: Cookie.get('language') || 'en', // 指的是当前多语言的类型，随意定义的字符串，中文/英文/日语
  messages: {
    zh: {
      //   语言包
      ...elementZH,
      ...customZH
    },
    en: {
      // 语言包
      ...elementEN, ...customEN
    },
    ja: {
      ...elementJA
    }
  } // 指的是当前的语言包
})
