<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportData"
          >导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </PageTools>
      <el-table border="" :data="list">
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column label="姓名" prop="username" sortable="" />
        <el-table-column label="工号" prop="workNumber" sortable="" />
        <el-table-column
          label="聘用形式"
          prop="formOfEmployment"
          :formatter="formatEmployment"
          sortable=""
        />
        <el-table-column label="部门" prop="departmentName" sortable="" />
        <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
          <template slot-scope="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>

        <el-table-column label="账户状态" prop="enableState" sortable="">
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button
              type="text"
              size="small"
              @click="delEmployee(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置新增组件 -->
    <AddDemployee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employee'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddDemployee from './components/add-employee'
import { formatDate } from '@/filters'

export default {
  components: {
    AddDemployee
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false // 新增员工弹出层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
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
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellvalue)
      // 找到1就返回成枚举对象里的正式
      return obj ? obj.value : '未知'
    },
    // 删除员工方法
    async delEmployee(id) {
      try {
        await this.$confirm('确认删除该员工吗？')
        await delEmployee(id)
        this.$message('删除成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel
    exportData() {
      // 因为数据中的key是英文，想要导出的表头是中文的话，需要将中文和英文做对应
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 懒加载点击了才加载这个文件
      import('@/vendor/Export2Excel').then(async(excel) => {
        // 现在没有一个接口可以查到所有员工数据
        // 我们就利用原先接口
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        })
        const data = this.formatJson(headers, rows) // 返回的data就是要导出的data
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        // 导出excel
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工工资表',
          // bookType: 'txt'
          multiHeader,
          merges
        })
        //     // excel是引入文件的导出的对象
        //     excel.export_json_to_excel({
        //       header: ['姓名', '工资'],
        //       data: [],
        //       filename: '员工工资表',
        //       bookType: 'txt'
        //     })
      })
    },
    // 处理所有员工共的数据让导出可以用的方法
    formatJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          // 需要判断字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    }
  }
}
</script>

<style>
</style>
