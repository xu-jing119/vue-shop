<template>
  <div>
     <Mbx nav1='商品管理' nav2='商品列表'></Mbx>
      <el-card>
        <!-- 商品搜索和添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model='queryInfo.query' clearable @clear='getGoodsData'>
            <el-button slot="append" icon="el-icon-search" @click='getGoodsData'></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click='goAddGoods'>添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
          <el-table-column type='index'></el-table-column>
          <el-table-column label='商品名称' prop='goods_name'></el-table-column>
          <el-table-column width='95px' label='商品价格(元)' prop='goods_price'></el-table-column>
          <el-table-column width='70px' label='商品重量' prop='goods_weight'></el-table-column>
          <el-table-column width='140px' label='创建时间' prop='add_time'>
              <template slot-scope='scope'>
                  {{scope.row.add_time | formDate}}
              </template>
          </el-table-column>
          <el-table-column width='130px' label='操作'>
              <template slot-scope='scope'>
              <el-button type="primary" size='mini' icon="el-icon-edit"></el-button>
              <el-button type="danger" size='mini' icon="el-icon-delete" @click='removeGoods(scope.row.goods_id)'></el-button>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页功能 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
    </el-pagination>
      </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        queryInfo:{
            query:'',
            pagenum:1,
            pagesize:10
        },
        goodsList:[],
        total:0
    }
  },
  created(){
      this.getGoodsData()
  },
  methods: {
    async getGoodsData(){
        const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
        if(res.meta.status!==200){
            return this.$message.error('获取数据失败')
        }
        // console.log(res.data);
        this.goodsList = res.data.goods
        this.total=res.data.total
      },
      handleSizeChange(newSize){
          this.queryInfo.pagesize = newSize
          this.getGoodsData()
      },
      handleCurrentChange(newPage){
          this.queryInfo.pagenum = newPage
          this.getGoodsData()
      },
    //   删除商品
  async removeGoods(key){
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm'){
            return this.$message.error('已取消删除')
        }
        const {data:res} = await this.$http.delete(`goods/${key}`)
        if(res.meta.status!==200){
             return this.$message.error('删除失败')
        }
        this.$message.success('删除成功!')
        this.getGoodsData()
    },
    goAddGoods(){
        this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
