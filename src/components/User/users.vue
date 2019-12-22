<template>
  <div>
    <!-- 面包屑导航区 -->
    <Mbx nav1='用户管理' nav2='用户权限'></Mbx>
    <!-- 卡片视图区 -->

    <el-card>
        <!-- 用户添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model='userInfo.query' clearable @clear='getUser'>
            <el-button slot="append" icon="el-icon-search" @click='getUser'></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click='addDialogVisible=true'>添加用户</el-button>
        </el-col>
        <!-- 添加用户对话框显示区域 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close='addDialogClose'>
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px">
            <el-form-item label="用户名称" prop="username">
                 <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                 <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                 <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                 <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
         </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
      </el-row>
      <!-- 用户展示区域 -->
      <el-table :data="userList" stripe border>
      <el-table-column type='index' label="编号"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column label="状态">
          <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change='userStateChange(scope.row)'>
              </el-switch>
          </template>
      </el-table-column>
      <el-table-column label="操作"  width='180px'>
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click='editShowDialog(scope.row.id)'></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click='removeUserInfo(scope.row.id)'></el-button>
             <el-tooltip effect="dark" content="分配角色 " placement="top" :enterable='false'>
                <el-button type="warning" size="mini" icon="el-icon-setting"  @click='setRoles(scope.row)'></el-button>
            </el-tooltip>
           
          </template>
      </el-table-column>
      </el-table>
      <!-- 修改用户对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close='editDialogClose'>
     <el-form :model="editForm" ref="editFormRef" label-width="70px" :rules="addRules">
            <el-form-item label="用户名称">
               <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                 <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                 <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
         </el-form>
   <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo">确 定</el-button>
  </span>
</el-dialog>
        <!-- 分页功能 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="userInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="userInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 角色分配 -->
        <el-dialog title="提示" :visible.sync="rolesDialogVisible" width="50%" @close='rolesClose'>
 <div>
   <p>当前的用户:{{rolesInfo.username}}</p>
   <p>当前的角色:{{rolesInfo.role_name}}</p>
   <p>分配新角色:
      <el-select v-model="newRoles" placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
   </p>
 </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoles">确 定</el-button>
  </span>
</el-dialog>
    </el-card>
    
  </div>
</template>

<script>
export default {
  data() {
    // 验证手机规则
    var checkMobile = (rule,value,callback)=>{
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if(regMobile.test(value)){
        // 如果表达式为真 手机号合法
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证邮箱规则
     var checkEmail = (rule,value,callback)=>{
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if(regEmail.test(value)){
        // 如果表达式为真 邮箱合法
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
        userInfo: {
            query:'',
            // 表示当前页
            pagenum:1,
            // 表示每页显示的条数
            pagesize:2
        },
        userList:[],
        total:0,
        // 控制添加用户对话框的显示与隐藏
        addDialogVisible:false,
          // 新增用户信息
        addForm:{
            username:'',
            password:'',
            email:'',
            mobile:'',
        },
        // 控制修改用户对话框的显示与隐藏
        editDialogVisible:false,
        editForm: {},
        rolesDialogVisible:false,
        rolesInfo:{},
        rolesList:[],
        newRoles:'',
      
        // 新增用户规则
        addRules:{
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
          // 密码验证
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator:checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {validator:checkMobile, trigger: 'blur'}
        ]
    
        }
    }
  },
  created() {
      this.getUser()
  },
  methods: {
     async getUser(){
         const{data:res} =await this.$http.get('users',{params:this.userInfo})
        //  console.log(res)
         if(res.meta.status!==200){
             return this.$message.error(res.meta.msg)
         }
         this.userList= res.data.users
         this.total = res.data.total
      },
      handleSizeChange(newSize){
          this.userInfo.pagesize = newSize
          this.getUser()
      },
      handleCurrentChange(newCurrent){
          this.userInfo.pagenum = newCurrent
          this.getUser()
      },
    //   状态更改监听
      async userStateChange(newUserInfo){
        //   console.log(newUserInfo)
        const{data:res} = await this.$http.put(`users/${newUserInfo.id}/state/${newUserInfo.mg_state}`)
        if(res.meta.status !==200){
            newUserInfo.mg_state = !newUserInfo.mg_state
            return this.$message.error('更新用户状态失败')
        }
      },
      addDialogClose(){
        // 初始化添加表单
        this.$refs.addFormRef.resetFields()
      },
      addUser(){
         this.$refs.addFormRef.validate(async valid=>{
           if(!valid) return
           const {data:res} = await this.$http.post('users',this.addForm)
           if(res.meta.status!==201){
             this.$message.error('添加用户失败')
           }
           this.$message.success('添加用户成功')
          //  隐藏添加用户对话框
          this.addDialogVisible = false
          // 重新渲染页面 获取新的用户列表
          this.getUser()
         })
      },
     async editShowDialog(key){
        const {data:res} = await this.$http.get('users/' + key)
        if(res.meta.status !==200){
         return this.$message.error('查询用户信息失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
        // console.log(key)
      },
      editDialogClose(){
        // 初始化修改表单
        this.$refs.editFormRef.resetFields()
      },
      editUserInfo(){
        // 验证是否通过
         this.$refs.editFormRef.validate(async valid=>{
           if(!valid) return
          const {data:res} = await this.$http.put('users/' + this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
          if(res.meta.status!==200){
          return this.$message.error('修改用户信息失败')
         }
          //  隐藏修改框
        this.editDialogVisible = false
        // 更新页面
         this.getUser()
        //  提示修改成功
        this.$message.success('修改用户信息成功')
         }) 
      },
      async removeUserInfo(key){
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // console.log(confirmResult);如果点击确定返回值为字符串confirm,如果点击取消 返回值为字符串cancel
        
        if(confirmResult != 'confirm'){
          return this.$message.info('已取消删除')
        }
      //  console.log('已删除');
      const {data:res} = await this.$http.delete('users/'+key)
        // console.log(res);
        if(res.meta.status!==200){
          // 删除失败
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getUser() 
      },
     async setRoles(users){
        this.rolesInfo = users
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status!==200){
          return this.$message.error('分配成功')
        }
        // console.log(res);
        
        this.rolesList = res.data
        this.rolesDialogVisible=true
      },
     async saveRoles(){
        if(!this.newRoles){
          return this.$message.error('请分配角色')
        }
        const {data:res} = await this.$http.put(`users/${this.rolesInfo.id}/role`,{rid:this.newRoles})
        console.log(res);
        
        if(res.meta.status!==200){
          return this.$message.error('更新角色失败')
        }
        this.$message.success('更新角色成功')
        this.getUser()
        this.rolesDialogVisible = false
      },
      rolesClose(){
        this.newRoles=''
        this.rolesInfo={}
      }
  }
}
</script>

<style lang="less" scoped></style>
