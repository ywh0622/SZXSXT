<template>
  <div class="box">
    <el-container>
      <!-- 模型仓库页面左侧 -->
      <el-aside width="20%" class="side">
        <el-tree
          :data="projectList"
          :props="projectProps"
          @node-click="handleNodeClick"
          getCurrentKey
          highlight-current
        >
          <template #default="{ data }">
            <component class="icons" :is="data.icon"></component>
            <el-tooltip
              effect="dark"
              :content="data.showName"
              :show-after="500"
              placement="bottom-start"
            >
              <span style="margin-left: 5px">{{ data.showName }}</span>
            </el-tooltip>
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
          <el-container>
            <el-aside width="97%">
              <el-tabs type="border-card">
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
                    </template>
                  </el-tree>
                </el-tab-pane>
              </el-tabs>
            </el-aside>
            <el-main width="3%">
              <div class="buttonDisplay">
                <div class="row">
                  <el-tooltip effect="dark" content="查看详情" placement="left">
                    <div class="singleButton">
                      <el-button
                        :icon="Search"
                        :disabled="!showButtonFlag"
                        type="primary"
                        circle
                        @click="showDetails"
                      />
                    </div>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="上传文件" placement="left">
                    <div class="singleButton">
                      <el-button
                        @click="uploadDialog"
                        :icon="Upload"
                        type="primary"
                        circle
                        :disabled="!(hasAuthority == true)"
                      />
                    </div>
                  </el-tooltip>
                </div>
              </div>
            </el-main>
          </el-container>
        </div>
      </el-main>
    </el-container>

    <!-- 点击查看后的弹出框 -->
    <el-drawer
      v-model="dialogVisible"
      :title="childCurrentProject.showName"
      width="30%"
      :before-close="handleClose"
      :close-on-press-escape="false"
      @opened="dataVisualization"
    >
      <!-- 标签体属性展示 -->
      <el-form
        :model="ModifyName"
        label-width="110px"
        ref="childCurrentProjectRef"
        v-if="childCurrentProject.showName != 'Package <Graph View>'"
      >
        <el-form-item label="name" prop="name">
          <el-input
            @input="handlerChange"
            v-model="ModifyName.name"
            :disabled="modifyButtonFlag == true ? checkModified('name') : true"
          />
        </el-form-item>
        <!-- 遍历 elementDetails中key不是name的属性 因为这些属性都无法修改，所以可以直接disable-->
        <el-form-item
          v-for="(item, idx) in elementDetails"
          :key="idx"
          :label="item['Name']"
          v-show="item['Name'] != 'name'"
        >
          <el-input v-model="item['Value']" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <!-- wsy -->
      <div v-if="childCurrentProject.showName == 'Package <Graph View>'">
        <div id="echart" style="width: 400px; height: 400px"></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <!-- 点击后可修改的内容框改变 -->
          <el-button
            type="primary"
            @click="testConnection"
            v-if="modifiableElementNum > 0"
            :auto-insert-space="true"
          >
            修改
          </el-button>
          <!-- 提交编辑后的信息 -->
          <el-button
            type="primary"
            @click="changeInfo"
            v-if="modifyButtonFlag"
            :disabled="returnMsg != '连接成功'"
            :auto-insert-space="true"
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
    </el-drawer>
    <!-- 上传文件框 -->
    <el-drawer
      v-model="uploadDialogVisible"
      title="上传文件"
      width="30%"
      :before-close="uploadHandleClose"
    >
      <el-tabs type="border-card" v-model="activeTabName">
        <!-- 创建新模型 -->
        <el-tab-pane label="创建新模型" name="createNewModel">
          <el-form
            :model="newModelData"
            label-width="90px"
            require-asterisk-position="left"
            ref="newModelDataFormRef"
          >
            <el-form-item label="软件类型" prop="modelType">
              <el-input v-model="newModelData.modelType" disabled />
            </el-form-item>
            <el-form-item
              label="模型名称"
              prop="name"
              :rules="[
                {
                  required: true,
                  message: '模型名称不能为空',
                },
              ]"
            >
              <el-input v-model="newModelData.name" />
            </el-form-item>
            <el-form-item
              label="上传文件"
              prop="file"
              :rules="[
                {
                  required: true,
                  message: '上传文件不能为空',
                },
              ]"
            >
              <el-upload
                action="none"
                multiple
                accept=".json"
                v-model:file-list="newModelData.file"
                :auto-upload="false"
                :limit="1"
              >
                <template #trigger>
                  <el-button type="primary" size="default"
                    >select file</el-button
                  >
                </template>
                <template #tip>
                  <div class="el-upload__tip">只支持上传json格式的文件.</div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item
              label="文件描述"
              prop="desc"
              :rules="[
                {
                  required: true,
                  message: '文件描述不能为空',
                },
              ]"
            >
              <el-input v-model="newModelData.desc" type="textarea" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 覆盖旧模型 -->
        <el-tab-pane label="覆盖已有模型" name="coverOldModel">
          <el-form
            :model="oldModelData"
            label-width="90px"
            require-asterisk-position="left"
            ref="oldModelDataFormRef"
          >
            <el-form-item label="软件类型" prop="modelType">
              <el-input v-model="oldModelData.modelType" disabled />
            </el-form-item>
            <el-form-item
              label="选择模型"
              prop="selectResource"
              :rules="[
                {
                  required: true,
                  message: '模型不能为空',
                },
              ]"
            >
              <el-select
                v-model="oldModelData.selectResource"
                placeholder="选择覆盖模型"
              >
                <el-option
                  v-for="item in currnetModelContainResourceList"
                  :key="item.resourceName"
                  :label="item.resourceName"
                  :value="item.model_id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="上传方式"
              prop="isNewVersion"
              :rules="[
                {
                  required: true,
                  message: '上传方式不能为空',
                },
              ]"
            >
              <el-select
                v-model="oldModelData.isNewVersion"
                placeholder="选择上传方式"
              >
                <el-option label="创建新版本" value="0" />
                <el-option label="覆盖旧版本" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="上传文件"
              prop="file"
              :rules="[
                {
                  required: true,
                  message: '上传文件不能为空',
                },
              ]"
            >
              <el-upload
                action="none"
                multiple
                accept=".json"
                v-model:file-list="oldModelData.file"
                :auto-upload="false"
                :limit="1"
              >
                <template #trigger>
                  <el-button type="primary" size="default"
                    >select file</el-button
                  >
                </template>
                <template #tip>
                  <div class="el-upload__tip">只支持上传json格式的文件.</div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item
              label="文件描述"
              prop="desc"
              :rules="[
                {
                  required: true,
                  message: '文件描述不能为空',
                },
              ]"
            >
              <el-input v-model="oldModelData.desc" type="textarea" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="uploadFile"
            :auto-insert-space="true"
          >
            上传
          </el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick, reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { SortUp, Search, Upload, UploadFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { inject } from "vue";
import * as echarts from "echarts"; //wsy
import $ from "jquery";

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

// 获取当前登陆用户对该项目的权限
store.commit("getCurrentUserLevel");
const currentUserLevel = store.state.currentUserLevel;

// 获取当前登陆用户id
store.commit("getCurrentUserId");
const currentUserId = store.state.currentUserId;
console.log(
  "当前登陆用户: ",
  userAndProject,
  " 登陆用户对该项目的权限: ",
  currentUserLevel,
  " 当前登陆用户id: ",
  currentUserId
);
// 左侧树形图
// ------------------------------------------
// ------------------------------------------
// 左侧 el-tree 获取该项目在所有软件下的模型信息
let projectList = ref([]);
const getProjectDetails = async () => {
  const { code, data, message } = await proxy.$api.getProjectDetails(
    userAndProject.project.selectedProjectId
  );
  if (code == 200) {
    console.log("该项目在所有软件下的模型信息: ", data);
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

// 左侧 el-tree 点击事件 点击对应项目后。currentModel为当前点击项目软件信息,currentModelProjects为当前点击该项目软件下所属的某个模型。currentModelId为当前点击的模型Id,currnetModelContainResourceList为所点击的软件下所有的模型名称及id
let currentModel = ref(null);
let currentModelProjects = ref(null);
let currentModelId = ref(null);
let currnetModelContainResourceList = reactive([]);
const handleNodeClick = (data) => {
  // console.log("点击左侧 el-tree 节点信息:", data);
  currentModel.value = data.modelType;
  // 将modelId属性赋值给currentModelId变量，ModelId值在getProjectDetails函数中已经完成
  // 在各个模型软件下为每个模型添加这个模型软件的modelid
  if (data.model_id) {
    currentModelId.value = data.model_id;
  }
  // 如果该节点下存在子项目，就将子项目的值赋给currentModelProjects变量
  if (data.childProjects) {
    currentModelProjects.value = data;
  } else {
    currentModelProjects.value = null;
  }
  // console.log("左侧 el-tree currentModel", currentModel);
  // console.log("左侧 el-tree currentModelId", currentModelId);
  // console.log("左侧 el-tree currentModelProjects", currentModelProjects);
  // 判断该用户是否有上传权限
  isHoldAuthority2Upload();
  // 用户点击左侧节点后，查看详情功能按钮变灰
  showButtonFlag.value = false;
  // 获取所点击的软件下所有的模型 开始前先置空
  if (currentModel.value != "MagicDraw") {
    if (data.models) {
      currnetModelContainResourceList = [];
      data.models.forEach((item) => {
        let resource = {
          resourceName: item.showName,
          model_id: item.model_id,
        };
        currnetModelContainResourceList.push(resource);
      });
    }
  }
};
// -----------------------------------------------------------------
// -----------------------------------------------------------------

// 右侧 Tree View 设置
// -----------------------------------------------------------------
// -----------------------------------------------------------------
// 右侧 el-tree配置
const childProjectProps = {
  children: "childProjects",
  label: "showName",
};

// 右侧 el-tree 点击事件 点击对应项目后，childCurrentProject为当前点击项目详细信息
let childCurrentProject = reactive({});
// 右侧 el-tree 点击事件 点击对应项目后，elementDetails为当前项目点击查看后显示的内容 将name除去，因为只有name是可以修改的
let elementDetails = reactive([]);
//
let ModifyName = reactive({
  name: "",
});
// 点击事件，点击具体的节点时，将该节点的信息赋值给childCurrentProject,并且显示查看按钮
let showButtonFlag = ref(false);
const childhandleNodeClick = (data) => {
  childCurrentProject = data;
  elementDetails = data.elementDetails;
  elementDetails.forEach((item) => {
    if (item.Name == "name") {
      ModifyName.name = item.Value;
    }
  });
  console.log(
    "右侧 el-tree 点击事件childCurrentProject: ",
    childCurrentProject,
    " elementDetails: ",
    elementDetails,
    " ModifyName: ",
    ModifyName.name
  );
  showButtonFlag.value = true;
};

// Tree View页面中 点击查看后弹出相应的内容
// 控制弹窗是否展示
const dialogVisible = ref(false);
// 点击查看后 将dialogVisible设置为true 使窗口出现
// modifiableElementNum表示打开的标签属性中可以修改的属性数量，数量等于1时，打开的显示框中才会显示修改按钮
let modifiableElementNum = ref(0);
const showDetails = async () => {
  // 将dialogVisible设置为true 使窗口出现
  dialogVisible.value = true;
  // 先设置为0，防止上一次打开后未清0
  modifiableElementNum.value = 0;
  // 只有magicdraw模型才有修改功能，点击为magicdraw，向后端发请求，看是否拥有修改权限
  // 然后再判断是否存在可修改元素来是否显示修改按钮
  if ("MagicDraw" == currentModel.value) {
    let form_data = {
      project_id: userAndProject.project.selectedProjectId,
      user_id: currentUserId,
    };
    const { code, data, message } =
      await proxy.$api.getProjectModelModifyAuthority(form_data);
    if (code == 200 && data.hasAuthority) {
      elementDetails.forEach((item) => {
        // console.log("elementDetails items: ", item, " item.name", item.Name);
        if (!checkModified(item.Name)) {
          // 只要存在1个以上可修改的属性，就令modifiableElementNum为1，前端页面就展示这个按钮
          modifiableElementNum.value = 1;
        }
      });
    }
  }
};

// 查看框点击关闭后触发该事件
const handleClose = () => {
  dialogVisible.value = false;
  modifiableElementNum.value = 0;
  modifyButtonFlag.value = false;
  isRewiriteEditor.value = false;
  proxy.$refs.childCurrentProjectRef.resetFields();
};

// 提交修改后的信息
const changeInfo = () => {
  ElMessageBox.confirm("是否确认提交?")
    .then(async () => {
      if (isRewiriteEditor.value) {
        let form_data = {
          userId: currentUserId,
          // // elementName目前写死，只有name能改变
          elementName: "name",
          newValue: ModifyName.name,
          model_id: currentModelId.value,
          elementId: "",
        };
        elementDetails.forEach((item) => {
          if (item.Name == "id") {
            form_data.elementId = item.Value;
          }
        });
        const { code, data, message } = await proxy.$api.submitModel(form_data);
        if (code == 200) {
          ElMessage.success("修改成功");
          dialogVisible.value = false;
          modifiableElementNum.value = 0;
          modifyButtonFlag.value = false;
          returnMsg.value = "正在测试连接";
          isRewiriteEditor.value = false;
          reload();
        } else {
          ElMessage.error(message);
        }
      } else {
        ElMessage.error("未修改数据");
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
    // console.log("项目中可以修改的属性名: ", data);
  } else {
    ElMessage.error(message);
  }
};

// 属性是否可以修改判断，返回true代表不可以修改，false为可修改
const checkModified = (element) => {
  let flag = true;
  modifiableElement.value.forEach((item) => {
    if (item["modelType"] === currentModel.value) {
      item["attribute"].forEach((detailElements) => {
        if (
          detailElements["type"] == childCurrentProject["type"] &&
          detailElements["modifiableName"] == element
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
  let form_data = {
    user_id: currentUserId,
  };
  const { code, data, message } = await proxy.$api.testConnection(form_data);
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

// 数据可视化 wsy
function dataVisualization() {
  // 后期需要在这加判断，判断childCurrentProject.showName是否是数据可视化节点的名称以及当前项目软件是否为FMU
  // 当前为死数据
  var option = {
    tooltip: {},
    legend: {
      data: ["数量", "其他"],
    },
    xAxis: {
      data: ["1", "2", "3", "4", "5"],
    },
    yAxis: {},
    series: [
      {
        name: "数量",
        type: "line",
        data: [5, 10, 18, 15, 24],
      },
      {
        name: "其他",
        type: "line",
        data: [10, 7, 12, 20, 10],
      },
    ],
  };
  let echart = echarts.init(document.getElementById("echart"));
  console.log(echart);
  echart.setOption(option);
}

// 上传文件代码部分

// 判断用户是否点击了左侧项目软件根节点
// const isClickModel = ref(false);

// 获取MA用户对项目各软件的操作权限
const projectModelAuthorityList = ref(null);
const getProjectModelAuthority = async () => {
  let form_data = {
    project_id: userAndProject.project.selectedProjectId,
    user_id: currentUserId,
  };
  const { code, data, message } = await proxy.$api.getProjectModelAuthority(
    form_data
  );
  if (code == 200) {
    projectModelAuthorityList.value = data;
  } else {
    ElMessage.error(message);
  }
};

// 判断该用户是否有上传权限，PA用户无需判断即可显示上传按钮
// MA用户需要判断是否对该项目指定软件存在上传模型功能
const hasAuthority = ref(false);
const isHoldAuthority2Upload = async () => {
  hasAuthority.value = false;
  // MagicDraw模型软件没有文件上传功能
  if (currentModel.value != "MagicDraw") {
    // 项目管理员默认拥有上传权限(magicDraw除外)
    if (currentUserLevel == "2") {
      hasAuthority.value = true;
      console.log("当前为PA用户,拥有上传权限!");
    } else {
      console.log("当前非PA用户,需要进行上传权限判断!");
      projectModelAuthorityList.value.forEach((item) => {
        if (item["modelType"] == currentModel.value && item["hasAuthority"]) {
          hasAuthority.value = true;
        }
      });
    }
  }
};

// 上传文件框显示与否判断
const uploadDialogVisible = ref(false);

// 用户选中的tab页面
const activeTabName = ref("createNewModel");

// 模型软件对应编号
let model2Id = {
  Creo: 0,
  Excel: 1,
  "FMI(FMU)": 2,
  MagicDraw: 3,
  MATLAB: 4,
  ReqIF: 5,
  STK: 6,
  Txt: 7,
  VisualStudio: 8,
};

// 存放创建新模型的数据
let newModelData = reactive({
  modelType: "",
  name: "",
  file: [],
  desc: "",
});
// 存放覆盖旧模型的数据
let oldModelData = reactive({
  modelType: "",
  selectResource: "",
  isNewVersion: "",
  file: [],
});

// 点击上传按钮后打开上传提示框
const uploadDialog = () => {
  uploadDialogVisible.value = true;
  // 软件类型名称赋值
  newModelData.modelType = currentModel;
  oldModelData.modelType = currentModel;
};

// 点击关闭后触发该事件
const uploadHandleClose = (done) => {
  uploadDialogVisible.value = false;
  // 重置表单
  proxy.$refs.newModelDataFormRef.resetFields();
  proxy.$refs.oldModelDataFormRef.resetFields();
};

// 上传文件
const uploadFile = () => {
  ElMessageBox.confirm("是否确认上传文件?")
    .then(() => {
      // 用户选择创建新模型
      if (activeTabName.value == "createNewModel") {
        proxy.$refs.newModelDataFormRef.validate(async (valid) => {
          if (valid) {
            console.log("用户选中的标签：", activeTabName);
            const form_data = new FormData();
            newModelData.file.forEach((v) => {
              console.log("file: ", v);
              form_data.append("file", v.raw);
            });
            form_data.append(
              "projectId",
              userAndProject.project.selectedProjectId
            );
            form_data.append("userId", currentUserId);
            form_data.append("name", newModelData.name);
            form_data.append("description", newModelData.desc);
            form_data.append("type", model2Id[newModelData.modelType]);
            form_data.append("isCover", 0);
            // 向后端发送信息
            const { code, data, message } = await proxy.$api.uploadFile(
              form_data
            );
            if (code == 200) {
              ElMessage.success("上传成功!");
              // 关闭上传文件退出框
              uploadDialogVisible.value = false;
              // 重置表单
              proxy.$refs.newModelDataFormRef.resetFields();
              reload();
            } else {
              ElMessage.error("上传失败");
            }
          } else {
            ElMessage.error("请输入正确的内容!");
          }
        });
      } else {
        proxy.$refs.oldModelDataFormRef.validate(async (valid) => {
          if (valid) {
            console.log("用户选中的标签：", activeTabName);
            const form_data = new FormData();
            oldModelData.file.forEach((v) => {
              console.log("file: ", v);
              form_data.append("file", v.raw);
            });
            form_data.append(
              "projectId",
              userAndProject.project.selectedProjectId
            );
            form_data.append("userId", currentUserId);
            form_data.append("isCover", 1);
            form_data.append("isNewVersion", oldModelData.isNewVersion);
            form_data.append("modelId", oldModelData.selectResource);
            // 向后端发送信息
            const { code, data, message } = await proxy.$api.uploadFile(
              form_data
            );
            if (code == 200) {
              ElMessage.success("上传成功!");
              // 关闭上传文件退出框
              uploadDialogVisible.value = false;
              // 重置表单
              proxy.$refs.oldModelDataFormRef.resetFields();
              reload();
            } else {
              ElMessage.error("上传失败");
            }
          } else {
            ElMessage.error("请输入正确的内容");
          }
        });
      }
    })
    .catch(() => {
      // catch error
    });
};

// -----------------------------------------------------------------
// -----------------------------------------------------------------

onMounted(() => {
  // 该组件被启用时就要调用获取项目总数函数
  getProjectDetails();
  getModifiableElement();
  // MA 用户才需要
  if (currentUserLevel == "1") {
    getProjectModelAuthority();
  }
});
</script>

<style lang="less" scoped>
.box {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.side {
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
.buttonDisplay {
  padding-top: 50px;
}
.singleButton {
  padding-top: 15px;
}
</style>