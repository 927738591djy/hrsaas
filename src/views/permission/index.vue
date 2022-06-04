<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右按钮 -->
      <PageTools>
        <el-button slot="after" type="primary">添加权限</el-button>
      </PageTools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button v-if="row.type === 1" type="text">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'

export default {
  data() {
    return {
      list: [] // 获取所有权限
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      // this.list = await getPermissionList()
      this.list = tranListToTreeData(await getPermissionList(), '0')
    }
  }

}
</script>

<style>
</style>
