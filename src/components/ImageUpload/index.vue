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
      :http-request="upload"
    >
      <!-- http-request可以覆盖默认上传行为，自定义上传 -->
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
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 实例化cos对象，需要secretid和secretkey两个参数

const cos = new COS({
  // 要用自己的secre才能访问自己的存储桶
  SecretId: 'AKIDQfeNp0vZw2qOfeMn69vRgdJirjJcePs4', // 身份识别id
  SecretKey: 'xdKktmOjna6KHxMUKtCEzTheKiqhGYZJ' // 身份密钥
})

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
    },
    // 这里进行上传操作
    upload(params) {
      // params.file可以拿到我们要上传的那个文件
      if (params.file) {
        // 如果params.file文件存在就要执行上传操作
        cos.putObject({
          Bucket: 'liuyixiedaima-1312276636', // 存储桶
          Region: 'ap-shanghai', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, function(err, data) {
          console.log(err || data)
        })
        // cos第二个参数是个回调函数,成功会返回数据,生成了本地文件的在线地址
        // 返回数据为{statusCode: 200, headers: {…}, Location: 'liuyixiedaima-1312276636.cos.ap-shanghai.myqcloud.com/8abb5fbc7404ae1dc18ff6116f205ba0.jpeg', ETag: '"a6cff21856850bac861e17108e0336c6"', RequestId: 'NjI5ODMyM2FfMzYyNzY5NjRfMTNlNDZfMTkzMWU2Yg=='}
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card{
display: none;
}
</style>
