<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="140" />
              <el-table-column prop="description" label="描述" />
              <el-table-column prop="companyId" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerms(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-page="page.page"
                @current-change="changePage"
              />
            </el-row>

            <el-dialog
              title="编辑弹层"
              :visible="showDialog"
              @close="btnCancel"
            >
              <el-form
                ref="roleForm"
                :model="roleForm"
                :rules="rules"
                label-width="120px"
              >
                <el-form-item prop="name" label="角色名称">
                  <el-input v-model="roleForm.name" />
                </el-form-item>
                <el-form-item label="角色描述">
                  <el-input v-model="roleForm.description" />
                </el-form-item>
              </el-form>
              <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                  <el-button size="small" @click="btnCancel">取消</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="btnOk"
                  >确定</el-button>
                </el-col>
              </el-row>
            </el-dialog>
          </el-tab-pane>

          <!-- 分配权限弹层 -->
          <el-dialog :visible="showpermDialog" title="分配权限" @close="btnpermCancel">
            <el-tree
              ref="permTree"
              node-key="id"
              :default-checked-keys="selectCheck"
              :show-checkbox="true"
              :check-strictly="true"
              :data="permData"
              :props="defaultprops"
              default-expand-all=""
            />
            <el-row slot="footer" type="flex" justify="center">
              <el-col :span="6">
                <el-button type="primary" size="small" @click="btnpermOk">确定</el-button>
                <el-button size="small" @click="btnpermCancel">取消</el-button>
              </el-col>
            </el-row>
          </el-dialog>

          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>

              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>

              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole, assignPerm
} from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils/index'
import { getPermissionList } from '@/api/permission'

export default {
  data() {
    return {
      list: [],
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: {}, // 接收公司信息
      roleForm: {
        name: '',
        description: ''
      }, // 接收角色细节信息
      rules: {
        name: [{ required: true, message: '角色名不能为空', trigger: 'blur' }]
      },
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据,
      showpermDialog: false,
      permData: [], // 接收权限数据
      defaultprops: {
        label: 'name'
      },
      roleId: null, // 角色id
      selectCheck: [] // 用来接收当前角色所拥有的权限数据
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id)
        this.getRoleList() // 重新加载数据
        this.$message('删除角色成功')
      } catch (err) {
        console.log(err)
      }
    },
    async editRole(id) {
      // 把调用数据放上面,避免一闪
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOk() {
      try {
        // 点击确定手动校验表单
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 编辑角色
          await updateRole(this.roleForm)
        } else {
          // 新增角色
          await addRole(this.roleForm)
        }
        this.showDialog = false
        this.$message('操作成功')
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.showDialog = false
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
    },
    // 分配权限
    async assignPerms(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id // 记录当前角色的id
      const { permIds } = await getRoleDetail(id) // permIds就是当前点击的角色的权限数据
      // console.log(permIds)
      this.selectCheck = permIds
      this.showpermDialog = true
    },
    async btnpermOk() {
      // console.log(this.$refs.permTree.getCheckedKeys()) // 得到的是一个字符串数组 数组中id的值
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showpermDialog = false
    },
    btnpermCancel() {
      this.selectCheck = []
      this.showpermDialog = false
    }
  }
}
</script>

<style>
</style>
