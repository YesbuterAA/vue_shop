<template>
  <div class="login_container">
    <div class="login_box">
          <!-- 登录区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
          <!--表单区域  -->
          <!--
              ref 是绑定元素的 可以获取到元素的内容
              :model = "loginForm是绑定表单数据的 data()"
              :rules = "loginFormRules是绑定数据验证的"

              使用prop 就是绑定了这个input使用那种方式去验证这个输入框

              v-model 进行双向绑定
          -->
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
      </el-form-item>
      <!-- button -->
      <el-form-item class="btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // resetFields 是element表单上重置的方法 用this.$refs可以访问到实例
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // validate 是element表单上一个预验证的方法 参数接收一个回调函数 不符合规则是会返回false
      this.$refs.loginFormRef.validate(valid => {
        // 如果valid是false 那么久直接return出去 return 后面需要添加false
        if (!valid) return false
        this.axios.post(
          'login',
          this.loginForm
        ).then(res => {
          // console.log(res.data.meta.status)
          if (res.data.meta.status === 400) {
            return this.$message.error('登录失败')
          }
          this.$message.success('登录成功')
          // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
          // 1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
          // 1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
          //  当点击登录的时候 res.data 中有一个token属性 这时候 我们需要把token保存在sessionStoraage中
          window.sessionStorage.setItem('token', res.data.data.token)
          // console.log(res.data.data.token)
          // 页面跳转
          this.$router.push('/home')
        })
      })
    }
  }
}
</script>

<style Lang = 'less' scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width:450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
  }
  .avatar_box>img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
