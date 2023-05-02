<template>
  <div class="box">
    <el-container>
      <el-aside width="200px">
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
      <el-main>
        <div v-if="childProjects == null" style="font-size: 18px">
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
                :data="childProjects.childProjects"
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
            <!-- Grapha View部分 -->
            <el-tab-pane>
              <!-- 标题部分 -->
              <template #label>
                <span class="custom-tabs-label">
                  <el-icon><Link /></el-icon>
                  <span>Graph View</span>
                </span>
              </template>
              <div v-if="childProjects.childProjects.length > 0">
                <!-- 图形展示部分 -->
                <div class="graph">
                  <div class="circle1" style="margin-right: 0px">
                    <el-button
                      @click="drawer = true"
                      style="margin: auto"
                      class="drawer-btn"
                    >
                      File1
                    </el-button>
                  </div>
                  <div style="margin: auto 0">-------------------></div>
                  <div
                    class="circle1"
                    style="background-color: red; margin: auto 0px"
                  >
                    <el-button
                      @click="drawer = true"
                      style="margin: auto; background-color: red"
                      class="drawer-btn"
                    >
                      CAD-document
                    </el-button>
                  </div>
                  <div style="margin: auto 0">-------------------></div>
                  <div
                    class="circle1"
                    style="background-color: green; margin-left: 0px"
                  >
                    <el-button
                      @click="drawer = true"
                      style="margin: auto; background-color: green"
                      class="drawer-btn"
                    >
                      MySQL-document
                    </el-button>
                  </div>
                </div>
                <!-- 弹出详情部分 -->
                <el-drawer
                  title="我是标题"
                  v-model="drawer"
                  :with-header="false"
                >
                  <el-descriptions
                    title="Descriptions"
                    :column="1"
                    border
                    style="font-style: normal"
                  >
                    <el-descriptions-item
                      label="Property"
                      :labelStyle="{
                        width: '25px',
                        'font-weight': 'bold',
                        'font-size': '18px',
                      }"
                      :contentStyle="{
                        'font-weight': 'bold',
                        'font-size': '18px',
                      }"
                    >
                      Value
                    </el-descriptions-item>
                    <el-descriptions-item label="project_id"
                      >项目id</el-descriptions-item
                    >
                    <el-descriptions-item label="project_name"
                      >项目名字</el-descriptions-item
                    >
                    <el-descriptions-item label="project_descriptions"
                      >项目描述</el-descriptions-item
                    >
                    <el-descriptions-item label="project_creattime"
                      >项目创建时间</el-descriptions-item
                    >
                    <el-descriptions-item label="model_id"
                      >模型id</el-descriptions-item
                    >
                    <el-descriptions-item label="model_source"
                      >模型源头</el-descriptions-item
                    >
                    <el-descriptions-item label="moudle_target"
                      >模型目标</el-descriptions-item
                    >
                    <el-descriptions-item label="model_data"
                      >模型数据类型</el-descriptions-item
                    >
                    <el-descriptions-item label="model_url"
                      >外部模型数据地址</el-descriptions-item
                    >
                    <el-descriptions-item label="model_version"
                      >模型版本</el-descriptions-item
                    >
                    <el-descriptions-item label="model_modeified"
                      >模型修改时间</el-descriptions-item
                    >
                  </el-descriptions>
                </el-drawer>
              </div>
              <div v-else>暂无数据</div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>

    <!-- 弹出框部分 -->
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
            @click="connect"
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

// 左侧 el-tree配置
const projectProps = {
  // 目前只有一级目录，没有子目录，所以children不需要启用
  children: "models",
  label: "modelType",
};
// 左侧 el-tree 点击事件 点击对应项目后，currentProject为当前点击项目信息,childProjects为当前点击项目信息的子内容
//
let currentModel = ref(null);
let childProjects = ref(null);
const handleNodeClick = (data) => {
  // console.log("父节点信息:", data);
  // 如果该节点下存在modelType属性，就将modelType属性的值赋给currentModel变量
  if (data.modeltype) {
    currentModel.value = data.modeltype;
  }
  // 如果该节点下存在子项目，就将子项目的值赋给childProjects变量
  if (data.childProjects) {
    childProjects.value = data;
  } else {
    childProjects.value = null;
  }
};
// 左侧 el-tree 通过api获取项目
let projectList = ref([]);
const getRepoList = async () => {
  let tempList = await proxy.$api.getRepoList(userAndProject);
  // 向接口请求数据，tempList为得到后的数据
  projectList.value = tempList;
};

const activeName = ref("first");

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
// 点击事件，点击具体的节点时，将该节点的信息赋值给childCurrentProject
// 并且显示查看按钮
let showButtonFlag = ref(false);
const childhandleNodeClick = (data) => {
  childCurrentProject.value = data;
  console.log("childCurrentProject: ", childCurrentProject);
  showButtonFlag.value = true;
};

// 右侧 Graph View 设置
// drawer控制详情框是否弹出，false不弹出，true弹出
let drawer = ref(false);

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
    .then(() => {
      if (isRewiriteEditor.value) {
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
  let tempModifiableElementList = await proxy.$api.getModifiableElement();
  // 向接口请求数据，tempList为得到后的数据
  modifiableElement.value = tempModifiableElementList;
};

// xml属性是否可以修改判断，返回true代表不可以修改，false为可修改
const checkModified = (tagName) => {
  let flag = true;
  modifiableElement.value.forEach((item) => {
    if (item["modelType"] === currentModel.value) {
      item["attribute"].forEach((item1) => {
        if (
          item1["tagName"] == childCurrentProject.value["tagName"] &&
          item1["modifiableName"] == tagName
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
const connect = async () => {
  // 可修改的内容框可以进行修改
  modifyButtonFlag.value = true;
  // 与后端进行连接测试
  let testConnectionFlag = await proxy.$api.testConnection();
  if (testConnectionFlag === "success") {
    returnMsg.value = "连接成功";
  } else {
    returnMsg.value = "连接失败";
  }
  // 如果连接成功，则关闭按钮变为保存
};

// 查看框中 每次input框的数据发生改变，该函数都会执行一次
// 标志input框是否修改
let isRewiriteEditor = ref(false);
const handlerChange = (e) => {
  console.log("输入框改变: ", e);
  isRewiriteEditor.value = true;
};
onMounted(() => {
  // 该组件被启用时就要调用获取项目总数函数
  getRepoList();
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