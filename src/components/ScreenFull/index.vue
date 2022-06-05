<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width:20px; height:20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'

export default {
  methods: {
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        this.$message.warning('此时全屏组件不可用')
        return
      }
      ScreenFull.toggle() // 全屏方法
    }
  }
}
</script>

<style>

</style>
