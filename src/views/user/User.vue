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
        <!-- 用户权限  只有SA和PA用户有-->
        <div v-if="currentFunction == 'userAuthority'">
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
                <el-button
                  type="primary"
                  @click="onSubmit"
                  :auto-insert-space="true"
                  >提交修改</el-button
                >
              </el-form-item>
            </el-form>
          </el-drawer>
        </div>
        <!-- 邀请用户 只有PA用户有-->
        <div v-else-if="currentFunction == 'inviteUser'">
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
        <!-- 加入项目 所有用户都有-->
        <div v-else-if="currentFunction == 'joinProject'">
          <!-- 邀请用户功能展示区域 -->
          <div class="table">
            <div v-if="projectInvitedList == null">
              <p>暂未收到项目加入邀请</p>
            </div>
            <div v-else>
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
            </div>
            <!-- 页码栏 -->
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="projectInvitedConfig.total"
              :page-size="projectInvitedConfig.limit"
              @current-change="changeProjectInvitedPage"
              class="pager mt-4"
            />
          </div>
        </div>
        <!-- 资源转移 只有MA用户有-->
        <div v-else-if="currentFunction == 'exchangeResource'">
          <div class="exchangeResource">
            <div class="m-4">
              <p style="padding-bottom: 10px">模型软件</p>
              <el-select
                v-model="selectedModelSoftware"
                placeholder="请选择模型软件"
                @change="getSoftwareName"
              >
                <el-option
                  v-for="item in modelSoftwareList"
                  :key="item.modelSoftware"
                  :label="item.modelSoftware"
                  :value="item.modelSoftware"
                />
              </el-select>
            </div>
            <div class="m-4">
              <p style="padding-bottom: 10px">模型资源</p>
              <el-select
                v-model="selectedResourceId"
                placeholder="请选择模型资源"
              >
                <el-option
                  v-for="item in modelResourceList"
                  :key="item.resourceId"
                  :label="item.resourceName"
                  :value="item.resourceId"
                />
              </el-select>
            </div>
            <div class="m-4">
              <p style="padding-bottom: 10px">目标用户</p>
              <el-select
                v-model="selectedUsername"
                placeholder="请选择目标用户"
              >
                <el-option
                  v-for="item in exchangeUserList"
                  :key="item.userId"
                  :label="item.username"
                  :value="item.username"
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
        <!-- SA用户审核PA用户申请 -->
        <div v-else-if="currentFunction == 'paUserApply'">
          <div class="table">
            <div v-if="paUserApplyList == null">
              <p>暂未收到PA用户申请</p>
            </div>
            <div v-else>
              <el-table
                :data="paUserApplyList"
                style="width: 100%"
                height="500px"
              >
                <!-- 遍历给定的tableLabel来得到表格信息框名称 -->
                <el-table-column
                  v-for="item in paUserApplyTableLabel"
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
                      @click="acceptPa(scope.row)"
                    >
                      通过
                    </el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click="refusePa(scope.row)"
                    >
                      拒绝
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 页码栏 -->
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="paUserApplyConfig.total"
              :page-size="paUserApplyConfig.limit"
              @current-change="changePaUserApplyPage"
              class="pager mt-4"
            />
          </div>
        </div>
        <!-- PA用户创建新项目 -->
        <div v-else-if="currentFunction == 'createProject'">
          <el-form
            :model="newProject"
            label-width="85px"
            require-asterisk-position="right"
            ref="createNewProjectRef"
          >
            <el-form-item
              label="项目名称"
              prop="name"
              :rules="[
                {
                  required: true,
                  message: '项目名称不能为空',
                },
              ]"
            >
              <el-input
                v-model="newProject.name"
                placeholder="请输入项目名称"
              />
            </el-form-item>
            <el-form-item
              label="项目简介"
              prop="description"
              :rules="[
                {
                  required: true,
                  message: '项目简介不能为空',
                },
              ]"
            >
              <el-input
                v-model="newProject.description"
                placeholder="请输入项目简介"
                type="textarea"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createNewProject">
                创建项目
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- PA用户项目资源管理 -->
        <div v-else-if="currentFunction == 'projectManage'">
          <!--项目资源展示区域 -->
          <div class="table">
            <el-table :data="paProjectList" style="width: 100%" height="500px">
              <!-- 遍历给定的tableLabel来得到表格信息框名称 -->
              <el-table-column
                v-for="item in paProjectTableLabel"
                :key="item.label"
                :label="item.label"
                :prop="item.prop"
                :width="item.width"
              />
              <!-- 用户信息操作栏 -->
              <el-table-column fixed="right" label="操作" width="500">
                <template #default="scope">
                  <el-button size="small" @click="paProjectEdit(scope.row)">
                    更新项目资源
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="paDeleteProject(scope.row)"
                  >
                    删除项目资源
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 页码栏 -->
            <el-pagination
              small
              background
              layout="prev, pager, next"
              :total="paProjectConfig.total"
              :page-size="paProjectConfig.limit"
              @current-change="changePaProjectManagePage"
              class="pager mt-4"
            />
          </div>
          <!-- 修改项目资源 -->
          <el-drawer v-model="projectDrawer" :before-close="handleProjectClose">
            <template #header>
              <h4>项目资源修改</h4>
            </template>
            <el-form
              :model="updateProject"
              ref="projectRef"
              label-width="120px"
            >
              <el-form-item label="项目名称" prop="name">
                <el-input v-model="updateProject.name" />
              </el-form-item>
              <el-form-item label="项目简介" prop="description">
                <el-input v-model="updateProject.description" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="paUpdateProject"
                  :auto-insert-space="true"
                  >提交修改</el-button
                >
              </el-form-item>
            </el-form>
          </el-drawer>
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

// 获取当前登陆用户ID
store.commit("getCurrentUserId");
const currentUserId = store.state.currentUserId;

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
      tagName: "加入其他项目确认",
      tagNickName: "joinProject",
      icon: "folder",
    },
    {
      tagName: "创建项目",
      tagNickName: "createProject",
      icon: "folder",
    },
    {
      tagName: "项目资源管理",
      tagNickName: "projectManage",
      icon: "folder",
    },
  ];
  currentFunction.value = "userAuthority";
} else if (currentUserLevel == "1") {
  //项目参与者 MA
  data = [
    {
      tagName: "加入其他项目确认",
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
      tagName: "加入其他项目确认",
      tagNickName: "joinProject",
      icon: "folder",
    },
    {
      tagName: "PA用户申请",
      tagNickName: "paUserApply",
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
  // console.log("data",data);
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
      prop: "phone",
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
      prop: "phone",
      label: "手机号",
      width: 180,
    },
  ];
}

// 分页配置
const config = reactive({
  total: 0,
  page: 1,
  limit: 11,
});

// 获取用户信息
async function getUserData(config) {
  // 登陆用户为管理员
  if (currentUserLevel == "3") {
    let form_data = {
      pageSize: config.limit,
      pageIndex: config.page,
    };
    const { code, data, message } = await proxy.$api.getUserDetails(form_data);
    // console.log("code, data, message:", code, data, message);
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
    let form_data = {
      pageSize: config.limit,
      pageIndex: config.page,
      project_id: userAndProject.project.selectedProjectId,
    };
    const { code, data, message } = await proxy.$api.getUserLevel(form_data);
    // console.log("登陆用户非管理员: code, data, message:", code, data, message);
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

// 点击修改用户权限提示框对话的x
const handleUserLevelClose = (done) => {
  reload();
  done();
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
    prop: "phone",
    label: "手机号",
    width: 180,
  },
  {
    prop: "email",
    label: "邮箱",
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
  let form_data = {
    pageSize: inviteConfig.limit,
    pageIndex: inviteConfig.page,
    project_id: userAndProject.project.selectedProjectId,
  };
  const { code, data, message } = await proxy.$api.getInviteUserList(form_data);
  // console.log("code, data, message:", code, data, message);
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
    let form_data = {
      username: formInline.keyword,
    };
    const { code, data, message } = await proxy.$api.getSpecifyUser(form_data);
    console.log("code, data, message:", code, data, message);
    if (code == 200) {
      formInline.keyword = "";
      // 获取信息总行数，页面中页码需要提前获取到总数量
      inviteConfig.limit = 11;
      inviteConfig.page = 1;
      inviteConfig.total = data.count;
      inviteUserList.value = data.userList.map((item) => {
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
      let form_data = new FormData();
      form_data.append("projet_id", userAndProject.project.selectedProjectId);
      form_data.append("username", row.username);
      const { code, data, message } = await proxy.$api.inviteUser(form_data);
      // console.log("code, data, message:", code, data, message);
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

// 获取接收到的项目邀请信息
async function getInviteProjectList(projectInvitedConfig) {
  let form_data = {
    pageIndex: projectInvitedConfig.page,
    pageSize: projectInvitedConfig.limit,
    user_id: currentUserId,
  };
  const { code, data, message } = await proxy.$api.getInviteProjectList(
    form_data
  );
  // console.log("code, data, message:", code, data, message);
  if (code == 200) {
    // 获取信息总行数，页面中页码需要提前获取到总数量
    if (data.count != 0) {
      projectInvitedConfig.total = data.count;
      projectInvitedList.value = data.projectList.map((item) => {
        return item;
      });
    } else {
      projectInvitedList.value = null;
    }
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
      let form_data = new FormData();
      form_data.append("project_id", row.projectId);
      form_data.append("user_id", currentUserId);
      const { code, data, message } = await proxy.$api.jointProject(form_data);
      if (code === 200) {
        ElMessage({
          showClose: true,
          message: "已接收邀请!",
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
      let form_data = new FormData();
      form_data.append("project_id", row.projectId);
      form_data.append("user_id", currentUserId);
      const { code, data, message } = await proxy.$api.refuseJointProject(
        form_data
      );
      if (code === 200) {
        ElMessage({
          showClose: true,
          message: "已拒绝!",
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

// 用户所拥有的模型软件资源列表
let modelSoftwareList = [];
// 用户所选择要转移的模型软件名称
let selectedModelSoftware = ref("");
// 该模型软件下资源名称列表
let modelResourceList = [];
// 用户所选择要转移的模型软件下指定资源名称
let selectedResourceId = ref("");

// 获取所拥有的项目资源模型列表
async function getResourcesList() {
  let form_data = {
    user_id: currentUserId,
    project_id: userAndProject.project.selectedProjectId,
  };
  const { code, data, message } = await proxy.$api.getResourcesList(form_data);
  // console.log("code, data, message:", code, data, message);
  if (code === 200) {
    modelSoftwareList = data;
  } else {
    ElMessage.error(message);
  }
}

// 用户点击具体的模型软件后，得到该模型软件内的模型资源
const getSoftwareName = (rows) => {
  modelSoftwareList.forEach((item) => {
    if (item.modelSoftware == rows) {
      modelResourceList = item.resources;
    }
  });
};

// 可转移的目标用户列表
let exchangeUserList = [];
// 用户所选择的转移对象
let selectedUsername = ref("");

// 获取用户可转移的目标用户列表
async function getOtherUserList() {
  let form_data = {
    user_id: currentUserId,
    project_id: userAndProject.project.selectedProjectId,
  };
  const { code, data, message } = await proxy.$api.getOtherUserList(form_data);
  // console.log("code, data, message:", code, data, message);
  if (code === 200) {
    exchangeUserList = data;
  } else {
    ElMessage.error(message);
  }
}

// 转移模型资源
const submitResourceExchange = async () => {
  if (selectedModelSoftware.value == "") {
    ElMessage.error("请选择模型软件!");
  } else if (selectedResourceId.value == "") {
    ElMessage.error("请选择模型资源!");
  } else if (selectedUsername.value == "") {
    ElMessage.error("请选择目标用户!");
  } else {
    ElMessageBox.confirm("确定转移吗?")
      .then(async () => {
        let form_data = {
          newUsername: selectedUsername.value,
          oldUsername: userAndProject.user,
          modelId: selectedResourceId.value,
        };
        const { code, data, message } = await proxy.$api.exchangeResource(
          form_data
        );
        console.log("code, data, message:", code, data, message);
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

// SA用户审核PA用户申请模块
// --------------------------------------------------------
// --------------------------------------------------------

// pa用户申请列表
const paUserApplyList = ref([]);

// 表格头部内容
const paUserApplyTableLabel = reactive([
  {
    prop: "username",
    label: "用户名称",
    width: 180,
  },
  {
    prop: "department",
    label: "部门",
    width: 180,
  },
  {
    prop: "email",
    label: "邮箱",
    width: 180,
  },
  {
    prop: "phone",
    label: "电话",
    width: 180,
  },
]);

// 分页配置
const paUserApplyConfig = reactive({
  total: 0,
  page: 1,
  limit: 11,
});

// 获取pa用户申请信息
async function getPaUserApplyList(paUserApplyConfig) {
  let form_data = {
    pageIndex: paUserApplyConfig.page,
    pageSize: paUserApplyConfig.limit,
  };
  const { code, data, message } = await proxy.$api.saGetPaApply(form_data);
  // console.log("code, data, message:", code, data, message);
  if (code == 200) {
    // 获取信息总行数，页面中页码需要提前获取到总数量
    if (data.count != 0) {
      paUserApplyConfig.total = data.count;
      paUserApplyList.value = data.userList.map((item) => {
        return item;
      });
    } else {
      paUserApplyList.value = null;
    }
  } else {
    ElMessage.error(message);
  }
}

// 改变页码
const changePaUserApplyPage = (page) => {
  paUserApplyConfig.page = page;
  getPaUserApplyList(paUserApplyConfig);
};

// 通过
const acceptPa = (row) => {
  ElMessageBox.confirm("确定通过吗?")
    .then(async () => {
      let form_data = new FormData();
      form_data.append("user_id", row.userId);
      const { code, data, message } = await proxy.$api.saAcceptPaApply(
        form_data
      );
      // console.log("通过code, data, message:", code, data, message);
      if (code == 200) {
        ElMessage.success("通过该PA用户申请!");
        getPaUserApplyList(paUserApplyConfig);
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};

// 拒绝
const refusePa = (row) => {
  ElMessageBox.confirm("确定拒绝吗?")
    .then(async () => {
      let form_data = new FormData();
      form_data.append("user_id", row.userId);
      const { code, data, message } = await proxy.$api.saRefusePaApply(
        form_data
      );
      console.log("拒绝code, data, message:", code, data, message);
      if (code == 200) {
        ElMessage.success("已拒绝该PA用户申请!");
        getPaUserApplyList(paUserApplyConfig);
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};
// --------------------------------------------------------
// --------------------------------------------------------
// PA创建项目功能
// --------------------------------------------------------
// --------------------------------------------------------
let newProject = reactive({
  userName: userAndProject.user,
  name: "",
  description: "",
});

const createNewProject = () => {
  proxy.$refs.createNewProjectRef.validate(async (valid) => {
    if (valid) {
      const { code, data, message } = await proxy.$api.createNewProject(
        newProject
      );
      if (code == 200) {
        ElMessage.success("创建新项目成功!");
        reload();
      } else {
        ElMessage.error(message);
      }
    } else {
      ElMessage.error("请输入正确的内容!");
    }
  });
};
// --------------------------------------------------------
// --------------------------------------------------------
// PA用户项目资源管理
// --------------------------------------------------------
// --------------------------------------------------------
// PA用户项目资源列表
const paProjectList = ref([]);

// 表格头部内容
const paProjectTableLabel = reactive([
  {
    prop: "projectName",
    label: "项目名称",
    width: 180,
  },
]);

// 分页配置
const paProjectConfig = reactive({
  total: 0,
  page: 1,
  limit: 11,
});

// 获取PA用户项目资源列表
async function getPaProjectList(paProjectConfig) {
  let form_data = {
    user_id: currentUserId,
    pageIndex: paProjectConfig.page,
    pageSize: paProjectConfig.limit,
  };
  const { code, data, message } = await proxy.$api.getPaProject(form_data);
  // console.log(
  //   "获取PA用户项目资源列表 code, data, message:",
  //   code,
  //   data,
  //   message
  // );
  if (code == 200) {
    // 获取信息总行数，页面中页码需要提前获取到总数量
    if (data.count != 0) {
      paProjectConfig.total = data.count;
      paProjectList.value = data.projects.map((item) => {
        return item;
      });
    } else {
      paProjectList.value = null;
    }
  } else {
    ElMessage.error(message);
  }
}

// 改变页码
const changePaProjectManagePage = (page) => {
  paProjectConfig.page = page;
  getPaProjectList(paProjectConfig);
};

// 打开更新项目资源页面
let projectDrawer = ref(false);

// 详情页面数据
let updateProject = reactive({
  project_id: "",
  name: "",
  description: "",
});

// 显示PA用户项目资源详情抽屉
const paProjectEdit = (row) => {
  projectDrawer.value = true;
  updateProject.project_id = row.projectId;
  updateProject.name = row.projectName;
  updateProject.description = row.description;
};

// 点击修改用户权限提示框对话的x
const handleProjectClose = (done) => {
  projectDrawer.value = false;
  proxy.$refs.projectRef.resetFields();
};

// 更新项目信息
const paUpdateProject = () => {
  ElMessageBox.confirm("确定修改吗?")
    .then(async () => {
      const { code, data, message } = await proxy.$api.paUpdateProject(
        updateProject
      );
      // console.log("通过code, data, message:", code, data, message);
      if (code == 200) {
        ElMessage.success("修改成功!");
        projectDrawer.value = false;
        getPaProjectList(paProjectConfig);
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};

// 删除
const paDeleteProject = (row) => {
  ElMessageBox.confirm("确定删除吗?")
    .then(async () => {
      let form_data = {
        project_id: row.projectId,
      };
      const { code, data, message } = await proxy.$api.paDeleteProject(
        form_data
      );
      console.log("删除code, data, message:", code, data, message);
      if (code == 200) {
        ElMessage.success("删除成功!");
        getPaProjectList(paProjectConfig);
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};
// --------------------------------------------------------
// --------------------------------------------------------

onMounted(() => {
  // 获取接收到的项目邀请列表
  getInviteProjectList(projectInvitedConfig);
  // 只有用户为SA用户
  if (currentUserLevel == "3") {
    // console.log("当前用户权限为: ", currentUserLevel);\
    getUserData(config);
    getPaUserApplyList(paUserApplyConfig);
  }
  // 只有用户为PA用户
  if (currentUserLevel == "2") {
    // console.log("当前用户权限为: ", currentUserLevel);
    getInviteUserList(inviteConfig);
    getUserData(config);
    getPaProjectList(paProjectConfig);
  }
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