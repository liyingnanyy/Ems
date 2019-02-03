import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/page/home.vue'
import User from '@/components/page/users/users.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        {path: '/users', component: User}
      //   {path: '/rights', component: Rights},
      //   {path: '/roles', component: Roles},
      //   {path: '/goods', component: Goods},
      //   {path: '/goods/add', component: GoodsAdd},
      //   {path: '/categories', component: Categories},
      //   {path: '/orders', component: Orders}
      ]
    }
  ]
})
