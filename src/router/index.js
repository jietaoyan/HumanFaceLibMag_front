import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * 
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '项目信息', icon: 'dashboard' }
      },
      {
        path: 'prjUsers',
        name: 'prjUsers',
        hidden:true,
        component: () => import('@/views/dashboard/prjUsers'),
        meta: { title: '人员信息', icon: 'user' }
      },
      {
        path: 'prjGroups',
        name: 'prjGroups',
        hidden:true,
        component: () => import('@/views/dashboard/prjGroups'),
        meta: { title: '分组信息', icon: 'user' }
      }
    ]
  },

  {
    path: '/face',
    component: Layout,
    name: 'face',
    meta: { title: '人脸信息管理', icon: 'user' },
    children: [
      {
        path: 'version',
        name: 'version',
        component: () => import('@/views/face/fVersion'),
        meta: { title: '版本信息', icon: 'form' }
      },
      {
        path: 'detect',
        name: 'detect',
        component: () => import('@/views/face/detect'),
        meta: { title: '人脸检测', icon: 'face' }
      }
    ]
  },

  {
    path: '/setting',
    component: Layout,
    name: 'setting',
    meta: { title: '综合管理', icon: 'example' },
    children: [
      {
        path: 'allUsers',
        name: 'allUsers',
        component: () => import('@/views/setting/allUsers'),
        meta: { title: '所有用户', icon: 'users' }
      },
      {
        path: 'me',
        name: 'prjme',
        component: () => import('@/views/setting/prjme'),
        meta: { title: '所属项目', icon: 'link' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: { title: 'Nested', icon: 'nested' }
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
