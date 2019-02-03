<template>
  <el-menu default-active="2" class="el-menu-vertical-demo mymenu" :unique-opened="true" :router="true">
    <el-submenu :index="item1.path" v-for="item1 in rightsList" :key="item1.id">
      <!-- 一级菜单 -->
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{item1.authName}}</span>
      </template>
      <el-menu-item :index="'/' + item2.path" v-for="item2 in item1.children" :key="item2.id">
        <i class="el-icon-menu"></i>
        <span>{{item2.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      rightsList: ''
    }
  },
  methods: {
    async getAllRights () {
      var res = await this.$http.request({
        url: '/menus',
        method: 'get',
        headers: {'Authorization': window.localStorage.getItem('token')}
      })
      // console.log(res)
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.rightsList = data
      }
    }
  },
  mounted () {
    this.getAllRights()
  }
}
</script>

<style>
/* 侧边栏样式*/
.mymenu {
    height: 100%
}
</style>
