<template>
  <el-card>
    <!-- 面包屑导航 -->
    <mybread firstnav="商品管理" lastnav="商品列表"/>
    <!-- 搜索区域 -->
    <el-row class="myrow">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="18">&nbsp;&nbsp;
        <el-button type="success" plain @click="add">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.upd_time | dateformat }}</template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <div>
            <el-button
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              plain
              size="mini"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizechange"
      @current-change="currentchange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      // 总条数
      total: 0,
      // 分页的当前页
      pagenum: 1,
      // 分页的页容量
      pagesize: 10,
      goodsList: []
    }
  },
  methods: {
    async getAllgoods () {
      var res = await this.$http.request({
        url: `/goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        method: 'get',
        headers: { 'Authorization': window.localStorage.getItem('token') }
      })
      // console.log(res)
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    sizechange (size) {
      this.pagesize = size
      this.getAllgoods()
    },
    currentchange (num) {
      this.pagenum = num
      this.getAllgoods()
    },
    searchList () {
      this.getAllgoods()
    },
    add () {
      this.$router.push('goods/add')
    }
  },
  mounted () {
    this.getAllgoods()
  }
}
</script>

<style>
.myrow {
  margin: 10px 0;
}
</style>
