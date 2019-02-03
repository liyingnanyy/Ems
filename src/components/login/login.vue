<template>
  <div class="login">
    <div class="box">
      <h2>用户登录</h2>
      <el-form
        label-position="top"
        :model="loginObj"
        status-icon
        label-width="100px"
        ref="myform"
        class="demo-ruleForm"
        :rules="myrules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="loginObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginObj.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="mybtn" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginObj: {
        username: '',
        password: ''
      },
      myrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 登录逻辑
    login () {
      // 用来验证form中的表单数据是否通过验证
      this.$refs.myform.validate(async valid => {
        if (valid) {
          var res = await this.$http.post('/login', this.loginObj)
          var { meta, data } = res.data
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: 'success'
            })
            // 将服务器返回的token保存到localStorage中
            window.localStorage.setItem('token', data.token)
            // 跳转到首页
            this.$router.push('/home')
          } else {
            this.$message.error(meta.msg)
          }
        } else {
          this.$message.error('参数不合法，请重新输入')
        }
      })
      // 用来验证form中的表单元素是否通过验证
      // this.$refs.myform.validate(valid => {
      //   if (valid) {
      //     // 得到参数，通过axios提交到服务器
      //     this.$http.post("/login", this.loginObj).then(result => {
      //       // console.log(result)
      //       var { meta } = result.data;
      //       if (meta.status === 200) {
      //         alert(meta.msg)
      //       } else {
      //         alert(meta.msg)
      //       }
      //     })
      //   } else {
      //     alert('参数错误')
      //   }
      // })
    }
  }
}
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  background: #2c3742;
  position: relative;
}
.login .box {
  width: 500px;
  padding: 40px;
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login .box h2 {
  margin-bottom: 20px;
}
.login .box .mybtn {
  width: 100%;
}
</style>
