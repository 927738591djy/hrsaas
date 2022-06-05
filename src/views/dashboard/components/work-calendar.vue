<template>
  <!-- 工作日历 -->
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentyear" size="small" style="width: 120px;margin-left:10px" @change="dataChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentmonth" size="small" style="width: 120px;margin-left:10px" @change="dataChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <!-- date是当前单元格的日期，data是对象 对象里有要显示的day -->
      <template v-slot:dateCell="{date,data}">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      yearList: [], // 要遍历的年数组
      currentyear: null,
      currentmonth: null,
      currentDate: null

    }
  },
  created() {
    this.currentyear = this.startDate.getFullYear()
    this.currentmonth = this.startDate.getMonth() + 1
    this.yearList = Array.from(Array(11), (value, index) => this.currentyear + index - 5)
    this.dataChange() // 主动调用获德最新时间方法
  },
  methods: {
    dataChange() {
      // 生成新的日期
    //   console.log(new Date(`${this.currentyear}-${this.currentmonth}-1`))
      this.currentDate = new Date(`${this.currentyear}-${this.currentmonth}-1`)
    },
    // 判断周六日
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    }
  }
}
</script>

<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
