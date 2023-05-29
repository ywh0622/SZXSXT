<template>
  <div class="box">
    <el-container>
      <el-aside width="200px">
        <el-tree
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          getCurrentKey
          highlight-current
        >
          <template #default="{ data }">
            <component class="icons" :is="data.icon"></component>
            <span style="margin-left: 20px">{{ data.tagName }}</span>
          </template>
        </el-tree>
      </el-aside>
      <el-main>
        <!-- 用户权限 -->
        <div
          v-if="
            currentFunction == 'userAuthority' &&
            (currentUserLevel == '2' || currentUserLevel == '3')
          "
        >
          <!-- 用户数据展示区域 -->
          <div class="table">
            <el-table :data="list" style="width: 100%" height="500px">
              <!-- 遍历给定的tableLabel来得到表格信息框名称 -->
              <el-table-column
                v-for="item in tableLabel"
                :key="item.label"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
              />
              <!-- 用户信息操作栏 -->
              <el-table-column fixed="right" label="操作" width="200">
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
        <!-- 邀请用户 -->
        <div
          v-else-if="currentFunction == 'inviteUser' && currentUserLevel == '2'"
        >
          <!-- 邀请用户功能展示区域 -->
          <!-- 最顶部 搜索区域 -->
          <div class="user-header">
            <!-- 搜索 -->
            <el-form :inline="true" :model="formInline">
              <el-form-item label="请输入">
                <el-input v-model="formInline.keyword" placeholder="用户名" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table">
            <el-table :data="inviteUserList" style="width: 100%" height="500px">
              <!-- 遍历给定的tableLabel来得到表格信息框名称 -->
              <el-table-column
                v-for="item in inviteTableLabel"
                :key="item.label"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
              />
              <!-- 用户信息栏 -->
              <el-table-column fixed="right" label="操作" width="200">
                <template #default="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="inviteUser(scope.row)"
                  >
                    邀请
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 页码栏 -->
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="inviteConfig.total"
              :page-size="inviteConfig.limit"
              @current-change="changeInvitePage"
              class="pager mt-4"
            />
          </div>
        </div>
        <!-- 加入项目 -->
        <div v-else-if="currentFunction == 'joinProject'">
          <!-- 邀请用户功能展示区域 -->
          <div class="table">
            <el-table
              :data="projectInvitedList"
              style="width: 100%"
              height="500px"
            >
              <!-- 遍历给定的tableLabel来得到表格信息框名称 -->
              <el-table-column
                v-for="item in projectInvitedTableLabel"
                :key="item.label"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
              />
              <!-- 用户信息栏 -->
              <el-table-column fixed="right" label="操作" width="200">
                <template #default="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="jointProject(scope.row)"
                  >
                    接受
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="refuseJointProject(scope.row)"
                  >
                    拒绝
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 页码栏 -->
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="projectInvitedConfig.total"
              :page-size="projectInvitedConfig.limit"
              @current-change="changeInvitePage"
              class="pager mt-4"
            />
          </div>
        </div>
        <!-- 资源转移 -->
        <div
          v-else-if="
            currentFunction == 'exchangeResource' && currentUserLevel == '1'
          "
        >
          <div class="exchangeResource">
            <div class="m-4">
              <p style="padding-bottom: 10px">模型资源</p>
              <el-select
                v-model="selectedResource"
                placeholder="请选择模型资源"
              >
                <el-option
                  v-for="item in resourceList"
                  :key="item.resourceName"
                  :label="item.resourceName"
                  :value="item.resourceName"
                />
              </el-select>
            </div>
            <div class="m-4">
              <p style="padding-bottom: 10px">目标用户</p>
              <el-select v-model="selectedUserId" placeholder="请选择目标用户">
                <el-option
                  v-for="item in exchangeUserList"
                  :key="item.userId"
                  :label="item.username"
                  :value="item.userId"
                />
              </el-select>
            </div>
            <div class="m-4" style="padding-top: 25px">
              <el-button type="primary" @click="submitResourceExchange"
                >确认转移</el-button
              >
            </div>
          </div>
        </div>

        <div class="user-main" v-else>您暂无权限查看此页面</div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { SortUp } from "@element-plus/icons-vue";
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

// 权限管理页面 左侧树形结构名称
// 根据不同的用户等级 显示不同的内容
let data = [];
// 第一个功能的名称
let currentFunction = ref("");
if (currentUserLevel == "2") {
  // 项目管理员 PA
  data = [
    {
      tagName: "用户权限配置",
      tagNickName: "userAuthority",
      icon: "lock",
    },
    {
      tagName: "邀请用户加入",
      tagNickName: "inviteUser",
      icon: "user",
    },
    {
      tagName: "项目加入确认",
      tagNickName: "joinProject",
      icon: "folder",
    },
  ];
  currentFunction.value = "userAuthority";
} else if (currentUserLevel == "1") {
  //项目参与者 MA
  data = [
    {
      tagName: "项目加入确认",
      tagNickName: "joinProject",
      icon: "folder",
    },
    {
      tagName: "模型资源转移",
      tagNickName: "exchangeResource",
      icon: "switch",
    },
  ];
  currentFunction.value = "joinProject";
} else if (currentUserLevel == "3") {
  // 管理员用户 SA
  data = [
    {
      tagName: "用户权限配置",
      tagNickName: "userAuthority",
      icon: "lock",
    },
    {
      tagName: "项目加入确认",
      tagNickName: "joinProject",
      icon: "folder",
    },
  ];
  currentFunction.value = "userAuthority";
} else {
  // 游客
  data = [
    {
      tagName: "项目加入确认",
      tagNickName: "joinProject",
      icon: "folder",
    },
  ];
  currentFunction.value = "joinProject";
}

// 权限管理页面 左侧 el-tree配置
const defaultProps = {
  // 无下级目录，不需要指定children
  children: "XXX",
  label: "tagName",
};

// 保存当前用户点击的功能信息
const handleNodeClick = (data) => {
  currentFunction.value = data.tagNickName;
};

// 修改用户权限模块
// --------------------------------------------------------
// --------------------------------------------------------

// 显示用户权限的显示与隐藏
const drawer = ref(false);

// 用户数据
const list = ref([]);
// 表格头部内容
let tableLabel = [];
if (currentUserLevel == "2") {
  // PA用户
  tableLabel = [
    {
      prop: "username",
      label: "用户名",
      width: 180,
    },
    {
      prop: "department",
      label: "部门",
      width: 180,
    },
    {
      prop: "phoneNum",
      label: "手机号",
      width: 180,
    },
    {
      prop: "ownAuthority",
      label: "已拥有权限",
      width: 250,
    },
  ];
} else {
  // SA用户
  tableLabel = [
    {
      prop: "username",
      label: "用户名",
      width: 180,
    },
    {
      prop: "department",
      label: "部门",
      width: 180,
    },
    {
      prop: "phoneNum",
      label: "手机号",
      width: 180,
    },
  ];
}

// 分页配置
const config = reactive({
  total: 0,
  page: 1,
  limit: 10,
  name: "",
});

// 获取用户信息
async function getUserData(config) {
  let form_data = new FormData();
  form_data.append("limit", config.limit);
  form_data.append("page", config.page);
  // 登陆用户为管理员
  if (currentUserLevel == "3") {
    const { code, data, message } = await proxy.$api.getUserDetails(form_data);
    console.log("code, data, message:", code, data, message);
    if (code == 200) {
      // 获取信息总行数，页面中页码需要提前获取到总数量
      config.total = data.count;
      list.value = data.userList.map((item) => {
        return item;
      });
    } else {
      ElMessage.error(message);
    }
  } else {
    // 登陆用户非管理员
    form_data.append("projectId", userAndProject.project.selectedProjectId);
    const { code, data, message } = await proxy.$api.getUserLevel(form_data);
    console.log("code, data, message:", code, data, message);
    if (code == 200) {
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
        if (item["ownAuthority"].length > 0) {
          item["ownAuthority"] = item["ownAuthority"].substr(
            0,
            item["ownAuthority"].length - 2
          );
        }
        return item;
      });
    } else {
      ElMessage.error(message);
    }
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
      // console.log("row", row);
      // console.log("currentUserLevel", currentUserLevel);
      // currentUserLevel=3表示为删除用户
      if (currentUserLevel == "3") {
        const form_data = new FormData();
        form_data.append("user_id", row.userId);
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
        form_data.append("user_id", row.userId);
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

// --------------------------------------------------------
// --------------------------------------------------------

// 邀请别人加入项目组模块
// --------------------------------------------------------
// --------------------------------------------------------

// 受邀请用户列表
const inviteUserList = ref([]);

// 搜索的用户名称
const formInline = reactive({
  keyword: "",
});

// 表格头部内容
const inviteTableLabel = reactive([
  {
    prop: "username",
    label: "用户名",
    width: 180,
  },
  {
    prop: "department",
    label: "部门",
    width: 180,
  },
  {
    prop: "phoneNum",
    label: "手机号",
    width: 180,
  },
]);

// 分页配置
const inviteConfig = reactive({
  total: 0,
  page: 1,
  limit: 11,
});

// 获取可邀请用户信息
async function getInviteUserList(inviteConfig) {
  let form_data = new FormData();
  form_data.append("limit", inviteConfig.limit);
  form_data.append("page", inviteConfig.page);
  const { code, data, message } = await proxy.$api.getInviteUserList(form_data);
  console.log("code, data, message:", code, data, message);
  if (code == 200) {
    // 获取信息总行数，页面中页码需要提前获取到总数量
    inviteConfig.total = data.count;
    inviteUserList.value = data.userList.map((item) => {
      return item;
    });
  } else {
    ElMessage.error(message);
  }
}

// 获取指定用户信息
const handleSearch = async () => {
  if (formInline.keyword == "") {
    ElMessage.error("请输入要搜索的用户名称!");
  } else {
    const { code, data, message } = await proxy.$api.getSpecifyUser();
    console.log("code, data, message:", code, data, message);
    if (code == 200) {
      // 获取信息总行数，页面中页码需要提前获取到总数量
      inviteUserList.value = data.map((item) => {
        return item;
      });
    } else {
      ElMessage.error(message);
    }
  }
};

// 改变页码
const changeInvitePage = (page) => {
  inviteConfig.page = page;
  getInviteUserList(inviteConfig);
};

// 邀请用户
const inviteUser = (row) => {
  ElMessageBox.confirm("确定邀请吗?")
    .then(async () => {
      const form_data = new FormData();
      form_data.append("user_id", row.id);
      form_data.append("currentUserName", userAndProject.user);
      const { code, data, message } = await proxy.$api.inviteUser();
      if (code === 200) {
        ElMessage({
          showClose: true,
          message: "已发送邀请",
          type: "success",
        });
        reload();
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};
// --------------------------------------------------------
// --------------------------------------------------------

// 接受别人邀请模块
// --------------------------------------------------------
// --------------------------------------------------------

// 受邀请项目列表
const projectInvitedList = ref([]);

// 表格头部内容
const projectInvitedTableLabel = reactive([
  {
    prop: "projectName",
    label: "项目名称",
    width: 180,
  },
  {
    prop: "projectManagerName",
    label: "项目负责人",
    width: 180,
  },
  {
    prop: "department",
    label: "部门",
    width: 180,
  },
]);

// 分页配置
const projectInvitedConfig = reactive({
  total: 0,
  page: 1,
  limit: 11,
});

// 获取可邀请用户信息
async function getInviteProjectList(projectInvitedConfig) {
  let form_data = new FormData();
  form_data.append("limit", projectInvitedConfig.limit);
  form_data.append("page", projectInvitedConfig.page);
  const { code, data, message } = await proxy.$api.getInviteProjectList(
    form_data
  );
  console.log("code, data, message:", code, data, message);
  if (code == 200) {
    // 获取信息总行数，页面中页码需要提前获取到总数量
    projectInvitedConfig.total = data.count;
    projectInvitedList.value = data.projectList.map((item) => {
      return item;
    });
  } else {
    ElMessage.error(message);
  }
}

// 改变页码
const changeProjectInvitedPage = (page) => {
  projectInvitedConfig.page = page;
  getInviteProjectList(projectInvitedConfig);
};

// 加入项目组
const jointProject = (row) => {
  ElMessageBox.confirm("确定加入该项目吗?")
    .then(async () => {
      const { code, data, message } = await proxy.$api.jointProject();
      if (code === 200) {
        ElMessage({
          showClose: true,
          message: "已确认",
          type: "success",
        });
        reload();
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};

// 拒绝加入项目组
const refuseJointProject = (row) => {
  ElMessageBox.confirm("确定不加入该项目吗?")
    .then(async () => {
      const { code, data, message } = await proxy.$api.refuseJointProject();
      if (code === 200) {
        ElMessage({
          showClose: true,
          message: "取消成功",
          type: "success",
        });
        reload();
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};

// --------------------------------------------------------
// --------------------------------------------------------

// 项目资源转移模块
// --------------------------------------------------------
// --------------------------------------------------------

// 用户所拥有的模型资源列表
let resourceList = [];
// 用户所选择要转移的资源名称
const selectedResource = ref("");

// 获取所拥有的项目资源模型列表
async function getResourcesList() {
  const { code, data, message } = await proxy.$api.getResourcesList();
  console.log("code, data, message:", code, data, message);
  if (code === 200) {
    resourceList = data;
  } else {
    ElMessage.error(message);
  }
}

// 可转移的目标用户列表
let exchangeUserList = [];
// 用户所选择的转移对象
const selectedUserId = ref("");

// 获取用户可转移的目标用户列表
async function getOtherUserList() {
  const { code, data, message } = await proxy.$api.getOtherUserList();
  console.log("code, data, message:", code, data, message);
  if (code === 200) {
    exchangeUserList = data;
  } else {
    ElMessage.error(message);
  }
}

// 转移模型资源
const submitResourceExchange = async () => {
  if (selectedResource.value == "") {
    ElMessage.error("请选择模型资源");
  } else if (selectedUserId.value == "") {
    ElMessage.error("请选择目标用户");
  } else {
    ElMessageBox.confirm("确定转移吗?")
      .then(async () => {
        const { code, data, message } = await proxy.$api.exchangeResource();
        if (code == 200) {
          ElMessage({
            showClose: true,
            message: "资源转移成功",
            type: "success",
          });
          reload();
        } else {
          ElMessage.error(message);
        }
      })
      .catch(() => {});
  }
};
// --------------------------------------------------------
// --------------------------------------------------------

onMounted(() => {
  // 只有用户权限为2或者3时，才向后端请求数据，即用户为PA或者MA用户
  if (currentUserLevel == "2" || currentUserLevel == "3") {
    // console.log("当前用户权限为: ", currentUserLevel);
    getUserData(config);
  }
  // 只有用户权限为2时，才向后端发送请求，获取可邀请用户列表
  if (currentUserLevel == "2") {
    // console.log("当前用户权限为: ", currentUserLevel);
    getInviteUserList(inviteConfig);
  }
  // 获取接收到的项目邀请列表
  getInviteProjectList(projectInvitedConfig);
  // 只有用户为MA用户时，才存在资源转移功能
  if (currentUserLevel == "1") {
    getResourcesList();
    getOtherUserList();
  }
});
</script>

<style lang="less" scoped>
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
.box {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.el-aside {
  height: 100%;
  border-right: rgb(226, 226, 226) 5px solid;
}
.icons {
  width: 18px;
  height: 18px;
}
.user-main {
  padding: 20px;
}
.exchangeResource {
  display: flex;
}
.m-4 {
  padding-left: 20px;
}
.user-header {
  display: flex;
  width: 100%;
  justify-content: right;
}
</style>>