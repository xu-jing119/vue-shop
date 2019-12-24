<template>
  <div>
       <Mbx nav1='商品管理' nav2='参数列表'></Mbx>
        <el-card>
           <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" :closable='false' show-icon></el-alert>
           <el-row class='row_opt'>
             <el-col>
               <span>选择商品分类:</span>
                <el-cascader v-model="selectCate" :options="cateList" :props="propsCate" @change="selectCateChange"></el-cascader>
             </el-col>
           </el-row>
           <!-- Tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <!-- 动态参数模块 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size='mini' :disabled='isDisabled' @click='addDialogVisible=true'>动态参数</el-button>
      <!-- 动态参数表格 -->
       <el-table :data="manyTableData" border stripe>
          <el-table-column type="expand" >
            <template slot-scope='scope'>
            <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='attrClosed(i,scope.row)'>{{item}}</el-tag>
            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop='attr_name'></el-table-column>
          <el-table-column label="操作">
            <template slot-scope='scope'>
              <el-button type="primary" size='mini' icon="el-icon-edit" @click='editparamsDate(scope.row.attr_id)'></el-button>
              <el-button type="danger" size='mini'  icon="el-icon-delete" @click='removeParams(scope.row.attr_id)' ></el-button>
            </template>
          </el-table-column>
       </el-table>
    </el-tab-pane>
    <!-- 静态属性模块 -->
    <el-tab-pane label="静态属性" name="only">
      <el-button type="primary" size='mini' :disabled='isDisabled' @click='addDialogVisible=true'>静态属性</el-button>
       <!-- 静态属性 -->
       <el-table :data="onlyTableData" border stripe>
           <el-table-column type="expand" >
            <template slot-scope='scope'>
            <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='attrClosed(i,scope.row)'>{{item}}</el-tag>
            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop='attr_name'></el-table-column>
          <el-table-column label="操作">
            <template slot-scope='scope'>
              <el-button type="primary" size='mini' icon="el-icon-edit"  @click='editparamsDate(scope.row.attr_id)'></el-button>
              <el-button type="danger" size='mini'  icon="el-icon-delete" @click='removeParams(scope.row.attr_id)'></el-button>
            </template>
          </el-table-column>
       </el-table>
    </el-tab-pane>
  </el-tabs>
        </el-card>
        <!-- 添加参数弹出框 -->
        <el-dialog :title="'修改'+titleText" :visible.sync="addDialogVisible" width="50%" @close='addDialogClosed'>
  <el-form ref="formRef" :model="addForm" label-width="100px" :rules='addFormRules'>
  <el-form-item :label="titleText" prop='attr_name'>
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑参数弹出框 -->
       <!-- 添加参数弹出框 -->
        <el-dialog :title="'添加'+titleText" :visible.sync="editDialogVisible" width="50%" @close='editDialogClosed'>
  <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules='editFormRules'>
  <el-form-item :label="titleText" prop='attr_name'>
    <el-input v-model="editForm.attr_name"></el-input>
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
      cateList:[],
      selectCate:'',
      propsCate:{
         expandTrigger: 'hover',
         value:'cat_id',
         label:'cat_name',
         children:'children'
      },
      // tab页签区域 默认显示第一条
      activeName:'many',
      manyTableData:[],
      onlyTableData:[],
      addDialogVisible:false,
      addForm:{
        attr_name:''
      },
      addFormRules:{
        attr_name:[
           { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible:false,
      editForm:{},
      editFormRules:{
        attr_name:[
           { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
     
    }
  },
  created(){
    this.getCateList()
  },
  methods: {
 async getCateList(){
  const {data:res} = await this.$http.get('categories')
  if(res.meta.status!==200){
    return this.$message.error('获取分类列表失败')
  }
  this.cateList = res.data
  console.log(res);
  
},
selectCateChange(){
  this.getChange()
},
handleTabClick(){
// console.log(this.activeName);
 this.getChange()
},
// 获取参数列表数据
async getChange(){
  // console.log(this.selectCate);
  if(this.selectCate.length!==3){
    this.selectCate=[]
    this.manyTableData=[]
    this.onlyTableData=[]
    return
  }
  const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
  if(res.meta.status!==200){
    return this.$message.error('获取参数列表失败')
  }
  res.data.forEach(item=>{
    // 判断item.attr_vals是否存在 如果存在就分割 不存在就返回一个空数组
    item.attr_vals = item.attr_vals == '' ? [] : item.attr_vals.split(' ')
    item.inputVisible=false
    item.inputValue=''
  })
 // console.log(res.data);
  
  // console.log(res.data);
  if(this.activeName==='many'){
    // 获取动态列表数据
    this.manyTableData =res.data
  }else{
    // 获取静态列表数据
    this.onlyTableData =res.data

  }
},
addDialogClosed(){
  this.$refs.formRef.resetFields()
},
// 添加参数
addParams(){
  this.$refs.formRef.validate(async valid=>{
    if(!valid) return
    const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
      attr_name:this.addForm.attr_name,
      attr_sel:this.activeName
      })
      if(res.meta.status!==201){
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.addDialogVisible = false
      this.getChange()
     // console.log(res);
      
  
  })
},
async editparamsDate(key){
  const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${key}`,{params:{
    attr_sel:this.activeName
  }})
  if(res.meta.status!==200){
    return this.$message.error('获取参数失败')
  }
  this.editForm = res.data
  
 this.editDialogVisible=true
},
editParams(){
   this.$refs.editFormRef.validate(async valid=>{
    if(!valid) return
    const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
      attr_name:this.editForm.attr_name,
      attr_sel:this.activeName
      })
      if(res.meta.status!==200){
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
      this.editDialogVisible = false
      this.getChange()
})
},
editDialogClosed(){
   this.$refs.editFormRef.resetFields()
  },
 async removeParams(key){
  const confirmResult =  await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm'){
          return this.$message.info('已取消删除')
        }
        const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${key}`)
         if(res.meta.status!==200){
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getChange()
  },
 async handleInputConfirm(row){
    // 焦点离开时 去除空格 表单内容清空
    if(row.inputValue.trim().length===0){
      row.inputValue=''
      row.inputVisible=false
      return
    }
    // 如果添加的参数合法
    row.attr_vals.push(row.inputValue)
    row.inputValue=''
    row.inputVisible=false
    // 保存到数据库
  this.attrData(row)
    
  },
  // 封装保存数据库函数
  async attrData(row){
     // 发送请求 保存数据
  const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
    attr_name:row.attr_name,
    attr_sel:row.attr_sel,
    attr_vals:row.attr_vals.join(' ')
  })
  if(res.meta.status!==200){
    return this.$message.error('添加参数失败')
  }
  this.$message.success('添加/删除参数成功!')
  },
  // 删除参数可选项
  attrClosed(key,row){
    console.log(row.attr_vals);
    
    row.attr_vals.splice(key,1)
    // 保存到数据库
    this.attrData(row)
  },
  showInput(row){
    row.inputVisible=true
    // 焦点出现
     this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
  }
},

  computed:{
    isDisabled(){
     if(this.selectCate.length!==3){
      return true
      }
      return false
    },
    cateId(){
      if(this.selectCate.length===3){
        return this.selectCate[2]
      }
      return null
    },
    titleText(){
       if(this.activeName==='many'){
         return '动态参数'
      }else{
     return '静态属性'
       }
    }
  }

}
</script>

<style lang="less" scoped>
.row_opt{
  margin-top: 20px
}
.el-cascader{
  margin-left:15px
}
.el-tag{
  margin-right: 15px
}
.input-new-tag{
  width: 120px;
}
</style>
