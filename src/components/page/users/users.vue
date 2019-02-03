<template>
  <el-card>
    <!-- el-card将内容放在一个单独的结构里，有边框好看些 -->
    <!-- 面包屑导航 -->
    <mybread firstnav="用户管理" lastnav="用户列表"/>
    <!-- 搜索区域 -->
    <el-row class="myrow">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="success" plain @click="addDialog=true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 列表区域 -->
    <el-table :data="dataList" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 一旦设置了 template 标签， prop 属性就会失效，如果要得到数据源，需要从 scope.row 中去取 -->
        <template slot-scope="scope">
          <!-- 表格中的内容默认为prop绑定的数据 添加template slot-scope="scope"才能显示开关按钮 -->
          <!-- {{scope.row}} -->
          <el-switch
            @change="switchchange(scope.row.id, scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="200">
        <template slot-scope="scope">
          <div>
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
              @click="editDate(scope.row.id)"
            ></el-button>
            <el-button
              @click="del(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
            ></el-button>
            <el-button
              @click="openRoles(scope.row.id)"
              type="success"
              icon="el-icon-check"
              plain
              size="mini"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="sizechange"
      @current-change="currentchange"
      :current-page="pagenum"
      :page-sizes="[5, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加面板 -->
    <el-dialog title="添加用户" :visible.sync="addDialog">
      <el-form :model="addObj">
        <el-form-item label="用户名" label-width="100px" prop="name">
          <el-input v-model="addObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input type="password" v-model="addObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancle">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑面板 -->
    <el-dialog title="编辑用户" :visible.sync="editDialog">
      <el-form :model="editObj">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editObj.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCancle">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色面板 -->
    <el-dialog title="分配角色" :visible.sync="roleDialog">
      <el-form :model="roleObj">
        <el-form-item label="当前用户" label-width="100px">
          <label>{{roleObj.username}}</label>
        </el-form-item>
        <el-form-item label="请选择角色" label-width="100px">
          {{roleObj.rid}}
          <el-select placeholder="请选择" v-model="roleObj.rid">
            <el-option :value="-1" label="请选择角色" :disabled="true"></el-option>
            <el-option
              v-for="item in dropData"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog=false">取 消</el-button>
        <el-button type="primary" @click="role()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 搜索框中的数据
      search: '',
      // 分页的页容量
      pagesize: 5,
      // 分页的当前页
      pagenum: 1,
      // 表格的数据源
      dataList: [],
      // 数据的总条数
      total: 0,
      addDialog: false,
      addObj: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialog: false,
      editObj: {},
      roleDialog: false,
      roleObj: {},
      dropData: [],
      myrules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getAllList()
  },
  methods: {
    // 得到列表数据
    async getAllList () {
      var res = await this.$http.get(`/users?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.dataList = data.users
        this.total = data.total
      }
    },
    // 当页容量发生改变时，重新请求数据
    sizechange (size) {
      this.pagesize = size
      this.getAllList()
    },
    // 当当前页改变时 重新请求数据
    currentchange (num) {
      this.pagenum = num
      this.getAllList()
    },
    // 搜索按钮 根据搜索框中的内容查询响应的数据
    searchData () {
      this.getAllList()
    },
    async add () {
      var res = await this.$http.request({
        url: '/users',
        method: 'post',
        data: {
          username: this.addObj.username,
          password: this.addObj.password,
          email: this.addObj.email,
          mobile: this.addObj.mobile
        }
      })
      var { meta } = res.data
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        // 重新获取数据
        this.getAllList()
      } else {
        this.$message.error(meta.msg)
      }
      // 清空表单  弹框隐藏
      this.clearObj(this.addObj)
      this.addDialog = false
    },
    // 清空对象
    clearObj (obj) {
      for (var item in obj) {
        obj[item] = ''
      }
    },
    // 添加面板中的取消
    addCancle () {
      this.addDialog = false
      this.clearObj(this.addObj)
    },
    // 开关状态改变时触发的事件
    async switchchange (id, type) {
      var res = await this.$http.request({
        url: `/users/${id}/state/${type}`,
        method: 'put'
      })
      // console.log(res)
      var { meta } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 点击编辑得到数据
    async editDate (id) {
      this.editDialog = true
      // console.log(id)
      var res = await this.$http.request({
        url: `/users/${id}`,
        method: 'get'
      })
      // console.log(res)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.editObj = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 提交编辑的数据
    async edit () {
      var res = await this.$http.request({
        url: `/users/${this.editObj.id}`,
        method: 'put',
        data: {
          email: this.editObj.email,
          mobile: this.editObj.mobile
        }
      })
      // console.log(res)
      var { meta } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.getAllList()
      } else {
        this.$message.error(meta.msg)
      }
      this.clearObj(this.editObj)
      this.editDialog = false
    },
    // 点击取消按钮关闭编辑面板
    editCancle () {
      this.clearObj(this.editObj)
      this.editDialog = false
    },
    // 点击删除按钮删除数据
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var res = await this.$http.request({
          url: `/users/${id}`,
          method: 'delete'
        })
        console.log(res)
        var { meta } = res.data
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: 'success'
          })
          if ((this.total - 1) % this.pagesize === 0) {
            this.pagenum = this.pagenum - 1
            this.getAllList()
          }
          this.getAllList()
        } else {
          this.$message.error(meta.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 打开分配角色面板，渲染角色
    async openRoles (id) {
      this.roleDialog = true
      this.getDropData()
      var res = await this.$http.request({
        url: `/users/${id}`,
        method: 'get'
      })
      var { meta, data } = res.data
      // console.log(data)
      if (meta.status === 200) {
        this.roleObj = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 得到角色数据
    async getDropData () {
      var res = await this.$http.request({
        url: '/roles',
        method: 'get'
      })
      var { meta, data } = res.data
      // console.log(data)
      if (meta.status === 200) {
        this.dropData = data
        // console.log(this.dropData)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async role () {
      var rid = this.roleObj.rid
      var res = await this.$http.request({
        url: `/users/${this.roleObj.id}/role`,
        data: {
          rid: rid
        },
        method: 'put'
      })
      // console.log(res)
      var { meta } = res.data
      if (meta.status === 200) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
      } else {
        this.$message.error(meta.msg)
      }
      this.roleDialog = false
    }
  }
}
</script>

<style>
.myrow {
  margin-top: 15px;
}
</style>
