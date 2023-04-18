import { createStore } from "vuex";
import Cookies from "js-cookie";
export default createStore({
    state: {
        isCollapse: false,
        currentMenu: null,
        menu:[],
        token:'',
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
        setMenu(state, val){
            state.menu = val
            localStorage.setItem('menu',JSON.stringify(val))
        },
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
                        // let url = `../views/${item.url}.vue`
                        item.component = () => import(`../views/${item.url}.vue`)
                        return item
                    })
                    menuArry.push(...item.children)
                }else{
                    // let url = `../views/${item.url}.vue`
                    item.component = () => import(`../views/${item.url}.vue`)
                    menuArry.push(item)
                }
            });

            menuArry.forEach(item => {
                router.addRoute('home1',item)
            })
        },
        /**
         * 
         * @param {*} state 
         * @param {*} item 
         */
        setCurrentMenu(state,val){
            if (val !== 'home') {
                state.menu.forEach( (item) => {
                    if (item.name === val) {
                        state.currentMenu = item
                    }
                })
            }
        },
        cleanMenu(state){
            state.menu = []
            localStorage.removeItem('menu')
        },
        setToken(state,val){
            state.token = val
            Cookies.set('token',val)
        },
        clearToken(state){
            state.token = ''
            Cookies.remove('token')
        },
        getToken(state){
            state.token = state.token || Cookies.get('token')
        }
    }
})