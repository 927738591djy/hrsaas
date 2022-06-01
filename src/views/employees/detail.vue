<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form
              ref="userInfo"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" />
          <el-tab-pane label="岗位信息" />
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employee'
export default {
  data() {
    return {
      // 定义一个用户id通过路由的parmas去获取，因为这个页面我们有用户的id
      userId: this.$route.params.id,
      userInfo: {
        //   定义这个对象专门存放基本信息
        username: '',
        password2: '' // 因为接口中传过来的密码是一段密文
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码为6-9位之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    // 封装一个方法显示用户的名字和密码
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    // 保存更新的用户信息的方法
    saveUser() {
      // 用这个方法的时候应该先校验下表单
      this.$refs.userInfo.validate().then(async() => {
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2
        })
        this.$message.success('更改用户信息成功')
      })
    }
  }
}
</script>

<style>
</style>
