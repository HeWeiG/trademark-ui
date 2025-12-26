import { createRouter, createWebHistory } from 'vue-router'
import { createAuthGuard } from './guards/auth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: { title: '登录', hidden: true }, // 不在菜单中显示
      component: () => import('../views/user/Login.vue'),
      
    },{
      path: '/',
      name: 'home',
      meta: { title: '首页', icon: 'House' },
      component: () => import('../views/home/Index.vue')
    },
    {
      path: '/trademark',
      name: 'trademark',
      meta: { title: '分类管理', icon: 'Collection' },
      component: () => import('../views/classes/Index.vue')
    },
    // {
    //   path: '/transaction',
    //   name: 'transaction',
    //   meta: { title: '交易管理', icon: 'Money' },
    //   component: () => import('../views/TransactionView.vue')
    // },
    // {
    //   path: '/user',
    //   name: 'user',
    //   meta: { title: '用户管理', icon: 'User' },
    //   component: () => import('../views/UserView.vue')
    // },
    // {
    //   path: '/system',
    //   name: 'system',
    //   meta: { title: '系统设置', icon: 'Setting' },
    //   component: () => import('../views/SystemView.vue')
    // }
  ],
})
// 应用路由守卫
router.beforeEach(createAuthGuard())
export default router
