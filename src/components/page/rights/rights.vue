<template>
  <el-card>
    <!-- 面包屑导航 -->
    <mybread firstnav="权限管理" lastnav="权限列表"/>
    <!-- 表格 -->
    <el-table :data="rightsList" border style="width: 100%; margin-top: 15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getAllRights () {
      var res = await this.$http.request({
        url: `/rights/list`,
        method: 'get'
      })
      // console.log(res)
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getAllRights()
  }
}
</script>

<style>
</style>
