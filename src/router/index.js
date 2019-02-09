import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/page/home.vue'
import User from '@/components/page/users/users.vue'
import Rights from '@/components/page/rights/rights.vue'
import Roles from '@/components/page/roles/roles.vue'
import Goods from '@/components/page/goods/goods.vue'
import GoodsAdd from '@/components/page/goods/add.vue'
import Categories from '@/components/page/categories/categories.vue'

import { Message } from 'element-ui'

Vue.use(Router)

var router = new Router({
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
        {path: '/users', component: User},
        {path: '/rights', component: Rights},
        {path: '/roles', component: Roles},
        {path: '/goods', component: Goods},
        {path: '/goods/add', component: GoodsAdd},
        {path: '/categories', component: Categories}
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    var token = window.localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      Message.error('您还没有登录，请登录')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
