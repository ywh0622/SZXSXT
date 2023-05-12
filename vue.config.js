module.exports ={
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port:8080,
  //   // 上线服务器
  //   proxy:{
  //     ["/api"]:{
  //     target:'http://localhost:8081',
  //       changeOrigin:true,
  //         pathRewrite: {
  //             ['^' + "/api"]: ''
  //         }
  //     }
  // },

  // 本机调试 
  proxy:{
    ["/api"]:{
    // target:'http://localhost:8080', // 用自己的电脑测试解开这行注释
    target:'http://8.130.42.107:8081',  // 用服务器的电脑测试 解开这个注释
      changeOrigin:true,
        pathRewrite: {
            ['^' + "/api"]: ''
        }
    }
  }
  },
  transpileDependencies: true,
  lintOnSave: false,
}
