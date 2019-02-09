<template>
  <!-- 头部 -->
  <el-card>
    <!-- 面包屑导航 -->
    <mybread firstnav="权限管理" lastnav="角色管理"/>
    <el-button class="add">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList" border style="width: 100%; margin-top: 15px">
      <el-table-column type="expand">
        <!-- 遍历角色对应的数据，并且生成tag标签 -->
        <!-- 遍历生成一级权限 -->
        <template slot-scope="scope">
          <el-row v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="5">
              <el-tag
                closable
                @close="delRight(scope.row.id, item1.id, scope.row)"
              >{{item1.authName}}--{{item1.id}}</el-tag>
            </el-col>
            <el-col :span="19">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag
                    @close="delRight(scope.row.id, item2.id, scope.row)"
                    closable
                    type="success"
                  >{{item2.authName}}--{{item2.id}}</el-tag>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    @close="delRight(scope.row.id, item3.id, scope.row)"
                    closable
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    type="warning"
                  >{{item3.authName}}--{{item3.id}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="scope.row.children.length === 0">没有分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="level" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <el-button @click="openRole(scope.row.children, scope.row.id)" type="success" icon="el-icon-check" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限面板 -->
    <el-dialog title="权限分配" :visible.sync="rightDialog">
      <!-- el-tree: 树形结构
                            data：数据源
                            show-checkbox：显示多选框
                            props：当前树状结构绑定数据的配置项
                                label: 设置树状结构显示的文本
                                children: 设置树状结构的子选项
                            node-key：给当前选项设置一个唯一标识
                            default-expanded-keys：
      default-checked-keys：-->
      <el-tree ref="mytree"
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defaultChecked"
        :props="props"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      rightDialog: false,
      props: {
        label: 'authName',
        children: 'children'
      },
      rightsList: [],
      // 默认选中的数组
      defaultChecked: [],
      // 角色id
      roleId: ''
    }
  },
  methods: {
    async getAllRoles () {
      var res = await this.$http.request({
        url: '/roles',
        method: 'get'
      })
      // console.log(res)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.rolesList = data
      }
    },
    async delRight (roleId, rightId, rightData) {
      var res = await this.$http.request({
        url: `/roles/${roleId}/rights/${rightId}`,
        method: 'delete'
      })
      // console.log(res)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        rightData.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 打开分配角色面板
    openRole (rights, id) {
      this.defaultChecked = []
      this.roleId = id
      this.getAllRights()
      this.rightDialog = true
      // 得到当前角色的权限
      // 得到第三层元素的id
      rights.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.defaultChecked.push(item3.id)
          })
        })
      })
    },
    // 获取所有的权限列表
    async getAllRights () {
      var res = await this.$http.request({
        url: '/rights/tree',
        method: 'get'
      })
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 提交数据
    async setRights () {
      var allcheck = this.$refs.mytree.getCheckedKeys()
      var halfcheck = this.$refs.mytree.getHalfCheckedKeys()
      var newArr = allcheck.concat(halfcheck)
      // 将所有选中的内容以，分隔称为字符串
      var rids = newArr.join(',')
      var res = await this.$http.request({
        url: `roles/${this.roleId}/rights`,
        method: 'post',
        data: {
          rids: rids
        }
      })
      var {meta} = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
      this.rightDialog = false
      this.getAllRoles()
    }
  },
  mounted () {
    this.getAllRoles()
  }
}
</script>

<style>
.add {
  margin-top: 15px;
  margin-bottom: 5px;
}
.el-tag {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
