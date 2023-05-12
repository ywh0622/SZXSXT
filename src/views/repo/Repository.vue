<template>
  <div class="box">
    <el-container>
      <!-- 模型仓库页面左侧 -->
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
      <!-- 点击具体的模型仓库后的展示部分，即页面右侧 -->
      <el-main>
        <div v-if="currentModelProjects == null" style="font-size: 18px">
          <div class="div1" v-if="currentModel == null">
            <img src="../../assets/home.png" alt="" style="margin: auto" />
          </div>
          <div class="div1" v-if="currentModel == 'MagicDraw'">
            <img src="../../assets/24598.png" alt="" style="margin: auto" />
          </div>
        </div>
        <div v-else>
          <el-tabs type="border-card" class="demo-tabs">
            <!-- Tree View部分 -->
            <el-tab-pane>
              <!-- 标题部分 -->
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><Link /></el-icon>
                  <span>Tree View</span>
                </span>
              </template>
              <!-- 文件树 -->
              <el-tree
                :data="currentModelProjects.childProjects"
                :props="childProjectProps"
                @node-click="childhandleNodeClick"
                highlight-current
              >
                <template #default="{ data }">
                  <component class="icons" :is="data.icon"></component>
                  <span style="margin-left: 10px">{{ data.showName }}</span>
                  <el-button
                    style="margin-left: 600px"
                    type="primary"
                    size="small"
                    @click="showDetails"
                    v-if="showButtonFlag && data.id == childCurrentProject.id"
                    >查看</el-button
                  >
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>

    <!-- 点击查看后的弹出框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="childCurrentProject.showName"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <!-- 标签体属性展示 -->
      <el-form :model="childCurrentProject.elementDetails" label-width="80px">
        <el-form-item
          v-for="(item, idx) in childCurrentProject.elementDetails"
          :key="idx"
          :label="item['Name']"
        >
          <el-input
            @input="handlerChange"
            v-model="item['Value']"
            :disabled="
              modifyButtonFlag == true ? checkModified(item['Name']) : true
            "
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <!-- 点击后可修改的内容框改变 -->
          <el-button
            type="primary"
            @click="testConnection"
            v-if="modifiableElementNum > 0"
          >
            修改
          </el-button>
          <!-- 提交编辑后的信息 -->
          <el-button
            type="primary"
            @click="handleClose"
            v-if="!modifyButtonFlag"
          >
            关闭
          </el-button>
          <el-button
            type="primary"
            @click="changeInfo"
            v-if="modifyButtonFlag"
            :disabled="returnMsg != '连接成功'"
          >
            保存
          </el-button>
          <el-alert
            type="info"
            show-icon
            :closable="false"
            v-if="modifyButtonFlag"
          >
            <p>{{ returnMsg }}</p>
          </el-alert>
        </span>
      </template>
    </el-dialog>
  </div>
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
console.log("userAndProject", userAndProject);

// 左侧 el-tree 获取该项目在所有软件下的模型信息
let projectList = ref([]);
const getProjectDetails = async () => {
  const { code, data, message } = await proxy.$api.getProjectDetails(
    userAndProject.project.selectedProjectId
  );
  if (code == 200) {
    console.log("data:", data);
    projectList.value = data;
  } else {
    ElMessage.error(message);
  }
};

// 左侧 el-tree配置
const projectProps = {
  children: "models",
  label: "modelType",
};

// 左侧 el-tree 点击事件 点击对应项目后，currentModel为当前点击项目软件信息,currentModelProjects为当前点击该项目软件下所属的某个模型
//
let currentModel = ref(null);
let currentModelProjects = ref(null);
const handleNodeClick = (data) => {
  console.log("点击左侧 el-tree 父节点信息:", data);
  // 如果该节点下存在modelType属性，就将modelType属性的值赋给currentModel变量
  if (data.modelType) {
    currentModel.value = data.modelType;
  }
  // 如果该节点下存在子项目，就将子项目的值赋给currentModelProjects变量
  if (data.childProjects) {
    currentModelProjects.value = data;
  } else {
    currentModelProjects.value = null;
  }
  console.log("左侧 el-tree currentModel", currentModel);
  console.log("左侧 el-tree currentModelProjects", currentModelProjects);
};

// 右侧 Tree View 设置
// 右侧 el-tree配置
const childProjectProps = {
  children: "childProjects",
  label: "showName",
};

// 右侧 el-tree 点击事件 点击对应项目后，childCurrentProject为当前点击项目详细信息
let childCurrentProject = ref({
  type: "",
  id: "",
});

// 点击事件，点击具体的节点时，将该节点的信息赋值给childCurrentProject,并且显示查看按钮
let showButtonFlag = ref(false);
const childhandleNodeClick = (data) => {
  childCurrentProject.value = data;
  console.log(
    "右侧 el-tree 点击事件childCurrentProject: ",
    childCurrentProject
  );
  showButtonFlag.value = true;
};

// Tree View页面中 点击查看后弹出相应的内容
// 控制弹窗是否展示
const dialogVisible = ref(false);
// 点击查看后 将dialogVisible设置为true 使窗口出现
// modifiableElementNum表示打开的标签属性中可以修改的属性数量，数量等于1时，打开的显示框中才会显示修改按钮
let modifiableElementNum = ref(0);
const showDetails = () => {
  dialogVisible.value = true;
  // 是否显示修改按钮
  childCurrentProject.value.elementDetails.forEach((item) => {
    if (!checkModified(item.Name)) {
      // 只要存在1个以上可修改的属性，就令modifiableElementNum为1，前端页面就展示这个按钮
      modifiableElementNum.value = 1;
    }
  });
};

// 点击关闭后触发该事件
const handleClose = (done) => {
  ElMessageBox.confirm("是否确认关闭该窗口?")
    .then(() => {
      dialogVisible.value = false;
      modifiableElementNum.value = 0;
      modifyButtonFlag.value = false;
      isRewiriteEditor.value = false;
    })
    .catch(() => {
      // catch error
    });
};

// 提交修改后的信息
const changeInfo = () => {
  ElMessageBox.confirm("是否确认提交?")
    .then(async () => {
      if (isRewiriteEditor.value) {
        const { code, data, message } = await proxy.$api.submitModel();
        if (code == 200) {
          ElMessage({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
          dialogVisible.value = false;
          modifiableElementNum.value = 0;
          modifyButtonFlag.value = false;
          returnMsg.value = "正在测试连接";
          isRewiriteEditor.value = false;
        } else {
          ElMessage.error(message);
        }
        reload();
      } else {
        ElMessage({
          showClose: true,
          message: "未修改数据",
          type: "error",
        });
      }
    })
    .catch(() => {
      // catch error
    });
};

// 获取项目中可以修改的属性名
let modifiableElement = ref([]);
const getModifiableElement = async () => {
  const { code, data, message } = await proxy.$api.getModifiableElement();
  if (code == 200) {
    modifiableElement.value = data;
    console.log("项目中可以修改的属性名: ", data);
  } else {
    ElMessage.error(message);
  }
};

// 属性是否可以修改判断，返回true代表不可以修改，false为可修改
const checkModified = (element) => {
  let flag = true;
  modifiableElement.value.forEach((item) => {
    if (item["modelType"] === currentModel.value) {
      item["attribute"].forEach((item1) => {
        if (
          item1["type"] == childCurrentProject.value["type"] &&
          item1["modifiableName"] == element
        ) {
          flag = false;
        }
      });
    }
  });
  return flag;
};

// 点击修改后，可修改的内容框可以点击并且与后端进行连接测试
let modifyButtonFlag = ref(false);
let returnMsg = ref("正在测试连接");

const testConnection = async () => {
  // 可修改的内容框可以进行修改
  modifyButtonFlag.value = true;
  // 与后端进行连接测试
  const { code, data, message } = await proxy.$api.testConnection();
  if (code == 200) {
    returnMsg.value = "连接成功";
  } else {
    ElMessage.error(message);
  }
};

// 查看框中 每次input框的数据发生改变，该函数都会执行一次
// 标志input框是否修改
let isRewiriteEditor = ref(false);
const handlerChange = (e) => {
  // console.log("输入框改变: ", e);
  isRewiriteEditor.value = true;
};

onMounted(() => {
  // 该组件被启用时就要调用获取项目总数函数
  getProjectDetails();
  getModifiableElement();
});
</script>

<style lang="less" scoped>
.box {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.el-aside {
  height: 100%;
  border-right: rgb(226, 226, 226) 5px solid;
}
.el-tree {
  padding: 5px;
  font-size: 15px;
}
.el-main {
  padding: 0px;
}
.el-tabs {
  font-style: italic;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
.el-tabs--border-card {
  border: 0px;
}
.icons {
  width: 18px;
  height: 18px;
}

.graph {
  height: 500px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.circle1 {
  /*background: burlywood;*/
  background-color: #fff;
  border: 2px solid #000;
  color: #000;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: auto;
  text-align: center; /* 文字水平居中 */
  line-height: 150px;
}
.drawer-btn {
  background-color: #fff;
  border: 0;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  color: #000;
}
.div1 {
  height: 100%;
  border: 0px;
  display: flex;
}
</style>