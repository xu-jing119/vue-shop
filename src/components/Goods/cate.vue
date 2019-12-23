<template>
  <div>
      <Mbx nav1='商品管理' nav2='商品分类'></Mbx>
      <el-card>
          <el-row>
            <el-col>
         <el-button type="primary" @click='addCate'>商品添加</el-button>
         <!-- 商品添加弹出框 -->
         <el-dialog
  title="添加分类"
  :visible.sync="addCateDialogVisible"
  width="50%" @close='addCateDialogClosed'>
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类:">
        <el-cascader
    v-model="selectedKeys"
    :options="parentsList"
    :props="propsParents"
    @change="parentsChange" clearable change-on-select></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateDialog">确 定</el-button>
  </span>
</el-dialog>
            </el-col>
         </el-row>
         <!-- 表格 -->
         <tree-table class='treeTable' :data='cateList' :columns="columns" show-index border :show-row-hover='false' :selection-type='false' :expand-type='false'>
             <!-- 是否有效 -->
             <template slot='isOk' slot-scope='scope'>
                 <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style='color:lightgreen'></i>
                 <i class="el-icon-error" v-else style='color:red'></i>
             </template>
             <!-- 排序 -->
              <template slot='order' slot-scope='scope'>
               <el-tag size='mini' v-if="scope.row.cat_level===0" >一级</el-tag>
               <el-tag size='mini' type="success" v-else-if="scope.row.cat_level===1" >二级</el-tag>
               <el-tag size='mini' type="warning" v-else>三级</el-tag>
             </template>
             <!-- 操作 -->
              <template slot='opt' slot-scope='scope'>
               <el-button type="primary" size='mini' icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size='mini' icon="el-icon-delete">删除</el-button>
             </template>
         </tree-table>
         <!-- 分页区域 -->
          <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        cateList:[],
        queryInfo:{
            type:3,
            pagenum:1,
            pagesize:5
            },
        total:0,
        columns:[{
            label:"分类名称",
            prop:"cat_name"
        },{
           label:"是否有效",
           type:'template',
           template:'isOk' 
        },{
           label:"排序",
           type:'template',
           template:'order' 
        },{
           label:"操作",
           type:'template',
           template:'opt' 
        }],
        addCateDialogVisible:false,
       addCateForm:{
           cat_name:'',
           cat_pid:0,
           cat_level:0
       },
       addCateFormRules:{
            cat_name:[{ required: true, message: '请输入分类名称', trigger: 'blur' }]
       },
       parentsList:[],
       selectedKeys:[],
       propsParents:{
           expandTrigger: 'hover',
           value:'cat_id',
           label:'cat_name',
           children:'children'
       }

    }
  },
  created(){
      this.getcateList()
  },
  methods: {
    async getcateList(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        // console.log(res)
        if(res.meta.status!==200){
            return this.$message.error('获取分类失败')
        }
        this.cateList = res.data.result
        this.total = res.data.total
      },
      handleSizeChange(newPage){
          this.queryInfo.pagesize=newPage
          this.getcateList()
      },
      handleCurrentChange(newCurrent){
          this.queryInfo.pagenum=newCurrent
          this.getcateList()
      },
      addCate(){
          this.getCateParents()
          this.addCateDialogVisible=true
      },
     async getCateParents(){
          const {data:res} = await this.$http.get('categories',{params:{type:2}})
          if(res.meta.status!==200){
              return this.$message.error('获取父级分类数据失败')
          }
         
          this.parentsList = res.data

      },
      parentsChange(){
          // console.log(this.selectedKeys)
          if(this.selectedKeys.length>0){
            //   父级分类的id
            this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
            // 为当前分类等级赋值
            this.addCateForm.cat_level=this.selectedKeys.length
            return
          }else{
              this.addCateForm.cat_pid=0
               this.addCateForm.cat_level=0
          }
      },
     async addCateDialog(){
          const {data:res} = await this.$http.post('categories',this.addCateForm)
          console.log(res);
          if(res.meta.status!==201){
              return this.$message.error('创建失败')
          }
          this.$message.success('创建成功')
          this.getcateList()
         this.addCateDialogVisible = false
          
      },
      addCateDialogClosed(){
          this.$refs.addCateFormRef.resetFields()
          this.selectedKeys=[]
           this.addCateForm.cat_pid=0
           this.addCateForm.cat_level=0
      }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 20px
}
.el-cascader{
    width: 100%;
}
</style>
