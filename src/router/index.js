import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../components/User/users.vue'
import Rights from '../components/Power/rights.vue'
import Roles from '../components/Power/roles.vue'
import Cate from '../components/Goods/cate.vue'
import Params from '../components/Goods/params.vue'



Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, redirect:'/welcome',children:[
    {path:'/welcome',component:Welcome},
    {path:'/users',component:Users},
    {path:'/rights',component:Rights},
    {path:'/roles',component:Roles},
    {path:'/categories',component:Cate},
    {path:'/params',component:Params},

  ]}
]

const router = new VueRouter({
  routes
})

// 路由守卫 beforeEach
router.beforeEach((to,from,next) => {
// to表示 将要跳转的路径 from表示从哪个路径跳转而来 next表示放行 next()放行 next('/login)表示强制跳转的路径
// 如果访问的是登录页面 则放行
if(to.path==='/login') return next()
// 如果没有token值 强制跳转到登录页面 否则放行
const tokenStr = window.sessionStorage.getItem('token')
if(!tokenStr) return next('/login')
next()

})

export default router
