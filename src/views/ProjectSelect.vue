<template>
  <div class="login_style">
    <div class="login_box">
      <div class="closeBtn">
        <el-button :icon="CloseBold" @click="returnLastPage"></el-button>
      </div>
      <h1 class="system_name">数字线索系统</h1>
      <el-form
        :model="formData"
        ref="selectedProjectRef"
        require-asterisk-position="right"
      >
        <el-form-item
          label="project"
          label-width="150px"
          prop="selectedProjectName"
          :rules="[
            {
              required: true,
              message: '请选择项目',
            },
          ]"
        >
          <el-select
            v-model="formData.selectedProjectName"
            placeholder="请选择项目"
          >
            <el-option
              v-for="item in projectList"
              :key="item.projectName"
              :label="item.projectName"
              :value="item.projectName"
            />
          </el-select>
        </el-form-item>

        <el-form-item label-width="150px">
          <el-button type="primary" @click="Continue">CONTIUNE</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { CloseBold } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();

const store = useStore();
const router = useRouter();

// 获取当前用户项目列表
store.commit("getCurrentUserProjectList");
const projectList = store.state.currentUserProjectList;

// 菜单栏地址
// 非游客用户菜单地址
const menuPath = reactive([
  {
    path: "/home",
    name: "home",
    label: "首页",
    icon: "location",
    url: "home/Home",
  },
  {
    path: "/repo",
    name: "repository",
    label: "模型仓库",
    icon: "house",
    url: "repo/Repository",
  },
  {
    path: "/relation",
    name: "relation",
    label: "模型关系",
    icon: "house",
    url: "relation/Relation",
  },
  {
    path: "/user",
    name: "user",
    label: "项目管理",
    icon: "Unlock",
    url: "user/User",
  },
  {
    path: "/history",
    name: "version",
    label: "历史版本",
    icon: "documentCopy",
    url: "history/VersionControl",
  },
]);
// 游客用户菜单无项目管理和历史版本
const touristMenuPath = reactive([
  {
    path: "/home",
    name: "home",
    label: "首页",
    icon: "location",
    url: "home/Home",
  },
  {
    path: "/repo",
    name: "repository",
    label: "模型仓库",
    icon: "house",
    url: "repo/Repository",
  },
  {
    path: "/relation",
    name: "relation",
    label: "模型关系",
    icon: "house",
    url: "relation/Relation",
  },
]);

// 表单中的数据
const formData = reactive({
  selectedProjectName: "",
  selectedProjectId: "",
});

const Continue = () => {
  proxy.$refs.selectedProjectRef.validate(async (valid) => {
    if (valid) {
      // 在store中设置当前用户对所选择的项目的权限
      projectList.forEach((element) => {
        if (element.projectName == formData.selectedProjectName) {
          store.commit("setCurrentUserLevel", element.userLevel);
          store.commit("setCurrentUserId", element.userId);
          formData.selectedProjectId = element.projectId;
          // 将用户的菜单保存到store中的menu变量和浏览器中
          // 游客用户
          if (element.userLevel == 0) {
            store.commit("setMenu", touristMenuPath);
          } else {
            store.commit("setMenu", menuPath);
          }
          store.commit("addMenu", router);
        }
      });
      // 在store中设置当前用户所选择的项目和项目ID
      store.commit("setCurrentUserSelectedProject", formData);
      // 跳转到后续页面
      router.push({
        name: "home",
      });
    } else {
      ElMessage({
        showClose: true,
        message: "请选择项目",
        type: "error",
      });
    }
  });
};

// 返回上一个页面
const returnLastPage = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
.title_area {
  text-align: center;
}
.closeBtn {
  float: right;
}
.system_name {
  font-size: 200%;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 60px;
}
.login_style {
  background-color: #3671ab;
  // background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
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
}
</style>