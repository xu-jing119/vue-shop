<template>
  <div>

      <Mbx nav1='权限管理' nav2='权限列表'></Mbx>
      <!-- 卡片区域 -->
      <el-card>
           <el-table :data="rightList" border stripe>
      <el-table-column type='index' label="编号"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
               <el-tag type="success" v-else-if="scope.row.level === '1'">等级二</el-tag>
              <el-tag type="warning" v-else>等级三</el-tag>
          </template>
      </el-table-column>
           </el-table>
      </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
       rightList:[]
}
  },
  created(){
      this.getRight()
  },
  methods: {
    async getRight(){
     const {data:res} = await this.$http.get('rights/list')
     if(res.meta.status!==200){
         return this.$message.error(res.meta.msg)
     }
     this.rightList = res.data
    //  console.log(this.rightList);
     
     }
  }
}
</script>

<style lang="less" scoped>
</style>
