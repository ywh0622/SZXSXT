import Mock from 'mockjs'

// get请求从config.url获取参数, post从config.body中获取参数
function param2Obj(url) {
    // console.log('param2Obj函数 url',url);
    const search = url.split('?')[1]
    // console.log('param2Obj函数 search',search);
    if(!search){
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}'
    )
}

let List = []

const count = 200

for (let i = 0; i < count; i++) {
    List.push(
        {
            id: Mock.Random.guid(),
            software:Mock.Random.cword('ABCDEFGHIJKLMNOPQRSTUVWXYZ',3),
            name: Mock.Random.cname(),
            department:"xxx",
            phoneNumber:18800000000,
        },
    )
}

export default {
    /**
     * 获取列表
     * 要带参数 name, page, limit, name可以不填，page和limit有默认值
     * @param name, page, limit
     * @return {{code:number, count:number, data: *[]}}
     */
    getUserList: config => {
        // console.log('getUserList函数 config', config);
        const {name, page = 1, limit = 20} = param2Obj(config.url)
        // console.log('getUserList函数 name, page , limit ', name, page, limit);
        const mockList = List.filter(user => {
            // console.log(user.name);
            if(name && user.name.indexOf(name) === -1 && user.department.indexOf(name) === -1){
                return false
            }
            return true
        })

        // console.log('getUserList函数 mockList', mockList);
        const pageList = mockList.filter((item,index) => index < limit * page && index >= limit * (page -1))
        // console.log('getUserList函数 pageList', pageList);
        return {
            code: 200,
            data: {
                list: pageList,
                count: mockList.length
            }
        }
    },
    /**
     * 增加用户
     * @param name, software, department, phoneNumber
     * @return {{code: number, data: {message: string}}}
     */
    createUser: config => {
        console.log('createUser函数 config', config);
        const {name, software, department ,phoneNumber} = JSON.parse(config.body)
        console.log('createUser: ',JSON.parse(config.body));
        List.unshift({
            id: Mock.Random.guid(),
            name:name,
            software:software,
            department:department,
            phoneNumber:phoneNumber,
        })
        return{
            code:200,
            data:{
                message:'添加成功'
            }
        }
    },
    /**
     * 删除用户
     * @param id
     * @return {*}
     */
    deleteUser: config => {
        const {id} = param2Obj(config.url)
        if(!id){
            return{
                code:-999,
                msg:"参数不正确"
            }
        }else{
            List = List.filter(u => u.id !== id)
            return {
                code:200,
                msg:"删除成功"
            }
        }
    },
    /**
     * 批量删除
     * @param config
     * @return {{code: number, data:{message: string}}}
     */
    batchRemove: config => {
        let {ids} = param2Obj(config.url)
        ids = ids.spilt(',')
        List = List.filter(u => !ids.includes(u.id))
        return{
            code:200,
            message:'批量删除成功'
        }
    },
    /**
     * 修改用户
     * @param id, name, software, department, phoneNumber
     * @return {{code: number, data: {message: string}}}
     */
    updateUser: config => {
        const {id, name, software, department ,phoneNumber} = JSON.parse(config.body)
        List.some(u => {
            if(u.id === id){
                u.name = name,
                u.software = software,
                u.department = department,
                u.phoneNumber = phoneNumber
                return true
            }
        })
        return {
            code: 200,
            data: {
                message:'编辑成功'
            }
        }
    }
}