import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 引入字体文件
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios请求拦截器添加token，来获取后台数据的权限
axios.interceptors.request.use(config => {
  // headers需要挂载一个值
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config 不然会发生报错
  return config
}
)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
