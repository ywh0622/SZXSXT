<template>
  <div
    class="user-main"
    v-if="currentUserLevel == '2' || currentUserLevel == '3'"
  >
    <!-- 用户数据展示区域 -->
    <div class="table">
      <el-table :data="list" style="width: 100%" height="500px">
        <!-- 遍历给定的tableLabel来得到表格信息框名称，如数字线程软件、工程负责人等 -->
        <el-table-column
          v-for="item in tableLabel"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        />
        <!-- 用户信息操作栏 -->
        <el-table-column fixed="right" label="操作" width="250">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              v-if="currentUserLevel == '2'"
            >
              分配权限
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              <span v-if="currentUserLevel == '2'">移出项目组</span>
              <span v-if="currentUserLevel == '3'">删除用户</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码栏 -->
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="config.total"
        :page-size="config.limit"
        @current-change="changePage"
        class="pager mt-4"
      />
    </div>
    <!-- 显示用户权限 -->
    <el-drawer v-model="drawer" :before-close="handleUserLevelClose">
      <template #header>
        <h4>用户权限修改</h4>
      </template>
      <el-form :model="formUser" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="formUser.username" disabled />
        </el-form-item>
        <el-form-item
          v-for="(item, idx) in formUser.authority"
          :key="idx"
          :label="item['modelType']"
        >
          <el-switch v-model="item['hasAuthority']" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交修改</el-button>
          <el-button @click="cancelClick">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
  <div class="user-main" v-else>您暂无权限查看此页面</div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage, formatter } from "element-plus";
import { inject } from "vue";

const reload = inject("reload");
const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();

// 获取当前登陆用户对该项目的权限
store.commit("getCurrentUserLevel");
const currentUserLevel = store.state.currentUserLevel;

// 获取当前登陆用户以及所操作的项目
store.commit("getCurrentUser");
store.commit("getCurrentUserSelectedProject");
const userAndProject = reactive({
  user: store.state.currentUser,
  project: store.state.selectedProject,
});

// 显示用户权限的显示与隐藏
const drawer = ref(false);

const list = ref([]);
// 表格头部内容
const tableLabel = reactive([
  {
    prop: "username",
    label: "用户名",
    width: 230,
  },
  {
    prop: "department",
    label: "部门",
    width: 230,
  },
  {
    prop: "phoneNum",
    label: "手机号",
    width: 230,
  },
  {
    prop: "ownAuthority",
    label: "已拥有权限",
    width: 350,
  },
]);

// 分页配置
const config = reactive({
  total: 0,
  page: 1,
  limit: 11,
  name: "",
});

// 获取用户信息
async function getUserData(config) {
  // 登陆用户为管理员
  if (currentUserLevel == "3") {
    const { code, data, message } = await proxy.$api.getUserDetails();
    console.log("code, data, message:", code, data, message);
    // 获取信息总行数，页面中页码需要提前获取到总数量
    config.total = data.count;
    list.value = data.map((item) => {
      // 手动生成item["ownAuthority"]即前端页面显示item.username该用户已拥有的权限
      item["ownAuthority"] = "";
      return item;
    });
  } else {
    // 登陆用户非管理员
    const { code, data, message } = await proxy.$api.getUserLevel(
      userAndProject
    );
    console.log("code, data, message:", code, data, message);
    // 获取信息总行数，页面中页码需要提前获取到总数量
    config.total = data.count;
    list.value = data.userList.map((item) => {
      // 手动生成item["ownAuthority"]即前端页面显示item.username该用户已拥有的权限
      item["ownAuthority"] = "";
      item["authority"].forEach((element) => {
        if (element["hasAuthority"]) {
          item["ownAuthority"] += element["modelType"] + ", ";
        }
      });
      return item;
    });
  }
}

// 改变页码
const changePage = (page) => {
  config.page = page;
  getUserData(config);
};

// 当用户点击表格中分配权限或者修改密码时，这个formUser就表示用户选中的那个人
const formUser = ref({
  username: "",
  phoneNum: 1,
  email: "",
  department: "",
  authority: [],
  userId: "",
});

// 显示用户权限抽屉
const handleEdit = (row) => {
  drawer.value = true;
  formUser.value = row;
};

// 点击取消 关闭用户权限抽屉
function cancelClick() {
  drawer.value = false;
  reload();
}

// 点击修改用户权限提示框对话的x
const handleUserLevelClose = (done) => {
  ElMessageBox.confirm("确定关闭?")
    .then(() => {
      reload();
      done();
    })
    .catch(() => {
      // catch error
    });
};

// 对用户权限的修改或者移出项目组的数据，userLevelData直接发送个后端
const userLevelData = reactive({
  userId: "",
  project_id: "",
  modelPermission: "",
});

// 点击修改 提交修改的数据并关闭用户权限抽屉
const onSubmit = () => {
  ElMessageBox.confirm("确定修改吗?")
    .then(async () => {
      // 封装PA用户修改的信息 0表示无权限 1表示有权限 modelPermission共32位，前九位分别表示各种模型的权限
      let modelPermission = "";
      formUser.value.authority.forEach((element) => {
        if (element["hasAuthority"]) {
          modelPermission += "1";
        } else {
          modelPermission += "0";
        }
      });
      for (let index = modelPermission.length + 1; index <= 32; index++) {
        modelPermission += "0";
      }
      // 封装数据
      userLevelData.modelPermission = modelPermission;
      userLevelData.project_id = userAndProject.project.selectedProjectId;
      userLevelData.userId = formUser.value.userId;
      // 发送请求
      const { code, data, message } = await proxy.$api.changeUserLevel(
        userLevelData
      );
      if (code === 200) {
        drawer.value = false;
        reload();
        ElMessage({
          showClose: true,
          message: "用户权限修改成功",
          type: "success",
        });
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};

// 移除或者删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm("确定删除?")
    .then(async () => {
      console.log("row", row);
      console.log("currentUserLevel", currentUserLevel);
      if (currentUserLevel == "3") {
        const form_data = new FormData();
        form_data.append("user_id", row.id);
        const { code, data, message } = await proxy.$api.deleteUser(form_data);
        if (code === 200) {
          ElMessage({
            showClose: true,
            message: "删除用户成功",
            type: "success",
          });
          reload();
        } else {
          ElMessage.error(message);
        }
      } else {
        const form_data = new FormData();
        form_data.append("user_id", row.id);
        form_data.append(
          "project_id",
          userAndProject.project.selectedProjectId
        );
        const { code, data, message } = await proxy.$api.removeUser(form_data);
        if (code === 200) {
          ElMessage({
            showClose: true,
            message: "移除用户成功",
            type: "success",
          });
          reload();
        } else {
          ElMessage.error(message);
        }
      }
    })
    .catch(() => {});
};

onMounted(() => {
  getUserData(config);
});
</script>

<style lang="less" scoped>
.user-main {
  padding: 20px;
}
.table {
  position: relative;
  width: 100%;
  height: 520px;
  .pager {
    position: absolute;
    right: 0;
    bottom: -20px;
  }
}
.user-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>>