<template>
    <div id="indexlayout">
        <left
          :collapsed="collapsed"
          :topNavEnable="topNavEnable"
          :belongTopMenu="belongTopMenu"
          :defaultActive="defaultActive"
          :menuData="permissionMenuData"
        >
        </left>

        <div
          id="indexlayout-right"
          :class="{'fiexd-header': headFixed}"
        >

            <right-top
              :collapsed="collapsed"
              :topNavEnable="topNavEnable"
              :belongTopMenu="belongTopMenu"
              :toggleCollapsed="toggleCollapsed"
              :breadCrumbs="breadCrumbs"
              :menuData="permissionMenuData"
            >
            </right-top>

            <div class="indexlayout-right-main">
                <permission :roles="routeItem.roles">
                  <router-view></router-view>
                </permission>
                <right-footer></right-footer>
            </div>

        </div>

        <settings></settings>

    </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted,ref,reactive } from "vue";
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { StateType as GlobalStateType } from '@/store/global';
import {CurrentUser, StateType as UserStateType} from "@/store/user";
import {
  vueRoutes, RoutesDataItem, getRouteItem, getSelectLeftMenuPath,
  formatRoutePathTheParents, getRouteBelongTopMenu, getBreadcrumbRoutes,
  BreadcrumbType, getPermissionMenuData
} from '@/utils/routes';
import { mergeUnique as ArrayMergeUnique } from '@/utils/array';
import useTitle from '@/composables/useTitle';
import IndexLayoutRoutes from './routes';
import Permission from '@/components/Permission/index.vue';
import Left from './components/Left.vue';
import RightTop from './components/RightTop.vue';
import RightFooter from './components/RightFooter.vue';
import Settings from "./components/Settings.vue";
import { ResponseData } from '@/utils/request';
import {TableListItem} from "@/views/system/menu/list/data";
import { buildMenus } from "@/services/user";
interface IndexLayoutSetupData {
  collapsed: boolean;
  toggleCollapsed: () => void;
  topNavEnable: boolean;
  belongTopMenu: string;
  headFixed: boolean;
  defaultActive: string;
  breadCrumbs: BreadcrumbType[];
  permissionMenuData: RoutesDataItem[];
  routeItem: RoutesDataItem;
}

export default defineComponent({
    name: 'IndexLayout',
    components: {
        Permission,
        Left,
        RightTop,
        RightFooter,
        Settings
    },
  setup: function (): IndexLayoutSetupData {
    const store = useStore<{
      global: GlobalStateType;
      user: UserStateType;
    }>();

    const route = useRoute();

    const userMenuData = computed<RoutesDataItem[]>(() => store.state.user.currentUserMenu);

    /*const userMenuData = computed<RoutesDataItem[]>({
        get: () => store.state.user.currentUserMenu,
        set: () => {
          buildMenus().then(res => {
            console.info('res', res.data)
            userMenuData.value = res.data
            store.commit('user/saveCurrentUserMenu', res.data || {});
          })
        }
    });*/

/*    if(userMenuData.value.length===0){
      buildMenus().then(res => {
        console.info('res', res.data)
        userMenuData.value = res.data
        store.commit('user/saveCurrentUserMenu', res.data || {});
      })
      console.info("计算属性userMenuData没有值")

    }*/

    const menuData: RoutesDataItem[] = vueRoutes(IndexLayoutRoutes);

    // 当前路由 item
    const routeItem = computed<RoutesDataItem>(() => getRouteItem(route.path, menuData));

    // 有权限的菜单
    const permissionMenuData = computed<RoutesDataItem[]>(() => getPermissionMenuData(store.state.user.currentUser.roles, menuData));

    // 当前路由的顶部菜单path
    const belongTopMenu = computed<string>(() => getRouteBelongTopMenu(routeItem.value))

    // 当前路由的父路由path[]
    const routeParentPaths = computed<string[]>(() => formatRoutePathTheParents(routeItem.value.path));

    // 收缩左侧
    const collapsed = computed<boolean>(() => store.state.global.collapsed);
    const toggleCollapsed = (): void => {
      store.commit('global/changeLayoutCollapsed', !collapsed.value);
    }

    // 右侧顶部导航是否开启
    const topNavEnable = computed<boolean>(() => store.state.global.topNavEnable);

    // 右侧顶部是否固定
    const headFixed = computed<boolean>(() => store.state.global.headFixed);


    // 左侧选择的菜单
    const defaultActive = computed<string>(() => getSelectLeftMenuPath(routeItem.value));


    // 面包屑导航
    const breadCrumbs = computed<BreadcrumbType[]>(() => getBreadcrumbRoutes(routeItem.value, routeParentPaths.value, menuData));

    // 设置title
    useTitle(routeItem);

   /* const getCurrentUserMenu = async () => {
      let currentUserMenu: any[] = [];
      const response: ResponseData = await store.dispatch('user/fetchCurrentUserMenu');
      const {data, success} = response;
      currentUserMenu = IndexLayoutRoutes.concat(data)
      store.commit('user/saveCurrentUserMenu', currentUserMenu || {});
    }*/

    onMounted(() => {
      // getCurrentUserMenu()
    })

    return {
      collapsed: collapsed as unknown as boolean,
      toggleCollapsed,
      topNavEnable: topNavEnable as unknown as boolean,
      belongTopMenu: belongTopMenu as unknown as string,
      headFixed: headFixed as unknown as boolean,
      defaultActive: defaultActive as unknown as string,
      breadCrumbs: breadCrumbs as unknown as BreadcrumbType[],
      permissionMenuData: permissionMenuData as unknown as RoutesDataItem[],
      routeItem: routeItem as unknown as RoutesDataItem,
      /*currentUserMenu: currentUserMenu as unknown as RoutesDataItem[]*/
    }


  }
})
</script>
<style lang="scss">
@import '../../assets/css/variables.scss';
#indexlayout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
#indexlayout-right {
  position: relative;
  flex: 1;
  overflow: auto;
  background-color: $mainBgColor;
  &.fiexd-header {
    display: flex;
    flex-direction: column;
    .indexlayout-right-main {
      flex: 1;
      overflow: auto;
    }
  }
}
.indexlayout-main-conent {
  margin: 24px;
  position: relative;
}
</style>
