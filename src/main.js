// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import myaxios from '@/assets/js/myaxios.js'
import MyBread from '@/layout/bread.vue'

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'

Vue.use(myaxios)
Vue.use(Element)
Vue.component(MyBread.name, MyBread)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
