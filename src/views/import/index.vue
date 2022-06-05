<template>
  <div>
    <UploadExcel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      // header中的数据是中文
      // 定义了一个对应关系对象
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      // 第一种换中文方式
      // results.forEach(item => {
      //   const userInfo = {} // 定义一个对象接收改成英文keyd的
      //   // console.log(Object.keys(item)) // ['手机号', '姓名', '入职日期', '转正日期', '工号']
      //   Object.keys(item).forEach(key => {
      //     // console.log(userRelations[key]) // mobile username timeOfEntry correctionTime workNumber
      //     userInfo[userRelations[key]] = item[key]
      //     // console.log(item[key]) item是results里面那个对象,item[key]是取这个对象里每个值。
      //     // 这句话的意思就是把这个原先的每个值给userInfo这个对象，并且是对应的英文Key对应的值
      //     arr.push(userInfo)
      //   })
      // })

      // 第二种换中文方式
      var newArr = results.map((item) => {
        var userInfo = {} // 定义一个对象接收改成英文keyd的
        Object.keys(item).forEach((key) => {
          if (
            userRelations[key] === 'timeOfEntry' ||
            userRelations[key] === 'correctionTime'
          ) {
            // 后端接口限制比较厉害，只有这样才能存入数据酷
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo // map返回一个新数组
      })
      // console.log(newArr)
      await importEmployee(newArr)
      this.$message.success('导入成功')
      this.$router.back()
    },
    // 当excel中有日期格式的时候，实际转化的值为一个数字，我们需要一个方法进行转化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>

<style>
</style>
