<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{disabled:fileComputed}"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
    >
      <!-- action是图片上传地址， -->
      <!-- file-list是上传的文件列表。可以绑定到上传组件上，让上传组件显示 -->
      <!-- :on-remove是文件列表移除时候的钩子 -->
      <!-- :on-change是文件状态改变时候的钩子 -->
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: '',
      showDialog: false,
      fileList: [{ url: 'https://img2.baidu.com/it/u=2637130172,271030761&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' }]
    }
  },
  computed: {
    //   要根据上传数量控制加号显示和隐藏
    // 设计一个计算属性，判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1 // 等于1就是上传完了一张了
    }
  },
  methods: {
    //   点击预览事件
    preview(file) {
      console.log(file)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 文件列表移除时候执行的方法
    handleRemove(file, fileList) {
      // file是要删除的文件，fileList是删除过之后的文件
      this.fileList = fileList
    },
    // 文件状态改变的方法
    changeFile(file, fileList) {
      // 不能用push,这个钩子会执行两次
      // file是当前的文件，fileList是最新的文件
      this.fileList = fileList.map(item => item)
    //   现在还没有上传成功，第二次的fileList还是没数据，我们的action是#
    },
    // 文件上传成功之前的钩子
    beforeUpload(file) {
      // file是一个包含文件的大小类型等的对象，
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 看typs包含我们file里面的类型吗
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // 上传终止
      }
      // 再检查文件大小 1M = 1024kb 1kb = 1024b
      // file.size单位是b
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传的文件大小不能超过5M')
        return false
      }
      return true // 最后一定要return一个true,不然以为你return的是undefined
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
display: none;
}
</style>
