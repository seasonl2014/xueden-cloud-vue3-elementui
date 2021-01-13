/**
 * 封装菜单树形结构
 * @param {any} array
 * @returns {Array}
 * @author LiQingSong
 */
import {MenuTreeDataType} from "@/views/system/menu/list/data";
import {RoutesDataItem} from "@/utils/routes";

// 生成用户所具有的树形菜单
export function generateUserMenusTree<T>(dataMenus: Array<T>): Array<RoutesDataItem> {
  const IndexLayoutRoutes: Array<RoutesDataItem> = []

  return IndexLayoutRoutes;
}

// 获取子菜单函数
export const  getMenuChildren = (array: any) => {
  const menuChildren: any = [];
  for (const arr of array) {//循环获取子节点
    const child: MenuTreeDataType= {
      value: arr.id,
      label: `${ arr.name }`,
    }
    if(arr.children.length > 0 && arr.isMenu!==0){
      child.children =getMenuChildren(arr.children)
    }
    menuChildren.push(child);
  }
  return menuChildren;
}

// 自定义生成树形菜单结果函数
export function generateMenusTree<T>(dataMenus: Array<T>): Array<MenuTreeDataType> { //遍历树  获取id数组
  const menusList: Array<MenuTreeDataType> = [];

  for (let index = 0, len = dataMenus.length; index < len; index += 1) {
    const menu: any =  dataMenus[index]
    console.info("menudata遍历数据：",menu.parentId)
    if(menu.parentId===null){ //判断是否为顶层节点
      const parentMenu: MenuTreeDataType= {
        value: menu.id,
        label: `${ menu.name }`,
      }

      if(menu.children.length>0){
        parentMenu.children = getMenuChildren(menu.children)
      }
      menusList.push(parentMenu);
    }

  }
  return menusList;
}

