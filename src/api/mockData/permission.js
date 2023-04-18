import Mock from 'mockjs'

export default {
    getMenu: config => {
        const {username, password} = JSON.parse(config.body)
        // 先判断用户是否存在
        // 再判断账号和密码是否正确
        if(username === 'admin' && password === 'admin'){
            return {
                code:200,
                data:{
                    menu:[
                        {
                            path:'/home',
                            name:'home',
                            label:'首页',
                            icon:'location',
                            url:'home/Home'
                        },
                        {
                            path:'/repo',
                            name:'repository',
                            label:'模型仓库',
                            icon:'house',
                            url:'repo/Repository'
                        },
                        {
                            path:'/relation',
                            name:'relation',
                            label:'模型关系',
                            icon:'house',
                            url:'relation/Relation'
                        },
                        {
                            path:'/user',
                            name:'user',
                            label:'用户管理',
                            icon:'user',
                            url:'user/User'
                        },
                    ],
                    token: Mock.Random.guid(),
                    message: "获取成功"
                }
            }
        } else if (username === 'xiaoxiao' && password === 'xiaoxiao'){
            return {
                code: 200,
                data :{
                    menu:[
                        {
                            path:'/home',
                            name:'home',
                            label:'首页',
                            icon:'house',
                            url:'home/Home'
                        },
                        {
                            path:'/repo',
                            name:'repository',
                            label:'模型仓库',
                            icon:'house',
                            url:'repo/Repository'
                        },
                        {
                            path:'/relation',
                            name:'relation',
                            label:'模型关系',
                            icon:'house',
                            url:'relation/Relation'
                        }
                    ],
                    token: Mock.Random.guid(),
                    message: '获取成功'
                }
            }
        }else{
            return{
                code:-999,
                data:[],
                msg:'登陆失败'
            }
        }
    }
}