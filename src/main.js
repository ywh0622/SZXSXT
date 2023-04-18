import { createApp } from 'vue'
import App from './App.vue'
import './assets/less/index.less'
import router from './router'
import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store/index.js'
import './api/mock.js'
import api from './api/api'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn,
})
app.config.globalProperties.$api = api
// vuex数据持久化，页面刷新后menu菜单会丢失，所以将其存储在localstorage中
store.commit("addMenu", router);
function checkRouter(path){
  let hasCheck = router.getRoutes().filter(route => route.path == path).length
  // console.log(router.getRoutes());
  // console.log(router.getRoutes().filter(route => route.path == path));
  if(hasCheck){
    return true
  }else{
    return false
  }

}

router.beforeEach((to, from, next) => {
  store.commit('getToken')
  const token = store.state.token
  // console.log('to',to.name);
  store.commit('setCurrentMenu',to.name)
  if(!token && (to.name !== 'login' && (to.name !== 'reg'))){
    next({name:'login'})
    ElMessage({
      showClose: true,
      message: "请先登陆",
      type: "error",
    });
  }else if(!checkRouter(to.path)){
    next({name:'home'})
  }else{
    next()
  }
})

// app.use(ElementPlus)
app.use(router)
app.use(store)  
app.mount('#app')