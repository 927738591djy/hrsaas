<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <svg-icon icon-class="language" style="color:#fff; font-size: 25px;" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="$i18n.locale === 'zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="$i18n.locale === 'en'">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  methods: {
    changeLanguage(type) {
    // 设置类型 先写入到cookie
      Cookie.set('language', type)
      // 改变当前的多语言
      this.$i18n.locale = type // 将当前的多语言类型，改成对应类型
      this.$message.success('切换语言成功')
    }
  }

}
</script>

<style>

</style>
