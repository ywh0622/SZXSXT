/**
 * 环境配置文件
 * 一般有三个环境
 * 开发环境
 * 测试环境
 * 线上环境 
*/

// 当前环境
console.log('process.env', process.env)
const env = process.env.NODE_ENV
// console.log('env:',env);
const EnvConfig = {
    development: {
        baseApi: "/api",
        mockApi: "https://www.fastmock.site/mock/8a50ae41d212fa4af046ee2eb1f53677/mbse",
    },
    test: {
        baseApi: "https://www.fastmock.site/mock/8a50ae41d212fa4af046ee2eb1f53677/mbse",
        mockApi: "https://www.fastmock.site/mock/8a50ae41d212fa4af046ee2eb1f53677/mbse",
    },
    production: {
        baseApi: "/api",
        mockApi: "https://www.fastmock.site/mock/8a50ae41d212fa4af046ee2eb1f53677/mbse",
    },
}

export default {
    env,
    //mock总开关
    mock: true,
    ...EnvConfig[env]
}