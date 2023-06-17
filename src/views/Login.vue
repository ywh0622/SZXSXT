<template>
  <div class="login_style">
    <div class="login_box">
      <!-- 头像区域 -->
      <!-- <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div> -->
      <div class="title_area">
        <h1>数字线索系统</h1>
      </div>
      <!-- 登录表单区域 -->
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          label-width="75px"
          class="login_form"
          require-asterisk-position="right"
        >
          <!-- 用户名 -->
          <!-- prop属性是进行表单的校验 -->
          <el-form-item
            prop="username"
            label="用户名"
            :rules="[
              {
                required: true,
                message: '用户名不能为空',
              },
            ]"
          >
            <el-input
              v-model="loginForm.username"
              type="input"
              placeholder="请输入账号"
              clearable
            >
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item
            prop="password"
            label="密码"
            :rules="[
              {
                required: true,
                message: '密码不能为空',
              },
            ]"
          >
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              clearable
            >
            </el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item>
            <el-button type="primary" @click="login" :auto-insert-space="true"
              >登录</el-button
            >
            <span class="blank"></span>
            <el-button
              type="primary"
              @click="userRegister"
              :auto-insert-space="true"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import Mock from "mockjs";
const { proxy } = getCurrentInstance();

// 存放用户输入的账号和密码
const loginForm = reactive({
  username: "",
  password: "",
});

const store = useStore();
const router = useRouter();

const login = () => {
  proxy.$refs.loginFormRef.validate(async (valid) => {
    if (valid) {
      // console.log("用户信息为:", loginForm);
      // 修改为form-data数据格式发送给后端
      let form_data = {
        username: loginForm.username,
        password: loginForm.password,
      };
      const { code, data, message } = await proxy.$api.login(form_data);
      console.log("code, data, message", code, data, message);
      if (code === 200) {
        // store.commit("addMenu", router);
        // 设置登陆token
        store.commit("setToken", Mock.Random.guid());
        // 将当前用户名称和用户所拥有的项目传入store中
        store.commit("setCurrentUser", loginForm.username);
        store.commit("setCurrentUserProjectList", data.projectList);
        // 跳转到项目选择页面
        router.push({
          name: "projectSelect",
        });
        // 输出成功信息
        ElMessage({
          showClose: true,
          message: "登陆成功,请选择项目",
          type: "success",
        });
      } else {
        ElMessage.error(message);
      }
    } else {
      ElMessage({
        showClose: true,
        message: "请输入正确的内容",
        type: "error",
      });
    }
  });
};

// 转注册页面
const userRegister = () => {
  router.push({
    name: "reg",
  });
};
</script>

<style lang="less" scoped>
.blank {
  margin-left: 75px;
  // margin-right: 65px;
}
.title_area {
  text-align: center;
  font-size: 170%;
  padding-top: 30px;
}

.login_style {
  background-color: #3671ab;
  // background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 460px;
  height: 250px;

  border: 1px solid #eaeaea;
  border-radius: 15px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    //less中可以进行样式的嵌套
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%; //在login_box内部移动50%
    transform: translate(-50%, -50%); //将图标自身向左和上移动自身的50%
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  :deep(.el-form-item__content) {
    justify-content: center;
  }
  .login_form {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>