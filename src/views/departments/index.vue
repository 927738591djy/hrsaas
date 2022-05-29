<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTools :tree-node="company" :is-root="true" />

        <!-- 树形组织结构 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
          <tree-tools slot-scope="obj" :tree-node="obj.data" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from '@/views/departments/components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'

export default {
  components: {
    TreeTools
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: {}
    }
  },
  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      // this.departs = result.depts // 需要将其转化成树形结构
      this.departs = tranListToTreeData(result.depts, '')
      console.log(result)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
