import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import {TableDataType, TableListItem, TableListQueryParams, MenusDataType, RoleMenusDataItem} from './data.d';
import {
  queryList,
  queryMenusList,
  queryRoleMenusList,
  removeData,
  createData,
  detailData,
  updateData,
  saveMenuData,
} from './service';


export interface StateType {
    tableData: TableDataType;
    updateData: Partial<TableListItem>;
    menusData: MenusDataType;
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setTableData: Mutation<StateType>;
        setUpdateData: Mutation<StateType>;
        setMenusData: Mutation<StateType>;
        setMenusIdsData: Mutation<StateType>;
    };
    actions: {
        queryTableData: Action<StateType, StateType>;
        deleteTableData: Action<StateType, StateType>;
        createTableData: Action<StateType, StateType>;
        queryUpdateData: Action<StateType, StateType>;
        updateTableData: Action<StateType, StateType>;
        queryMenusTableData: Action<StateType, StateType>;
        queryRoleMenusTableData: Action<StateType, StateType>;
        saveMenuData: Action<StateType, StateType>;
    };
}
const initState: StateType = {
    tableData: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    },
    updateData: {},
    menusData: {
        menusList: [],
        menuIds: [],
    },
};

// 获取子菜单函数
function  getChildren(array: any) {
    const menuChildren: any = [];
    for (const arr of array) {//循环获取子节点
        const child= {
            id: arr.id,
            label: `${ arr.name }`,
            children: {}
        }
        if(arr.children.length > 0){
            child.children =getChildren(arr.children)
        }
        menuChildren.push(child);
    }
    return menuChildren;
}

// 自定义生成树形菜单结果函数
function  generateMenusTree(dataMenus: any){ //遍历树  获取id数组
    const menusList: any = [];
    for(const i in dataMenus){
        if(dataMenus[i].parentId==null){ //判断是否为顶层节点
            const parentMenu= {
                id: dataMenus[i].id,
                label: `${ dataMenus[i].name }`,
                children: {}
            }
            parentMenu.children = getChildren(dataMenus[i].children)
            menusList.push(parentMenu);
        }
    }
    return menusList;
}

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'ListTable',
    state: {
        ...initState
    },
    mutations: {
        setTableData(state, payload) {
            state.tableData = payload;
        },
        setUpdateData(state, payload) {
            state.updateData = payload;
        },
        setMenusData(state, payload) {
            state.menusData = payload;
        },
        setMenusIdsData(state, payload) {
            state.menusData.menuIds = payload.menuIds;
        },
    },
    actions: {
        // 获取所有角色数据
        async queryTableData({ commit }, payload: TableListQueryParams ) {
            try {
                const response: ResponseData = await queryList(payload);
                const { data } = response;
                commit('setTableData',{
                    ...initState.tableData,
                    list: data || [],
                    pagination: {
                      ...initState.tableData.pagination,
                      current: payload.page,
                      total: data.total || 0,
                    },
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        // 获取所有菜单数据
        async queryMenusTableData({ commit }, payload: TableListQueryParams ) {
            try {
                const response: ResponseData = await queryMenusList();
                const { data } = response;

                // 封装所有菜单数据
                let menusList: any = [];

                menusList = generateMenusTree(data)

                // console.info("封装后的菜单数据：",menusList)
                commit('setMenusData',{
                    ...initState.menusData,
                    menusList
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        // // 根据角色Id获取角色所具有的菜单
        async queryRoleMenusTableData({ commit }, payload: number ) {
            try {
                const response: ResponseData = await queryRoleMenusList(payload);
                const { data } = response;
                // console.info("获取角色所具有的菜单数据：",data.menuIds)
                // 封装角色所具有菜单数据
                const menuIds: any = data.menuIds.split(",");
                // console.info("封装后角色所具有的菜单数据：",menuIds)
                commit('setMenusIdsData',{
                   /* ...initState.menusData,*/
                    menuIds,
                });
                return true;
            } catch (error) {
                return false;
            }
        },

        // 保存角色菜单数据
        async saveMenuData({ commit }, payload) {
            try {
                console.info("index组件页面传过来的数据：",payload)
                const { roleId, menuIds } = payload;
                await saveMenuData(roleId, menuIds );
                return true;
            } catch (error) {
                return false;
            }
        },
        // 删除角色数据
        async deleteTableData({ commit }, payload: number ) {
            try {
                console.info("删除传过来的参数值：",payload)
                await removeData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
        // 新增角色数据
        async createTableData({ commit }, payload: Pick<TableListItem, "name" | "remarks" > ) {
            try {
                const response: ResponseData = await createData(payload);
                return response;
            } catch (error) {
                return false;
            }
        },
        // 获取需要修改的角色数据
        async queryUpdateData({ commit }, payload: number ) {
            try {
                const response: ResponseData = await detailData(payload);
                const { data } = response;
                commit('setUpdateData',{
                    ...initState.updateData,
                    ...data,
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        // 更新角色数据
        async updateTableData({ commit }, payload: TableListItem ) {
            try {
                const { id, ...params } = payload;
                const response: ResponseData = await updateData(id, { ...params });
                return response;
            } catch (error) {
                return null;
            }
        },
    }
};

export default StoreModel;
