// 将axios封装为一个组件，全局使用
import axios from 'axios'
var myaxios = {}
// 添加一个方法：install
myaxios.install = function (Vue) {
  // 统一挂载请求路径
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

  // 这样设置会让每个请求都带上axios 不建议（全局）
  // axios.defaults.headers.common['Authorization'] = window.localStorage.getItem('token')

  // 添加一个拦截器
  axios.interceptors.request.use(function (config) {
    // 可以判断当前请求的路径
    if (config.url !== '/login') {
      // 在请求头中添加一个Authorization
      config.headers['Authorization'] = window.localStorage.getItem('token')
    }
    return config
  })

  // 将axios挂载到vue原型中
  Vue.prototype.$http = axios
}
// 暴露出去
export default myaxios
