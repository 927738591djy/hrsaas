<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </PageTools>
      <el-table border="" :data="list">
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" sortable="" />
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>

        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template slot-scope="{row}">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template>
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination layout="prev, pager, next" :current-page="page.page" :page-size="page.size" :total="page.total" @current-change="changePage" />
      </el-row>
    </div>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employee'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象

export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async  getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 封装一个格式化聘用形式的方法
    formatEmployment(row, column, cellvalue) {
      // cellvaluej就是用了formatter的那一列的每个单元格的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellvalue)
      // 找到1就返回成枚举对象里的正式
      return obj ? obj.value : '未知'
    }
  }
}
</script>

<style>

</style>
