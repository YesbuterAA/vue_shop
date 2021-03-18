<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <p>
        选择商品的分类：
        <el-cascader
          :options="CateList"
          :props="paramsProps"
          v-model="selectdCateKeys"
          @change="handleChange"
        ></el-cascader>
      </p>
      <!--tabs区域  -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格区域 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行区域 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- 动态添加标签属性 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEdiDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性区域 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 静态属性展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- 动态添加标签属性 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEdiDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹出对话框区域 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- form表单区域 -->
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- form表单区域 -->
      <el-form
        :model="editParamsForm"
        :rules="editParamsRules"
        ref="editParamsFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有商品分类列表的数组
      CateList: [],
      // 级联选择器的数据源键名属性
      paramsProps: {
        value: 'cat_id',
        label: 'cat_name',
        childern: 'children',
        expandTrigger: 'hover',
        checkStrictly: false
      },
      // 级联选择器中的v-model 绑定的属性 就是选中的id数组
      selectdCateKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      // 动态数据
      manyTableData: [],
      // 静态数据
      onlyTableData: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addParamsForm: {
        attr_name: ''
      },
      // 添加表单数据的验证规则
      addParamsRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ],
        onlyParams: [
          {
            required: true,
            message: '请输入静态属性名称',
            trigger: 'blur'
          }
        ]
      },
      // 修改参数对话框的隐藏与显示
      editDialogVisible: false,
      // 修改表单数据对象
      editParamsForm: {},
      // 修改表单数据验证规则
      editParamsRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有列表数据
    getCateList() {
      this.axios
        .get('categories')
        .then(({ data: res }) => {
          this.CateList = res.data
          // console.log(this.CateList)
        })
        .catch(() => {
          this.$message.error('获取商品分类列表失败')
        })
    },
    // 监听级联选择器中所选中时会发生改变的函数
    handleChange() {
      this.getParamsData()
    },
    // tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
      // console.log(this.activeName)
    },
    // 获取参数列表数据
    async getParamsData() {
      // 此时有个需求 不允许选中一二级分类 则需要判断这个数组中的长度 若不是3 则清空数组 处于未选中状态
      if (this.selectdCateKeys.length !== 3) {
        this.selectdCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        // 根据所选分类的id，和当前所处的面板，获取对应的参数
        const { data: res } = await this.axios
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: this.activeName }
          })
          .catch(() => {
            this.$message.error('获取数据失败')
          })
        if (this.activeName === 'many') {
          console.log(res.data)
          this.manyTableData = res.data
          // 这里是对attr_vals 进行分割 让字符串化成数组
          res.data.forEach(item => {
            // 当循环标签的时候 v-if v-model 都绑定了同一个值 这是不应该的 这时需要自定义一个属性 控制文本框的显示与隐藏
            item.inputVisible = false
            this.$set(item, 'inputValue', ' ')
            // console.log(item)
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          })
          // console.log(res.data)
          // console.log(res)
        } else {
          this.onlyTableData = res.data
          res.data.forEach(item => {
            item.attr_vals = item.attr_vals.split(' ')
          })
        }

        // console.log(this.selectdCateKeys)
        // 对参数列表中的数据分割成数组
      }
    },
    // 监听点击关闭对话框事件
    addDialogClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    // 监听点击添加参数确定按钮事件
    addParams() {
      this.$refs.addParamsFormRef.validate(valid => {
        if (!valid) return
        this.axios
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          })
          .then(({ data: res }) => {
            this.addDialogVisible = false
            this.getParamsData()
          })
          .catch(() => {
            this.$message.error('添加参数失败')
          })
      })
    },
    // 点击按钮，展示修改的对话框
    showEdiDialog(id) {
      this.axios
        .get(`categories/${this.cateId}/attributes/${id}`, {
          params: {
            attr_sel: this.activeName
          }
        })
        .then(({ data: res }) => {
          this.editParamsForm = res.data
        })
        .catch(() => {
          this.$message.error('获取数据失败')
        })
      this.editDialogVisible = true
    },
    // 监听关闭修改对话框的事件
    editDialogClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    // 监听修改对话框确定按钮
    editParams() {
      console.log(this.editParamsForm.attr_id)
      this.$refs.editParamsFormRef.validate(valid => {
        if (!valid) return
        this.axios
          .put(
            `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
            {
              attr_name: this.editParamsForm.attr_name,
              attr_sel: this.activeName
            }
          )
          .then(({ data: res }) => {
            this.getParamsData()
          })
          .catch(() => {
            this.$message.error('修改信息失败')
          })
      })
      this.editDialogVisible = false
    },
    // 根据id删除对应的参数项
    async removeParams(id) {
      // 弹出警告
      const confimResult = await this.$confirm(
        '此操作将永久删除该参数，是否继续',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confimResult)
      // 用户取消了删除的操作
      if (confimResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      this.axios
        .delete(`categories/${this.cateId}/attributes/${id}`)
        .then(({ data: res }) => {
          this.$message.success('删除参数成功')
          this.getParamsData()
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    // 动态添加标签 失去焦点或者按下enter都会触发的事件
    async handleInputConfirm(row) {
      console.log(row)
      // console.log(row.inputValue)
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // console.log(this.$refs.saveTagInput)
      // 需要发起请求，保存这次的操作
      const { data: res } = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    showInput(row, e) {
      this.$forceUpdate(e)
      // console.log(row)
      // console.log(row)
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
      // this.$nextTick(() => {
      //   console.log(this.$refs.saveTagInput)
      //   this.$refs.saveTagInput.$refs.input.focus()
      // })
    },
    // 将对attr_vals 的操作 保存到数据库
    async saveAttrVals(row) {
      const { data: res } = await this.axios.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    // 监听tags关闭事件
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果按钮需要被禁用，则返回true 否则返回false
    isBtnDisabled() {
      if (this.selectdCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateId() {
      if (this.selectdCateKeys.length === 3) {
        return this.selectdCateKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style scoped>
</style>
