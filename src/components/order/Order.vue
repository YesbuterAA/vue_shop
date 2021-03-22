<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 订单查询 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-row>
        <el-table :data="orderList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status === 1">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
              <el-button
                type="success"
                icon="el-icon-location"
                size="mini"
                @click="showProgressBox"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 展示修改的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="eidtDialogVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="editFormRlues"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input label="详细地址" v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示物流的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="30%">
      <el-timeline>
        <!-- 时间线 -->
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './city_data2017_element.js'
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: '10'
      },
      // 总数据
      orderList: [],
      total: 0,
      // 展示修改的对话框
      eidtDialogVisible: false,
      // 修改表单的正则表达式
      editFormRlues: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      addressForm: {
        address1: [],
        address2: ''
      },
      cityData,
      progressVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 从后端获取数据
    getOrderList() {
      this.axios
        .get('orders', {
          params: this.queryInfo
        })
        .then(({ data: res }) => {
          this.total = res.data.total
          this.orderList = res.data.goods
        })
        .catch(() => {
          this.$message.error('获取数据失败')
        })
    },
    // 页面条数发生变化的函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 页码数发生变化的函数
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrderList()
    },
    // 展示修改的对话框
    showBox() {
      // this.$forceUpdate()
      this.eidtDialogVisible = true
    },
    addressDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    showProgressBox() {
      // this.axios
      //   .get('/kuaidi/804909574412544580', { jsonp: 'handleCallback' })
      //   .then(({ data: res }) => {
      //     this.progressInfo = res.data
      //     console.log(this.progressInfo)
      //   })
      //   .catch(() => {
      //     this.$message.error('获取物流失败')
      //   })
      this.progressVisible = true
    }
  }
}
</script>

<style scoped>
</style>
