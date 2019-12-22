<template>
  <div>
    <Mbx nav1="权限管理" nav2="权限列表"></Mbx>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key='item1.id' :class="['bdBottom',i1 ==0 ? 'bd' : '','vel']">
              <!-- 一级权限 -->
              <el-col :span='5'>
                <el-tag closable @close='removeRloesInfo(scope.row,item1.id)'>{{ item1.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span='19'>
                <!-- 二级权限for循环 -->
                <el-row  v-for='(item2,i2) in item1.children' :key='item2.id' :class="[i2==0? '':'bd','vel']">
                  <el-col :span='6'>
                    <el-tag  type="success" closable @close='removeRloesInfo(scope.row,item2.id)'>{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span='18'>
                      <el-tag  type="warning"  v-for='item3 in item2.children' :key='item3.id' closable @close='removeRloesInfo(scope.row,item3.id)'>{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-tooltip effect="dark" content="分配角色 " placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click='showSetRightDialog(scope.row)'>分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
     <!-- 分配权限弹出框 -->
          <el-dialog title="提示" :visible.sync="SetRightDialogVisible" width="50%" @close='SetRightDialogclose'>
  <!-- 树形结构 -->
  <el-tree :data="rightList" :props="treeProps"  show-checkbox node-key='id' default-expand-all :default-checked-keys='lefKeys' ref='treeRef'></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="SetRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      SetRightDialogVisible:false,
      rightList:[],
      treeProps:{
        label:'authName',
        children:'children'
      },
      lefKeys:[],
      roleId:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.roleList = res.data
    },
   async removeRloesInfo(roles,key){
     const confirmRules = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmRules !=='confirm'){
          return this.$message.info('已取消删除')
        }
        const {data:res}= await this.$http.delete(`roles/${roles.id}/rights/${key}`)
        if(res.meta.status!==200){
          return this.$message.error('删除失败')
        }
        roles.children=res.data
    },
    async showSetRightDialog(role){
      this.roleId = role.id
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !==200){
        return this.$message.error('分配失败')
      }
      this.rightList=res.data
      // console.log(res.data);
      // 递归获取三级节点的id
     this.getLefKeys(role,this.lefKeys)
      this.SetRightDialogVisible=true
    },
    getLefKeys(node,arr){
      // 如果当前的节点不包括children 则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>
        this.getLefKeys(item,arr)
      )
    },
    SetRightDialogclose(){
      // 点击关闭分配权限弹出框时  重置获取节点id的数组
      this.lefKeys=[]
    },
   async allotRights(){
      const keys =[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr=keys.join(',')
      // console.log(idStr);
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.SetRightDialogVisible = false
      this.getRolesList()
      
    }
  }
}
</script>

<style lang="less" scoped>
    .el-tag{
      margin:7px
    }
    .bdBottom {
      border-bottom:1px solid #ccc
    }
    .bd {
       border-top:1px solid #ccc
    }
    .vel{
      display:flex;
      align-items: center
    }
</style>
