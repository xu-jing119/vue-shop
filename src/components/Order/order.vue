<template>
  <div>
     <Mbx nav1='订单管理' nav2='订单列表'></Mbx>
    <el-card>
      <el-row>
        <el-col :span='6'>
          <el-input placeholder="请输入内容">
             <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type='index'></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope='scope'>
            <el-tag type="success" v-if="scope.row.pay_status ==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
           </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
           <template slot-scope='scope'>
             {{scope.row.create_time | formDate}}
           </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope='scope'>
          <el-button type="primary" size='mini' icon="el-icon-edit" @click='showBox'></el-button>
          <el-button type="success" size='mini' icon="el-icon-location" @click='showProgressBox'></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 展示修改地址对话框 -->
      <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close='addressClosed'>
      <el-form :model="addressForm" :rules="addressFormRules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
         <el-cascader v-model="addressForm.address1" :options="CityData"></el-cascader>
         </el-form-item>
         <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
         </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
       <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展示物流进度对话框 -->
      <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
       <!-- 时间线 -->
       <el-timeline>
          <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
              {{activity.context}}
           </el-timeline-item>
     </el-timeline>
    </el-dialog>
      <!-- 分页功能 -->
       <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import CityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      total:0,
      orderList:[],
      addressVisible:false,
      addressForm:{
        address1:[],
        address2:''
      },
      addressFormRules:{
        address1:[
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2:[
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      CityData:CityData,
      progressDialogVisible:false,
      progressInfo:[]
    }
  },
  created(){
    this.getOrder()
  },
  methods: {
  async getOrder(){
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
      if(res.meta.status!==200){
        return this.$message.error('获取数据失败')
      }
      this.total=res.data.total
      this.orderList = res.data.goods
      console.log(res.data); 
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getOrder()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getOrder()
    },
    // 展示修改操作对话框
    showBox(){
      this.addressVisible=true
    },
    addressClosed(){
      this.$refs.ruleFormRef.resetFields()
    },
   async showProgressBox(){
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      if(res.meta.status!==200){
        return this.$message.error('获取物流信息失败')
      }
      this.progressInfo = res.data
      this.progressDialogVisible=true
      console.log( res.data);
      
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
