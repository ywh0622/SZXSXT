/**
 * 整个项目api管理
 */
import request from "./request"

export default {
    getUserData(params){
        return request({
            url: '/user/getUser',
            method: 'get',
            mock:false,
            data:params
        })
    },
    addUser(params){
        return request({
            url: '/user/add',
            method: 'post',
            mock:false,
            data:params
        })
    },
    editUser(params){
        return request({
            url: '/user/edit',
            method: 'post',
            mock:false,
            data:params
        })
    },
    deleteUser(params){
        return request({
            url: '/user/delete',
            method: 'get',
            mock:false,
            data:params
        })
    },
    // 根据不同用户返回不同的用户菜单
    getMenu(params){
        return request({
            url: '/permission/getMenu',
            method: 'post',
            mock:false,
            data:params
        })
    },
    // 登陆账号
    login(params){
        return request({
            url: '/login',
            method: 'post',
            // 真实上线需要改成false
            mock:true,
            data:params
        })
    },
    // 获取该用户的项目信息
    getRepoList(params){
        return request({
            url: '/repo/getRepoList',
            method: 'get',
            // 真实上线需要改成false
            mock:true,
            data:params
        })
    },
    // 获取项目可修改的属性名
    getModifiableElement(params){
        return request({
            url: '/repo/modifiableElement',
            method: 'get',
            // 真实上线需要改成false
            mock:true,
            data:params
        })
    },
    // 与后端进行连接测试
    testConnection(params){
        return request({
            url: '/repo/testConnection',
            method: 'get',
            // 真实上线需要改成false
            mock:true,
            data:params
        })
    }
}