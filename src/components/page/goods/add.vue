<template>
  <el-card>
    <!-- 面包屑 -->
    <mybread firstnav="商品管理" lastnav="商品列表"/>
    <!-- 消息 -->
    <el-alert class="al" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <br>
    <br>
    <!-- tap -->
    <el-tabs @tab-click="tabclick" tab-position="left">
      <el-tab-pane label="基本信息">
        <el-form label-position="top" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品名称">
            <el-input type="text" autocomplete="off" v-model="addObj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input type="text" autocomplete="off" v-model="addObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input type="text" autocomplete="off" v-model="addObj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input type="text" autocomplete="off" v-model="addObj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- options:数据源
            props：配置项-->
            {{ cateData }}
            <el-cascader
              expand-trigger="hover"
              :options="cateList"
              :props="props"
              v-model="cateData"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <div v-for="item in manyParams" :key="item.attr_id">
          <p style="font-size:12px;">{{item.attr_name}}</p>
          <div style="margin: 20px 0;">
            <el-checkbox
              v-model="checked"
              v-for="(item1, index) in item.attr_vals.split(',')"
              :key="index"
              :label="item1"
              border
            ></el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <!-- 静态参数 -->
      <el-tab-pane label="商品属性">
        <el-form label-position="top" label-width="100px">
          <el-form-item v-for="item in onlyParams" :key="item.attr_id" :label="item.attr_name">
            <el-input type="text" v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        <!--
          el-upload:上传组件
          action：上传图片的路径
          on-preview：钩子函数，当点击已经上传好的图片时执行
          on-remove：钩子函数，当点击删除图片时执行
          file-list：上传文件的列表
          headers：设置上传的请求头
        -->
        <el-upload
          :on-preview="uploadpreview"
          :on-success="uploadsuccess"
          :headers = headers
          :on-remove="uploadremove"
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <el-button @click="add">添加商品</el-button> <br><br>
        <!-- 富文本编辑框 -->
        <quill-editor></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewDialog">
      <img style="width:100%" ref="myimg" src="#">
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 控制步骤条
      active: 0,
      // 设置复选框默认选中
      checked: true,
      addObj: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: ''
      },
      // 双向绑定给级联框的数据
      cateData: [],
      // 设置级联框配置项
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      // 所有的分类数据
      cateList: [],
      // 动态参数
      manyParams: [],
      // 静态参数
      onlyParams: [],
      // 设置图片上传的请求头
      headers: {
        'Authorization': window.localStorage.getItem('token')
      },
      // 图片预览
      previewDialog: false
    }
  },
  methods: {
    async add () {
      // 设置分类
      this.addObj.goods_cat = this.cateData.join(',')
      var res = await this.$http.post('/goods', this.addObj)
      // console.log(res)
      var {meta} = res.data
      if (meta.status === 201) {
        this.$message({
          message: meta.msg,
          type: 'success'
        })
        this.$router.push('/goods')
      } else {
        this.$message.error(meta.msg)
      }
    },
    tabclick (e) {
      // e.index当前tab的下标
      this.active = Number(e.index)
      if (e.index === '1') {
        this.getParams('many')
      }
      if (e.index === '2') {
        this.getParams('only')
      }
    },
    // 当点击已经上传好的图片时执行
    uploadpreview (file) {
      // 打开一个对话框
      this.previewDialog = true
      // 问题:第一次点击时会得不到图片对象，原因是：渲染界面是在uploadpreview之前执行的

      // 在dom更新时执行
      this.$nextTick(() => {
        // 将路径设置给图片(vue中的指令：只能去虚拟dom)
        this.$refs.myimg.src = file.response.data.url
      })
    },
    // 移除图片时执行
    uploadremove (file, fileList) {
      // 得到移除的图片信息
      for (var i = 0; i < this.addObj.pics.length; i++) {
        if (this.addObj.pics[i] === file.response.data.tmp_path) {
          this.addObj.pics.splice(i, 1)
          break
        }
      }
    },
    // 上传成功时执行
    uploadsuccess (response, file, fileList) {
      // response: 响应信息：
      //    meta
      //    data
      //      tmp_path
      //      url:
      //  file:上传的文件信息
      //      response
      // fileList：文件上传的集合
      // 提示成功信息。并且保存信息
      if (response.meta.status === 200) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        // 将图片保存到fileList
        this.addObj.pics.push(response.data.tmp_path)
      } else {
        this.$message.error(response.meta.msg)
      }
    },
    // 获取级联框中的数据
    async getAllCate () {
      var res = await this.$http.get(`/categories?type=3`)
      var { meta, data } = res.data
      if (meta.status === 200) {
        this.cateList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async getParams (sel) {
      if (this.cateData.length === 0) {
        this.$message.error('请选择商品分类')
        return
      }
      var id = this.cateData[this.cateData.length - 1]
      var res = await this.$http(`/categories/${id}/attributes?sel=${sel}`)
      var { meta, data } = res.data
      if (meta.status === 200) {
        if (sel === 'many') {
          this.manyParams = data
        } else {
          this.onlyParams = data
        }
      } else {
        this.$message.error(meta.msg)
      }
    }
  },
  mounted () {
    this.getAllCate()
  }
}
</script>

<style>
.al {
  margin: 15px 0;
}
.el-step__title {
  font-size: 12px;
}
div#pane-4 {
  height: 450px;
}
.ql-editor {
  height: 300px;
}
</style>
