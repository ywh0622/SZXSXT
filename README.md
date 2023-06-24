# mbse_vue3

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

get/PUT请求发送数据格式为:
let form_data = {
    "username":"xxx",
    "id":"123"
}

post请求发生数据格式为:
let form_data = new FormData()
form_data.append("username","xxx")
