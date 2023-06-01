<template>
  <div class="box">
    <el-container>
      <!-- 历史版本页面左侧 -->
      <el-aside width="250px">
        <el-tree
          :data="projectList"
          :props="projectProps"
          @node-click="handleNodeClick"
          getCurrentKey
          highlight-current
        >
          <template #default="{ data }">
            <component class="icons" :is="data.icon"></component>
            <span style="margin-left: 10px">{{ data.showName }}</span>
          </template>
        </el-tree>
      </el-aside>
      <!-- 点击具体的资源展示历史版本，即页面右侧 -->
      <el-main>
        <div class="table" v-if="versionHistoryData != ''">
          <el-table
            :data="versionHistoryData"
            style="width: 100%"
            height="500px"
          >
            <!-- 遍历给定的tableLabel来得到表格信息框名称 -->
            <el-table-column
              v-for="item in versionTableLabel"
              :key="item.label"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
            />
            <!-- 版本信息操作栏 -->
            <el-table-column fixed="right" label="操作" width="200">
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="getversionDetail(scope.row)"
                >
                  查看
                </el-button>
                <el-button size="small" type="danger" @click="cover(scope.row)">
                  恢复
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 页码栏 -->
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="versionInvitedConfig.total"
            :page-size="versionInvitedConfig.limit"
            @current-change="changePage"
            class="pager mt-4"
          />
        </div>
      </el-main>
    </el-container>
  </div>
  <!-- 历史版本详情查看 -->
  <el-drawer
    v-model="drawer"
    title="历史版本"
    width="30%"
    :before-close="handleClose"
  >
    <el-space wrap>
      <span>项目名称:{{ userAndProject.project.selectedProjectName }}</span>
      <span
        >模型名称:{{ currentModel.modeltype }}-{{ currentModel.showName }}</span
      >
      <span>创建时间:{{ selectedVersion.createTime }}</span>
      <span>版本名称:{{ selectedVersion.versionName }}</span>
    </el-space>
    <div class="tree">
      <el-tree
        :data="specifyVersionDetail.childProjects"
        :props="versionDetailProps"
        highlight-current
      >
        <template #default="{ data }">
          <component class="icons" :is="data.icon"></component>
          <span style="margin-left: 10px">{{ data.showName }}</span>
        </template>
      </el-tree>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { SortUp } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { inject } from "vue";

const reload = inject("reload");
const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();

// 获取当前登陆用户以及所操作的项目
store.commit("getCurrentUser");
store.commit("getCurrentUserSelectedProject");
const userAndProject = reactive({
  user: store.state.currentUser,
  project: store.state.selectedProject,
});

console.log("userAndProject: ", userAndProject);
// 获取当前登陆用户对该项目的权限
store.commit("getCurrentUserLevel");
const currentUserLevel = store.state.currentUserLevel;

// 左侧el-tree 部分代码
// ------------------------------------------------------
// 获取模型所有历史版本信息
let projectList = ref([]);
const getProjectHistoryVersionData = async () => {
  const { code, data, message } =
    await proxy.$api.getProjectHistoryVersionData();
  console.log("code: ", code, " message: ", message, " data : ", data);
  if (code == 200) {
    projectList.value = data;
  } else {
    ElMessage.error(message);
  }
};

// 左侧 el-tree配置
const projectProps = {
  children: "models",
  label: "showName",
};

//左侧 el-tree 点击事件
//点前所点击的节点信息
let currentModel = ref("");
//右侧表格展示的历史版本数据
let versionHistoryData = ref([]);
const handleNodeClick = async (node) => {
  console.log("点击左侧 el-tree 节点信息:", node);
  currentModel.value = node;
  // 如果该节点下存在flag属性,表示用户点击的二级目录，此时需要向后台请求数据
  if (node.flag) {
    let form_data = new FormData();
    form_data.append("limit", 10);
    form_data.append("page", 1);
    form_data.append("modelType", currentModel.value.modelType);
    form_data.append("modelName", currentModel.value.flag);
    const { code, data, message } =
      await proxy.$api.getSpecifyHistoryVersionData(form_data);
    console.log("code: ", code, " message: ", message, " data : ", data);
    if (code == 200) {
      versionInvitedConfig.total = data.count;
      versionHistoryData.value = data.versionList.map((item) => {
        return item;
      });
    } else {
      ElMessage.error(message);
    }
  }
};
// ------------------------------------------------------

// 右侧表格显示部分
// ------------------------------------------------------
// 表格头部内容
const versionTableLabel = reactive([
  {
    prop: "createTime",
    label: "创建时间",
    width: 180,
  },
  {
    prop: "versionName",
    label: "版本名称",
    width: 180,
  },
  {
    prop: "versionNum",
    label: "版本号",
    width: 180,
  },
]);

// 分页配置
const versionInvitedConfig = reactive({
  total: 0,
  page: 1,
  limit: 10,
});

// 获取指定软件下指定模型的历史版本信息
const getVersionData = async (versionInvitedConfig) => {
  let form_data = new FormData();
  form_data.append("limit", versionInvitedConfig.limit);
  form_data.append("page", versionInvitedConfig.page);
  form_data.append("modelType", currentModel.value.modelType);
  form_data.append("modelName", currentModel.value.flag);
  const { code, data, message } = await proxy.$api.getSpecifyHistoryVersionData(
    form_data
  );
  console.log("code, data, message:", code, data, message);
  if (code == 200) {
    // 获取信息总行数，页面中页码需要提前获取到总数量
    versionInvitedConfig.total = data.count;
    versionHistoryData.value = data.versionList.map((item) => {
      return item;
    });
  } else {
    ElMessage.error(message);
  }
};

// 改变页码
const changePage = (page) => {
  versionInvitedConfig.page = page;
  getVersionData(versionInvitedConfig);
};

// 具体历史版本的详细信息
let specifyVersionDetail = ref("");
// 用户所点击的版本信息
let selectedVersion = ref("");

// 获取指定版本详情
const getversionDetail = async (row) => {
  selectedVersion.value = row;
  const { code, data, message } =
    await proxy.$api.getSpecifyHistoryVersionDetailData();
  if (code === 200) {
    specifyVersionDetail.value = data;
    // 显示弹出框
    drawer.value = true;
  } else {
    ElMessage.error(message);
  }
};

// 使用就版本覆盖
const cover = async (row) => {
  ElMessageBox.confirm("确定使用该版本吗?")
    .then(async () => {
      const { code, data, message } = await proxy.$api.cover();
      if (code === 200) {
        ElMessage.success("覆盖成功");
        reload();
      } else {
        ElMessage.error(message);
      }
    })
    .catch(() => {});
};

// ------------------------------------------------------

// 点击查看后的弹出框
// ------------------------------------------------------
// 详细内容弹出框
const drawer = ref(false);

// 弹出框 el-tree配置
const versionDetailProps = {
  children: "childProjects",
  label: "showName",
};

// 点击修改用户权限提示框对话的x
const handleClose = (done) => {
  ElMessageBox.confirm("确定关闭?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
// ------------------------------------------------------

onMounted(() => {
  // 该组件被启用时就要调用获取项目总数函数
  getProjectHistoryVersionData();
});
</script>

<style lang="less" scoped>
.box {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.icons {
  width: 18px;
  height: 18px;
}
.el-aside {
  height: 100%;
  border-right: rgb(226, 226, 226) 5px solid;
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
.tree {
  padding-top: 20px;
}
</style>