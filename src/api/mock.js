import Mock from "mockjs";
import userApi from './mockData/user.js'
import permissionApi from './mockData/permission.js'
import repositoryApi from './mockData/repository.js'

// 以下代码都是截取发送的请求
// 本地获取user数据
// Mock.mock(/user\/getUser/, 'get', userApi.getUserList)
// Mock.mock(/user\/add/, 'post', userApi.createUser)
// Mock.mock(/user\/edit/, 'post', userApi.updateUser)
// Mock.mock(/user\/delete/, 'get', userApi.deleteUser)
// 获取各个不同权限用户的菜单栏
// Mock.mock(/permission\/getMenu/, 'post', permissionApi.getMenu)
// 获取用户的项目内容
// Mock.mock(/repo\/getRepoList/, 'get', repositoryApi.getRepoList)
