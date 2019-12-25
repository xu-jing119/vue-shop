<template>
  <div>
    <Mbx nav1='商品管理' nav2='商品列表'></Mbx>
    <el-card>
         <el-alert title="添加商品信息" type="info" center show-icon :closable='false'></el-alert>
    <!-- 步骤条区域 -->
    <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
    </el-steps>
    <!-- tab标签页 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position='top'>
     <el-tabs v-model='activeIndex' :tab-position="'left'" :before-leave='beforeTabLeave' @tab-click='tabClicked'>
            <el-tab-pane label="基本信息" name='0'>
               <el-form-item label="商品名称" prop="goods_name">
                 <el-input v-model="addForm.goods_name"></el-input>
               </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                 <el-input v-model="addForm.goods_price"  type='number'></el-input>
               </el-form-item>
                 <el-form-item label="商品重量" prop="goods_weight">
                 <el-input v-model="addForm.goods_weight"   type='number'></el-input>
               </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                 <el-input v-model="addForm.goods_number"  type='number'></el-input>
               </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
               </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name='1'>
                 <el-form-item :label="item.attr_name" v-for='item in manyTabData' :key='item.attr_id'>
                     <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="cb" v-for='(cb,i) in item.attr_vals' :key='i' border></el-checkbox>
                    </el-checkbox-group>
               </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name='2'>
                <el-form-item :label="item.attr_name" v-for='item in onlyTabData' :key='item.attr_id'>
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name='3'>
                <!-- 图片上传功能 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers='headerObj' :on-success='handelSuccess'>
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name='4'>
              <!-- 富文本编辑器模板 -->
              <quill-editor v-model='addForm.goods_introduce'>
              </quill-editor>
               <el-button type="primary" class='addBtn' @click='add'>添加商品</el-button>
            </el-tab-pane>
     </el-tabs>
    </el-form>
    </el-card>
    <!-- 图片缩略图 -->
    <el-dialog title="图片效果" :visible.sync="dialogVisibleImg" width="50%">
  <img :src="previewFile" class='imgPreview'>
</el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
        activeIndex:'0',
        addForm:{
            goods_name:'',
            goods_price:0,
            goods_weight:0,
            goods_number:0,
            goods_cat:[],
            pics:[],
            // 商品内容详情
            goods_introduce:'',
            attrs:[]
        },
        addFormRules:{
            goods_name:[
               { required: true, message: '请输入商品名称', trigger: 'blur' }
            ],
            goods_price:[
               { required: true, message: '请输入商品价格', trigger: 'blur' }
            ],
            goods_weight:[
               { required: true, message: '请输入商品重量', trigger: 'blur' }
            ],
            goods_number:[
               { required: true, message: '请输入商品数量', trigger: 'blur' }
            ],
            goods_cat:[
               { required: true, message: '请输入商品数量', trigger: 'blur' }
            ]
        },
        cateList:[],
        cateProps:{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children:'children'
        },
        // 动态列表数据
        manyTabData:[],
        // 静态列表数据
        onlyTabData:[],
        // 图片上传地址
        uploadURL:"http://127.0.0.1:8888/api/private/v1/upload",
        headerObj:{
          Authorization: window.sessionStorage.getItem('token')
        },
        previewFile:'',
        // 图片缩略图的显示与隐藏
        dialogVisibleImg:false
    }
  },
  created(){
      this.getcateList()
  },
  methods: {
 async getcateList(){
        const {data:res} = await this.$http.get('categories')
        // console.log(res)
        if(res.meta.status!==200){
            return this.$message.error('获取分类列表失败')
        }
        this.cateList = res.data
      // console.log(this.cateList);
      
      },
    //   级联选择器选中项变化触发
      handleChange(){
        //   console.log(this.addForm.goods_cat);
          if(this.addForm.goods_cat.length!==3){
              this.addForm.goods_cat = []
          }
      },
      beforeTabLeave(activeName, oldActiveName){
        //   console.log('即将离开的tab栏'+oldActiveName);
        //   console.log('即将进入的tab栏'+activeName);
          if(oldActiveName=='0'&&this.addForm.goods_cat.length!==3){
             this.$message.error('请先选择分类参数')
              return false
          }   
      },
    //   点击tab栏时触发
    async tabClicked(){
        //  console.log(this.activeIndex);
        if(this.activeIndex==='1'){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
            // console.log(res);
            if(res.meta.status!==200){
                return this.$message.error('获取动态参数失败')
            }
            // console.log(res.data);
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals.length=== 0 ? [] : item.attr_vals.split(' ')
            })
            this.manyTabData=res.data 
        }else if(this.activeIndex==='2'){
             const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
            if(res.meta.status!==200){
                return this.$message.error('获取静态参数失败')
            }
             console.log(res.data);
            this.onlyTabData=res.data 
        }
         
     },
    //  点击缩略图时触发
     handlePreview(file){
       this.previewFile = file.response.data.url
       this.dialogVisibleImg=true
     },
    //  点击删除图片时触发
     handleRemove(file){
      // console.log(file);
      //  获取该图片的临时路径
      const filePath = file.response.data.tmp_path
      // 找到对应的图片的索引
     const index = this.addForm.pics.findIndex(item => item.pic === filePath)
    //  console.log(this.addForm.pics,index);
    // 删除对应索引的图片
     this.addForm.pics.splice(index,1)
     

     },
    //  图片上传成功时触发
     handelSuccess(response){
      //  console.log(response);
       const picInfo = {pic: response.data.tmp_path}
       this.addForm.pics.push(picInfo)
       // console.log(this.addForm.pics);
       
     },
     add(){
      //  console.log(this.addForm.goods_introduce);
      // 提交表单前 校验规则是否通过
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){
          return this.$message.error('请输入必要的表单项')
        }
      // 通过后 执行提交的业务逻辑
      // 深拷贝数组
     const form = _.cloneDeep(this.addForm)
    //  将数组goods_cat转换为以逗号分隔的字符串
     form.goods_cat =form.goods_cat.join(',')
    //  console.log(form);
    // 编辑动态数据
    this.manyTabData.forEach(item=>{
      const manyInfo = {
        attr_id:item.attr_id,
        attr_value:item.attr_vals.join(' ')
      }
      this.addForm.attrs.push(manyInfo)

    })
//  编辑静态数据
this.onlyTabData.forEach(item=>{
      const onlyInfo = {
        attr_id:item.attr_id,
        attr_value:item.attr_vals
      }
      this.addForm.attrs.push(onlyInfo)
    })
    form.attrs=this.addForm.attrs
    console.log(form);
    // 发起添加商品请求
    const {data:res} = await this.$http.post('goods',form)
     if(res.meta.status!==201){
       return this.$message.error('商品添加失败')
     }
     this.$message.success('商品添加成功')
     this.$router.push('/goods')
      })
       
     }
  },
  computed:{
      cateId(){
          if(this.addForm.goods_cat.length===3){
            return this.addForm.goods_cat[2]
          }
          return null
      }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox{
    margin:0 10px 0 0 !important
}
.imgPreview{
  width: 100%;
}
.addBtn{
  margin-top: 15px
}
</style>
