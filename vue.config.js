module.exports ={
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port:8080,
    // 上线服务器
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
  // proxy:{
  //   ["/api"]:{
  //   target:'http://8.130.42.107:8081',
  //     changeOrigin:true,
  //       pathRewrite: {
  //           ['^' + "/api"]: ''
  //       }
  //   }
  // }
  },
  transpileDependencies: true,
  lintOnSave: false,
}
