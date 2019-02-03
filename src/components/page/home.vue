<template>
  <el-container>
    <el-header>
      <Headers />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <SideBar />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Headers from '@/layout/headers.vue'
import SideBar from '@/layout/sidebar.vue'
export default {
  components: {
    Headers,
    SideBar
  }
}
</script>

<style>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  padding: 0;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  height: 100%;
}
</style>
