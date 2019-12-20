<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 图像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <div>
        <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item class="btn">
            <el-button type="primary" @click="Login">登录</el-button>
            <el-button type="info" @click="resetloginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证对象
      loginFormRules: {
        // 用户名验证
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        // 密码验证
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置
    resetloginForm() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    // 登录验证
    Login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const {data: res} = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if(res.meta.status!==200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 将传递过来的token值保存到sessionstorage里面
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.login_form {
  width: 100%;
  padding: 0 30px;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
