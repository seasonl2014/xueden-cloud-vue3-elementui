import { RoutesDataItem } from "@/utils/routes";
import BlankLayout from '@/layouts/BlankLayout.vue';



const IndexLayoutRoutes: Array<RoutesDataItem> = [
  {
    icon: 'home',
    title: 'index-layout.menu.home',
    path: '/home',
    redirect: '/home/workplace',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: 'index-layout.menu.home.workplace',
        path: 'workplace',
        component: ()=> import('@/views/home/index.vue')
      },
      {
        icon: 'detail',
        title: 'index-layout.menu.home.video',
        path: 'http://java.goodym.cn/html/1610442125958.html',
        belongTopMenu: '/home',
        redirect: ''
      },
    ],
  },

  {
    icon: 'page',
    title: 'index-layout.menu.system',
    path: '/system',
    redirect: '/system/list',
    component: BlankLayout,
    children: [
      {
        icon: 'list',
        title: 'index-layout.menu.system.list',
        path: 'list',
        redirect: '/system/list/user',
        component: BlankLayout,
        children: [
          {
            title: 'index-layout.menu.system.list.user',
            path: 'user',
            component: ()=> import('@/views/system/user/list/index.vue'),
          },
          {
            title: 'index-layout.menu.system.list.roles',
            path: 'roles',
            component: ()=> import('@/views/system/roles/list/index.vue'),
          },
          {
            title: 'index-layout.menu.system.list.menu',
            path: 'menu',
            component: ()=> import('@/views/system/menu/list/index.vue'),
          },
          {
            title: 'index-layout.menu.system.list.log',
            path: 'log',
            component: ()=> import('@/views/system/log/list/index.vue'),
          },
        ],
      },
    ],
  },


  /*{
    icon: 'permissions',
    title: 'index-layout.menu.roles',
    path: '/roles',
    redirect: '/roles/all',
    component: BlankLayout,
    children: [
      {
        icon: 'detail',
        title: 'index-layout.menu.roles.all',
        path: 'all',
        component: ()=> import('@/views/roles/all/index.vue'),
      },
      {
        icon: 'detail',
        roles: ['user'],
        title: 'index-layout.menu.roles.user',
        path: 'user',
        component: ()=> import('@/views/roles/user/index.vue'),
      },
      {
        icon: 'detail',
        roles: ['test'],
        title: 'index-layout.menu.roles.test',
        path: 'test',
        component: ()=> import('@/views/roles/test/index.vue'),
      },
    ],
  },*/

];

export default IndexLayoutRoutes;
