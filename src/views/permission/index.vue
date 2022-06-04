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

      <!-- 弹出层 -->
      <el-dialog :visible="showDialog" label-width="120px" title="新增编辑">
        <el-form>
          <el-form-item label="权限名称">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary">确定</el-button>
            <el-button size="small">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'

export default {
  data() {
    return {
      list: [], // 获取所有权限
      showDialog: true,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
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
