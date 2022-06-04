<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右按钮 -->
      <PageTools>
        <el-button slot="after" type="primary">添加权限</el-button>
      </PageTools>
      <!-- 表格 -->
      <el-table border>
        <el-table-column align="center" label="名称" />
        <el-table-column align="center" label="标识" />
        <el-table-column align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <el-button type="text">添加</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
</style>
