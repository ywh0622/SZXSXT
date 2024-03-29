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
            data:params
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
            url: '/models/transfer/other_ma_users',       //'/resource/user',
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
    // 	MA用户删除资源模型 完成
    deleteModelResource(params){
        return request({
            url: '/models/' + params.model_id,        //'/resource/exchange',
            method: 'delete',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	MA用户更新资源模型 完成
    updateModelResource(params){
        return request({
            url: '/models/' + params.model_id + '/details',        //'/resource/exchange',
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
    // 	SA用户通过PA用户申请 完成
    saAcceptPaApply(params){
        return request({
            url: '/audit/sa/pa_signup', 
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	SA用户拒绝PA用户申请 完成
    saRefusePaApply(params){
        return request({
            url: '/audit/sa/pa_signup', 
            method: 'delete',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
     // PA用户审核非组内用户加入项目申请 完成
     applyForPaProject(params){
        return request({
            url: '/audit/' + params.project_id + '/memebers', 
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },   
    // PA用户通过非组内用户加入项目申请 完成
    acceptApplyForPaProject(params){
        return request({
            url: '/audit/pa/ma_apply', 
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // PA用户拒绝非组内用户加入项目申请 完成
    refuseApplyForPaProject(params){
        return request({
            url: '/audit/pa/ma_apply', 
            method: 'delete',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	创建项目功能 完成
    createNewProject(params){
        return request({
            url: '/projects/', 
            method: 'post',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	PA用户获取自己所拥有的项目资源列表 
    getPaProject(params){
        return request({
            url: '/projects/pa/projects', 
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	PA用户更新项目信息 
    paUpdateProject(params){
        return request({
            url: '/projects/' + params.project_id + '/details', 
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	PA用户删除项目资源
    paDeleteProject(params){
        return request({
            url: '/projects/' + params.project_id, 
            method: 'delete',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	PA用户转移项目资源的对象
    paTransferProjectForUser(params){
        return request({
            url: '/projects/transfer/other_users', 
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	PA用户项目资源归属权转移
    paTransferProject(params){
        return request({
            url: '/projects/' + params.project_id + '/transfer', 
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // MA用户查看当前项目各模型软件的操作权限，是否拥有文件上传的资格 完成
    getProjectModelAuthority(params){
        return request({
            url: '/access/'+params.project_id+'/file_access',   //'/project/model',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // MA用户查看是否拥有修改模型的资格 完成
    getProjectModelModifyAuthority(params){
        return request({
            url: '/access/' + params.project_id + '/modify_access',   //'/project/model',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 上传文件 完成
    uploadFile(params){
        return request({
            url: '/models/', //'/upload',
            method: 'post',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 提交项目模型修改后的数据 完成
    submitModel(params){
        return request({
            url: '/models/' + params.model_id + '/data',
            method: 'put',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	获取项目历史版本信息 完成
    getProjectHistoryVersionData(params){
        return request({
            url: '/versions/project',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	获取某个模型项目历史版本列表 完成
    getSpecifyHistoryVersionData(params){
        return request({
            url: '/versions/' + params.model_id,
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 	查看某个历史版本信息 完成
    getSpecifyHistoryVersionDetailData(params){
        return request({
            url: '/versions/' + params.version_id + '/data',
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
            data:params
        })
    },
    // 根据模型Id查询模型数据信息wsy 完成
    getModelsById(params){
        return request({
            url: '/models/' + params.model_id,
            method: 'get',
            // 真实上线或者请求服务器接口需要改成false
            mock:false,
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


}