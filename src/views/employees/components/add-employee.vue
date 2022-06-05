<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form
      ref="addEmployee"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item prop="username" label="姓名">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item prop="mobile" label="手机">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item prop="timeOfEntry" label="入职时间">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item prop="formOfEmployment" label="聘用形式">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :value="item.id"
            :label="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="workNumber" label="工号">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item prop="departmentName" label="部门">
        <el-input
          v-model="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeList"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item prop="correctionTime" label="转正时间">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import { addEmployee } from '@/api/employees'

export default {
  props: {
    showDialog: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      EmployeeEnum, // 定义枚举对象,要去用它里面的值
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      treeList: [], // 接收depts经过处理后的树形数组
      showTree: false, // 树形结构展开
      loading: false
    }
  },
  methods: {
    // 部门输入框聚焦时候的方法
    async getDepartments() {
      try {
        this.showTree = true
        this.loading = true
        // 得到所有的部门数据,但是它不是树形的
        const { depts } = await getDepartments()
        // 调用了之前封装的工具把它转成树形的了
        this.treeList = tranListToTreeData(depts, '')
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
    // 点击树组件中的节点调用这个方法
    selectNode(node) {
      this.formData.departmentName = node.name // 回显
      this.showTree = false
    },
    // 确定按钮事件
    async btnOk() {
      try {
        await this.$refs.addEmployee.validate()
        await addEmployee(this.formData)
        // console.log(this.$parent) this.$parent可以拿到父组件的实例
        this.$parent.getEmployeeList() // 重新渲染主页
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 取消按钮事件
    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 重置校验
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>
</style>
