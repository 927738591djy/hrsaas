<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />

        <!-- 树形组织结构 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
          <tree-tools slot-scope="obj" :tree-node="obj.data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from '@/views/departments/components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './components/add-dept' // 引入新增部门组件

export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      showDialog: false, // 显示窗体
      loading: false, // 用来控制进度弹层的显示和隐藏
      node: null, // 接收子组件treetool传过来的treeNode当前部门信息
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
      // console.log(data)
    },
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      // 在最根级的**`tree-tools`**组件中，由于treenode属性中没有id，id便是undefined，
      // 但是通过undefined进行等值判断是寻找不到对应的根节点的
      // ， 所以在传值时，我们将id属性设置为 ''
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // this.departs = result.depts // 需要将其转化成树形结构
      this.departs = tranListToTreeData(result.depts, '')
      // console.log(result)
      this.loading = false
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      // 我们需要在这个位置 调用子组件的方法
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id) // 直接调用子组件中的方法 传入一个id
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
