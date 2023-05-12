import {createRouter,createWebHashHistory} from 'vue-router'

const routes = [
    {
        path:'/',
        component: () => import('../views/Main.vue'),
        name:'home1',
        redirect:'/home',
        children:[]
    },
    {
        path:'/login',
        name:'login',
        component: () => import('../views/Login.vue'),
    },
    {
        path:'/register',
        name:'reg',
        component: () => import('../views/Register.vue'),
    },
    {
        path:'/projectSelect',
        name:'projectSelect',
        component: () => import('../views/ProjectSelect.vue'),
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router