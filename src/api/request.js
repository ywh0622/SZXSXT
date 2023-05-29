import axios from "axios";
import { ElMessage } from "element-plus";
import config from "../config";

const NETWORK_ERROR = "网络请求异常,请稍后重试"

// 创建一个axios实例对象
const service = axios.create({
    baseURL: config.baseApi
})

// console.log("service:",service);
// 在请求前做事情
service.interceptors.request.use((req) => {
    console.log('发送请求',req);
    req.headers['token'] = 'vue-test'
    return req
})

// 在请求后做事情
service.interceptors.response.use((res) => {
    // 后端封装好的数据
    // console.log('得到请求后的数据',res);
    // const {code, data, message} = res.data
    // console.log('code, data, message : ',code, data, message);
    // if(code == 200){
    //     return data
    // }else{
    //     // 网络请求错误
    //     ElMessage.error(message || NETWORK_ERROR)
    //     return Promise.reject(message || NETWORK_ERROR)
    // }
    return res.data;
})

// 封装核心函数
function request(options){
    // console.log('封装核心函数前',options);
    options.method = options.method || 'get'
    if(options.method.toLowerCase() == 'get'){
        options.params = options.data
    }
    
    // 对mock的处理
    let isMock = config.mock
    // console.log("isMock : " , isMock);
    if(typeof options.mock !== 'undefined'){
        isMock = options.mock
    }
    // console.log("isMock : " , isMock);
    // 对线上环境做处理
    if(config.env == 'production' && !isMock){
        service.defaults.baseURL = config.baseApi
    }else{
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }
    // console.log("config.mockApi: " ,config.mockApi ,"config.baseApi: " ,config.baseApi);
    // console.log("service.defaults.baseURL : ",service.defaults.baseURL);
    // console.log('封装核心函数后',options);
    return service(options)
}

export default request