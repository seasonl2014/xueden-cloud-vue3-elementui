import router from "@/config/routes";
import UserModel from "@/store/user";
import {buildMenus} from "@/services/user";
import {RoutesDataItem} from "@/utils/routes";
import {generateLeftAndTopMenusTree} from "@/utils/menudata";
import {getToken} from "@/utils/localToken";

router.beforeEach((to, from, next) => {
    // 获取本地token
    getToken().then(r => {
        console.info("当前token值是",r)
        if(r===null){
            next()
        }else{
            if(to.path === '/login'){
                return next()
            } else {
                if(UserModel.state.currentUserMenu.length===0){
                    buildMenus().then((res: { data: unknown[] }) => {
                        const menusList: Array<RoutesDataItem> = generateLeftAndTopMenusTree(res.data)
                        console.info('当前用户菜单为空开始从数据库获取数据:', menusList)
                        UserModel.state.currentUserMenu = menusList
                        next()
                    })
                }else{
                    console.info("当前用户菜单不为空：",UserModel.state.currentUserMenu)
                    next()
                }

            }

        }
    })




})
