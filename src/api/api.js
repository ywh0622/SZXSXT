/**
 * 整个项目api管理
 */
import request from "./request"

export default {
    // 登陆账号 完成
    login(params){
        return request({
            url: '/users/signin',    // '/login',
            method: 'post',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 注册账号 完成
    register(params){
        return request({
            url: '/users/signup',       //'/register',
            method: 'post',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 修改密码 完成
    changePassword(params){
        return request({
            url: '/users/account/password',
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params,
        })
    },
    // PA账号对该项目下所有MA账号权限详情 完成
    getUserLevel(params){
        return request({
            url: '/users/'+params.project.selectedProjectId+'/members',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:null
        })
    },
    // PA账号对该项目下MA账号的权限修改 完成
    changeUserLevel(params){
        return request({
            url: '/access/'+params.project_id +'/users_access',
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // PA账号项目中移出MA账号 完成
    removeUser(params){
        return request({
            url: '/users/pa/member',
            method: 'delete',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // SA账号对所有账号权限详情  完成
    getUserDetails(params){
        return request({
            url: '/users/sa/users_details',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:null
        })
    },
    // SA账号删除账号  完成
    deleteUser(params){
        return request({
            url: '/users/sa/member',
            method: 'delete',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 获取该用户的项目信息 完成
    getProjectDetails(params){
        return request({
            url: '/projects/' + params + '/models',
            // url: '/repo/getRepoList',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:null
        })
    },
    // 获取项目可修改的属性名 完成
    getModifiableElement(params){
        return request({
            url: '/models/elements',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:null
        })
    },
    // 与后端进行连接测试  完成
    testConnection(params){
        return request({
            url: '/repo/testConnection',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:null
        })
    },
    // 提交项目模型修改后的数据 未完成
    submitModel(params){
        return request({
            url: '/submitModel',
            method: 'post',
            // 真实上线或者请求服务器接口需要改成false
            mock:true,
            data:params
        })
    },
    // 与后端进行连接测试 测试 可删除
    testPut(params){
        return request({
            url: '/putTest',
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 与后端进行连接测试 测试 可删除
    testPost(params){
        return request({
            url: '/loginUser',
            method: 'post',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
}