// 该文件负责所有的公共的组件的全局注册
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/uploadExcel'
import ImageUpload from '@/components/ImageUpload'
import ScreenFull from '@/components/ScreenFull'
import ThemePicker from './ThemePicker'
import LangSelect from './lang'

export default {
  install(Vue) {
    // 注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('LangSelect', LangSelect)
  }
}
