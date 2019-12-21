<template>
<!-- 主页 -->
  <el-container class='home_container'>
      <!-- 头部区域 -->
    <el-header>
        <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
        <!-- 左侧 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 按钮折叠 -->
          <div class='toggle-button' @click='toggleCollapse'>|||</div>
          <!-- 侧边菜单区域 -->
          <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff" unique-opened :collapse='isCollapse' :collapse-transition='false' router :default-active='activePath'>
      <!-- 一级菜单 -->
      <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单模板区域 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconlist[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="activeNavState('/'+subItem.path)"> 
            <!-- 二级菜单模板区域 -->
            <template slot="title">
                <!-- 二级菜单图标 -->
          <i class="el-icon-menu"></i>
          <!-- 文本 -->
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
        menuList:[],
        iconlist:{
            '125':'iconfont icon-users',
            '103':'iconfont icon-tijikongjian',
            '101':'iconfont icon-shangpin',
            '102':'iconfont icon-danju',
            '145':'iconfont icon-baobiao'
        },
        isCollapse:false,
        activePath:''
    }
  },
  created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('active')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
   async getMenuList() {
     const {data:res} = await this.$http.get('menus')
    //  console.log(res)
    if(res.meta.status!==200) return this.$message.error(res.meta.msg)
    this.menuList = res.data
    },
    toggleCollapse(){
        this.isCollapse = !this.isCollapse
    },
    activeNavState(active){
        window.sessionStorage.setItem('active',active)
        this.activePath = active
    }
  }
}
</script>

<style lang="less" scoped>
    .home_container {
        height: 100%;
    }
    .el-header {
        background-color: #373d41;
        display:flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        color:#fff;
        font-size: 20px;
        div {
            display:flex;
            align-items: center;
            span {
                margin-left: 15px
            }
        }
    }
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: none;
        }
    }
    .el-main {
        background-color: #eaedf1;
    }
    .iconfont {
        margin-right: 10px
    }
    .toggle-button {
        line-height: 24px;
        font-size: 10px;
        color:#fff;
        text-align: center;
        background-color: #4a5064;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
