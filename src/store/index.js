import { createStore } from "vuex";
import Cookies from "js-cookie";
export default createStore({
    state: {
        isCollapse: false,
        currentMenu: null,
        menu:[],
        token:'',
        currentUser:'',
        currentUserProjectList:[],
        currentUserLevel:'',
        selectedProject:'',
    },
    mutations:{
        updateCollapse(state,payload){
            state.isCollapse = !state.isCollapse
        },
        selectMenu(state, val){
            if(val.name == 'home'){
                state.currentMenu = null
            }else{
                state.currentMenu = val
                // console.log('typeof ',typeof state.currentMenu);
            }
        },
        // 往浏览器中写菜单地址信息
        setMenu(state, val){
            state.menu = val
            localStorage.setItem('menu',JSON.stringify(val))
        },
        // 往router中写菜单地址信息
        addMenu(state, router){
            if(!localStorage.getItem('menu')){
                return
            }
            const menu = JSON.parse(localStorage.getItem('menu'))
            state.menu = menu

            const menuArry = []

            menu.forEach(item => {
                if(item.children){
                    item.children = item.children.map(item =>{
                        item.component = () => import(`../views/${item.url}.vue`)
                        return item
                    })
                    menuArry.push(...item.children)
                }else{
                    item.component = () => import(`../views/${item.url}.vue`)
                    menuArry.push(item)
                }
            });

            menuArry.forEach(item => {
                router.addRoute('home1',item)
            })
        },
        // 判断当前所在菜单选项
        setCurrentMenu(state,val){
            if (val !== 'home') {
                state.menu.forEach( (item) => {
                    if (item.name === val) {
                        state.currentMenu = item
                    }
                })
            }
        },
        // 清除菜单
        cleanMenu(state){
            state.menu = []
            localStorage.removeItem('menu')
        },
        // 设置token
        setToken(state,val){
            state.token = val
            //  创建一个有效时间为1天的Cookie
            Cookies.set('token',val,{expires:1})
        },
        // 清除token
        clearToken(state){
            state.token = ''
            Cookies.remove('token')
        },
        // 获取token
        getToken(state){
            state.token = state.token || Cookies.get('token')
        },

        // 存储当前用户
        setCurrentUser(state,val){
            state.currentUser = val
            localStorage.setItem('currentUser',JSON.stringify(val))
        },
        // 获取当前用户
        getCurrentUser(state){
            state.currentUser = JSON.parse(localStorage.getItem('currentUser'))
        },
        // 退出后，清除当前用户
        clearCurrentUser(state){
            state.currentUser = ''
            localStorage.removeItem('currentUser')
        },

        // 存储当前用户对某个项目的权限
        setCurrentUserLevel(state,val){
            state.currentUserLevel = val
            localStorage.setItem('currentUserLevel',JSON.stringify(val))
        },
        // 获取当前用户对某个项目的权限
        getCurrentUserLevel(state){
            state.currentUser = JSON.parse(localStorage.getItem('currentUserLevel'))
        },
        // 退出后，清除当前用户对某个项目的权限
        clearCurrentUserLevel(state){
            state.currentUserLevel = ''
            localStorage.removeItem('currentUserLevel')
        },

        // 设置当前用户所拥有的项目
        setCurrentUserProjectList(state,val){
            state.currentUserProjectList = val
            localStorage.setItem('currentUserProjectList',JSON.stringify(val))
        },
        // 获取当前用户所拥有的项目
        getCurrentUserProjectList(state){
            state.currentUserProjectList = JSON.parse(localStorage.getItem('currentUserProjectList'))
        },
        // 退出后，清除当前用户所拥有的项目
        clearCurrentUserProjectList(state){
            state.currentUserProjectList = ''
            localStorage.removeItem('currentUserProjectList')
        },
        
        // 设置当前用户所选择的项目
        setCurrentUserSelectedProject(state,val){
            state.selectedProject = val
            localStorage.setItem('selectedProject',JSON.stringify(val))
        },
        // 获取当前用户所选择的项目
        getCurrentUserSelectedProject(state){
            state.selectedProject = JSON.parse(localStorage.getItem('selectedProject'))
        },
        // 退出后，清除当前用户所选择的项目
        clearCurrentUserSelectedProject(state){
            state.selectedProject = ''
            localStorage.removeItem('selectedProject')
        },
    }
})