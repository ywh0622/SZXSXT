/**
 * 整个项目api管理
 */
import request from "./request"

export default {
    // 登陆账号 完成
    login(params){
        return request({
            url: '/users/signin',    // '/login',
            method: 'get',
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
    // 获取用户信息 完成
    getCurrentUserDetails(params){
        return request({
            url: '/users/'+ params.user_id + '/details',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params,
        })
    },
    // 修改用户信息 完成
    changeUserDetails(params){
        return request({
            url: '/users/'+ params.user_id + '/details',
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params,
        })
    },
    // PA账号查看项目下所有MA账号权限详情 完成
    getUserLevel(params){
        return request({
            url:'/users/'+params.project_id+'/members',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
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
            data:params
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
    // 获取登陆用户的项目信息 完成
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
            url: '/models/modifiable_elements',
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
    // 可邀请的用户列表 完成
    getInviteUserList(params){
        return request({
            url:'/users/pa/invite_members', // '/invited/users',           
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 获取搜索指定的用户 完成
    getSpecifyUser(params){
        return request({
            url: '/users/pa/invite/search', //'/invite/specify',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 邀请用户加入项目 完成
    inviteUser(params){
        return request({
            url:'/users/pa/invite', // '/invited/user', 
            method: 'post',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 收到项目的邀请信息列表 完成
    getInviteProjectList(params){
        return request({
            url: '/audit/invite_message', // '/invited/projetcts',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 接受邀请加入项目 完成
    jointProject(params){
        return request({
            url: '/audit/invite',              // '/invited/project',
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 拒绝邀请加入项目 完成
    refuseJointProject(params){
        return request({
            url: '/audit/invite',     // '/invited/projetct/refuse',     
            method: 'delete',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	MA用户所拥有的资源列表 完成
    getResourcesList(params){
        return request({
            url: '/models/'+ params.user_id + '/model_resources',   //'/resources/list',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	MA用户转移模型资源时组内其余用户列表 完成
    getOtherUserList(params){
        return request({
            url: '/projects/transfer/other_ma_users',       //'/resource/user',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	MA用户转移资源模型 完成
    exchangeResource(params){
        return request({
            url: '/models/transfer',        //'/resource/exchange',
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	SA用户审核PA用户申请 完成
    saGetPaApply(params){
        return request({
            url: '/audit/sa/members', 
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
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
    // MA用户查看当前项目各模型软件的操作权限，是否拥有文件上传的资格 完成
    getProjectModelAuthority(params){
        return request({
            url: '/access/'+params.project_id+'/users_access',   //'/project/model',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 上传文件 未完成
    uploadFile(params){
        return request({
            url: '/upload',
            method: 'post',
            // 真实上线或者请求服务器接口需要改成false
            mock:true,
            data:params
        })
    },
    
    // 	获取项目历史版本信息 未完成
    getProjectHistoryVersionData(params){
        return request({
            url: '/history/project',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:true,
            data:params
        })
    },
    // 	获取某个模型项目历史版本列表 未完成
    getSpecifyHistoryVersionData(params){
        return request({
            url: '/history/project/model',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:true,
            data:params
        })
    },
    // 	查看某个历史版本信息 未完成
    getSpecifyHistoryVersionDetailData(params){
        return request({
            url: '/history/project/model/specify',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:true,
            data:params
        })
    },
    // 	使用历史版本覆盖新版本 未完成
    cover(params){
        return request({
            url: '/history/project/model/cover',
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