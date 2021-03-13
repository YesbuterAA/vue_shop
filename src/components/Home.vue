<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    // 退出
    // 退出比较简单 直接销毁token值就行 然后采用this.$router.push 返回到登录页面
    logout () {
      // 清空了浏览器中的token值
      window.sessionStorage.clear()
      // 返回了登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style  scoped>

</style>
