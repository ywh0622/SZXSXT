<template>
  <el-header>
    <div class="l-content">
      <el-button size="small" plain @click="handleCollapse">
        <el-icon size="20">
          <Menu />
        </el-icon>
      </el-button>
      <!--  面包屑 -->
      <el-breadcrumb separator="/">
        <!-- 首页一定是存在的  直接写死 -->
        <el-breadcrumb-item :to="{ path: '/' }"
          ><span>首页</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="current.path"
          v-if="current && $route.name == current.name"
        >
          <span>{{ current.label }}</span>
          <span class="blank">/</span>
          <span>{{ currentProjectName }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="imgSrc" alt="" class="user" />
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="changeProject">切换项目</el-dropdown-item>
            <el-dropdown-item @click="drawer = true">用户中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
  <!-- 用户中心抽屉 -->
  <el-drawer v-model="drawer" :before-close="handleClose">
    <template #header>
      <h4>用户中心</h4>
    </template>
    <div class="text">
      <p>修改密码:</p>
    </div>
    <div class="changePassword">
      <el-form
        :model="passwordDetail"
        label-width="120px"
        ref="changePasswordRef"
      >
        <el-form-item label="用户名">
          <el-input v-model="username" disabled />
        </el-form-item>

        <el-form-item
          label="新密码"
          prop="newPassword"
          :rules="[
            {
              required: true,
              message: '新密码不能为空',
            },
            {
              min: 4,
              max: 12,
              message: '长度在 4 到 12个字符',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="passwordDetail.newPassword"
            placeholder="请输入新密码"
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
            v-model="passwordDetail.confirmPassword"
            placeholder="请输入确认密码"
            type="password"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" :auto-insert-space="true"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="text">
      <p>修改个人信息:</p>
    </div>
    <div>
      <el-form :model="modifiedUserDetail" label-width="120px">
        <el-form-item label="部门" prop="department">
          <el-input
            v-model="modifiedUserDetail.department"
            :placeholder="userDetails.department"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="department">
          <el-input
            v-model="modifiedUserDetail.email"
            :placeholder="userDetails.email"
          />
        </el-form-item>

        <el-form-item label="电话" prop="department">
          <el-input
            v-model="modifiedUserDetail.phone"
            :placeholder="userDetails.phone"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="changeUserDetails"
            :auto-insert-space="true"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script setup>
import { getCurrentInstance, reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { inject } from "vue";

const reload = inject("reload");
const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();

// 获取当前用户名称
store.commit("getCurrentUser");
const username = store.state.currentUser;

// 获取当前用户ID
store.commit("getCurrentUserId");
const currentUserId = store.state.currentUserId;

// 获取当前项目名称
store.commit("getCurrentUserSelectedProject");
const currentProjectName = store.state.selectedProject.selectedProjectName;

// 用户头像地址
const imgSrc = require("../assets/user.jpg");

// 菜单栏缩进
function handleCollapse() {
  store.commit("updateCollapse", "123");
}

// 获取当前选择的菜单
const current = computed(() => {
  return store.state.currentMenu;
});

// 密码修改部分
// -------------------------------------------------------
// 密码校验 判断两次输入的密码是否一致
const equalToPassword = (rule, value, callback) => {
  if (passwordDetail.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};

// 是否显示修改命令抽屉
const drawer = ref(false);

// 新密码
const passwordDetail = reactive({
  newPassword: "",
  confirmPassword: "",
});

// 抽屉关闭前的提示
const handleClose = (done) => {
  ElMessageBox.confirm("确定关闭?")
    .then(() => {
      reload();
      done();
    })
    .catch(() => {
      // catch error
    });
};

// 点击取消 关闭用户权限抽屉
function cancelClick() {
  reload();
  drawer.value = false;
}

// 点击确定 关闭用户权限抽屉
const onSubmit = () => {
  proxy.$refs.changePasswordRef.validate(async (valid) => {
    if (valid) {
      // 封装前端数据为form-data格式，发送给后端
      const form_data = new FormData();
      form_data.append("username", username);
      form_data.append("new_password", passwordDetail.newPassword);
      // 向后端发送新密码
      const data = await proxy.$api.changePassword(form_data);
      if (data.code === 200) {
        // 关闭抽屉
        drawer.value = false;
        // 返回登陆页面
        handleLoginOut();
        // 显示修改成功信息
        ElMessage.success("密码修改成功!");
      } else {
        ElMessage.error(data.message);
      }
    } else {
      ElMessage.error("请输入正确的内容");
    }
  });
};
// -------------------------------------------------------

// 用户个人信息修改
// -------------------------------------------------------
// 用户个人信息
let userDetails = reactive({});

// 获取用户个人信息
const getCurrentUserDetails = async () => {
  let form_data = {
    user_id: currentUserId,
  };
  const { code, data, message } = await proxy.$api.getCurrentUserDetails(
    form_data
  );
  // console.log("用户个人信息 code, data, message:", code, data, message);
  if (code == 200) {
    userDetails = data;
  }
};

// 发给后端用户修改的个人数据信息
let modifiedUserDetail = reactive({
  user_id: currentUserId,
  department: "",
  email: "",
  phone: "",
});

// 发送修改的个人信息
const changeUserDetails = async () => {
  if (
    modifiedUserDetail.department == "" &&
    modifiedUserDetail.email == "" &&
    modifiedUserDetail.phone == ""
  ) {
    ElMessage.error("请修改个人信息!");
  } else {
    // 因为后端接收数据要为部门、邮箱、电话，因此如果前端只是修改了部门，邮箱电话没修改的话，要用
    // 该用户自己的邮箱和电话来填充这个字段，要不然后端会报错
    if (modifiedUserDetail.department == "") {
      modifiedUserDetail.department = userDetails.department;
    }
    if (modifiedUserDetail.email == "") {
      modifiedUserDetail.email = userDetails.email;
    }
    if (modifiedUserDetail.phone == "") {
      modifiedUserDetail.phone = userDetails.phone;
    }
    const { code, data, message } = await proxy.$api.changeUserDetails(
      modifiedUserDetail
    );
    console.log("修改个人信息 code, data, message:", code, data, message);
    if (code == 200) {
      drawer.value = false;
      ElMessage.success("修改成功!");
      reload();
    } else {
      ElMessage.error(data);
    }
  }
};
// -------------------------------------------------------

// 切换版本部分
const changeProject = () => {
  router.push({
    name: "projectSelect",
  });
};

// 退出账号 清除localstorage信息
const handleLoginOut = () => {
  store.commit("cleanMenu");
  store.commit("clearToken");
  store.commit("clearCurrentUser");
  store.commit("clearCurrentUserId");
  store.commit("clearCurrentUserLevel");
  store.commit("clearCurrentUserProjectList");
  store.commit("clearCurrentUserSelectedProject");
  router.push({
    name: "login",
  });
};

onMounted(() => {
  getCurrentUserDetails();
});
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #eaedf1;
}
.blank {
  padding-left: 8px;
  padding-right: 8px;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
.text {
  padding-bottom: 18px;
}
.changePassword {
  padding-bottom: 50px;
}
</style>