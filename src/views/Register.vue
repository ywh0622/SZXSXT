<template>
  <div class="login_style">
    <div class="login_box">
      <div class="title_area">
        <h1>用户注册</h1>
      </div>

      <el-form
        :inline="true"
        :model="registerForm"
        label-width="85px"
        require-asterisk-position="right"
        ref="registerFormRef"
      >
        <el-form-item
          label="用户名"
          prop="userName"
          :rules="[
            {
              required: true,
              message: '用户名不能为空',
            },
          ]"
        >
          <el-input
            v-model="registerForm.userName"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item
          label="姓名"
          prop="trueName"
          :rules="[
            {
              required: true,
              message: '姓名不能为空',
            },
          ]"
        >
          <el-input v-model="registerForm.trueName" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
          :rules="[
            {
              required: true,
              message: '密码不能为空',
            },
            {
              min: 1,
              max: 12,
              message: '长度在 1 到 12个字符',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            type="password"
          />
        </el-form-item>

        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          :rules="[
            {
              required: true,
              message: '确认密码不能为空',
            },
            { required: true, validator: equalToPassword, trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="请输入确认密码"
            type="password"
          />
        </el-form-item>

        <el-form-item
          label="角色"
          prop="role"
          :rules="[
            {
              required: true,
              message: '角色不能为空',
            },
          ]"
        >
          <el-radio-group v-model="registerForm.role" @change="roleChange">
            <el-radio :label="2">项目管理员</el-radio>
            <el-radio :label="1">模型管理员</el-radio>
            <el-radio :label="0">游客</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="部门" prop="department">
          <el-input
            v-model="registerForm.department"
            placeholder="请输入部门"
          />
        </el-form-item>

        <el-form-item
          label="项目代码"
          prop="projectId"
          :rules="[{ required: true, message: '项目代码不能为空' }]"
        >
          <el-input
            v-model="registerForm.projectId"
            placeholder="请输入项目代码"
            :disabled="registerForm.role == 2 ? true : false"
          />
        </el-form-item>

        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[
            {
              required: true,
              message: '邮箱不能为空',
            },
            {
              required: true,
              validator: checkEmail,
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item
          label="手机号"
          prop="phone"
          :rules="[
            {
              required: true,
              message: '手机号不能为空',
            },
            {
              required: true,
              validator: checkPhoneNumber,
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model.number="registerForm.phone"
            oninput="value=value.replace(/[^\d]/g,'');if(value.length > 11)value = value.slice(0, 11)"
            placeholder="请输入手机号"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="onRegister" :auto-insert-space="true"
          >注册</el-button
        >
        <el-button type="primary" @click="resetForm" :auto-insert-space="true"
          >重置</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();

const store = useStore();
const router = useRouter();

// 表单信息，用户最后提交的注册信息
const registerForm = reactive({
  userName: "",
  password: "",
  confirmPassword: "",
  trueName: "",
  role: 2,
  department: "",
  projectId: "项目管理员无需填写",
  email: "",
  phone: "",
});

// 密码校验 判断两次输入的密码是否一致
const equalToPassword = (rule, value, callback) => {
  if (registerForm.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

// 判断邮箱是否合法
const checkEmail = (rule, value, callback) => {
  // 验证邮箱的正则表达式
  const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
  if (regEmail.test(value)) {
    // 合法的邮箱
    return callback();
  }
  callback(new Error("请输入合法的邮箱"));
};

// 判断手机号是否合法 checkPhoneNumber
const checkPhoneNumber = (rule, value, callback) => {
  // 验证邮箱的正则表达式
  const regPhoneNumber = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/;
  if (regPhoneNumber.test(value)) {
    // 合法的手机号
    return callback();
  }
  callback(new Error("请输入合法的手机号"));
};

// 用户角色变化时触发
const roleChange = (rows) => {
  // 用户角色为2时，代表为项目管理员，不需要填写项目代码
  if (rows == 2) {
    registerForm.projectId = "项目管理员无需填写";
  } else {
    registerForm.projectId = "";
  }
};

// 用户注册
const onRegister = () => {
  proxy.$refs.registerFormRef.validate(async (valid) => {
    if (valid) {
      // 向后端发送注册信息
      const data = await proxy.$api.register(registerForm);
      // 如果code ==200, 表示注册成功
      if (data.code === 200) {
        router.push({
          name: "login",
        });
        ElMessage({
          showClose: true,
          message: "注册成功",
          type: "success",
        });
      } else {
        ElMessage.error(data.message);
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

// 重置表单
const resetForm = () => {
  proxy.$refs.registerFormRef.resetFields();
};
</script>

<style lang="less" scoped>
.title_area {
  text-align: center;
  font-size: 140%;
  padding-top: 20px;
  padding-bottom: 30px;
}

.login_style {
  background-color: #3671ab;
  // background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 710px;
  height: 400px;

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
}
</style>