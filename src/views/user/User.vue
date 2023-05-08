<template>
  <div class="user-main" v-if="currentUserLevel == '1'">
    <!-- 最顶部 新增和搜索区域 -->
    <!-- <div class="user-header">
      <el-button type="primary" @click="handleAdd"> 邀请用户 </el-button>
    </div> -->
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
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">
              分配权限
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              移除用户
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
    <!-- 邀请用户提示框 -->
    <el-dialog
      v-model="dialogVisible"
      title="邀请用户"
      width="35%"
      :before-close="handleClose"
    >
      table
    </el-dialog>
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
  <div class="user-main" v-if="currentUserLevel == 'MA'">
    您暂无权限查看此页面
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessageBox, ElMessage } from "element-plus";

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

// 控制邀请用户提示框的显示与隐藏
const dialogVisible = ref(false);
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
  // {
  //   prop: "email",
  //   label: "邮箱",
  //   width: 230,
  // },
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
  let res = await proxy.$api.changeUserLevel(userAndProject);
  // 获取信息总行数，页面中页码需要提前获取到总数量
  config.total = res.count;
  list.value = res.userList.map((item) => {
    // 手动生成item["ownAuthority"]即前端的已拥有的权限
    item["ownAuthority"] = "";
    item["authority"].forEach((element) => {
      if (element["hasAuthority"]) {
        item["ownAuthority"] += element["modelType"] + " ";
      }
    });
    return item;
  });
}

// 改变页码
const changePage = (page) => {
  // console.log(page );
  config.page = page;
  getUserData(config);
};

// 邀请用户
const handleAdd = () => {
  dialogVisible.value = true;
};

//--------------------------
// 点击邀请用户提示框对话的x
const handleClose = (done) => {
  ElMessageBox.confirm("确定关闭吗?")
    .then(() => {
      // resetFields需要在el-form-item标签体内添加属性prop
      // proxy.$refs.userForm.resetFields();
      done();
    })
    .catch(() => {
      // catch error
    });
};

// 点击邀请用户提示框 表单页面点击取消后，清除表单上面的内容 包括填写的内容和报错提示
const handleCancel = () => {
  dialogVisible.value = false;
  // resetFields需要在el-form-item标签体内添加属性prop
  proxy.$refs.userForm.resetFields();
};

//--------------------------
// 修改用户权限的数据
const formUser = reactive({
  username: "",
  phoneNum: 1,
  email: "",
  department: "",
  authority: [],
});

// 显示用户权限抽屉
const handleEdit = (row) => {
  drawer.value = true;
  // console.log('handleEdit',row)
  // 下面的代码会将得到数据展示到打开的输入框中
  // 如果不加入nexttick函数，直接使用浅拷贝Object.assign(formUser,row)的话
  // 点击编辑后，会将说点击的用户信息显示在编辑框中，但是在关闭这个对话框后
  // 再次点击新增按钮后,弹出的新增框中也会有之前编辑的用户所有信息，
  // 所以为了避免这个情况的发生，需要将浅拷贝放到nextTicK函数中
  proxy.$nextTick(() => {
    // 浅拷贝
    Object.assign(formUser, row);
  });
};

// 点击取消 关闭用户权限抽屉
function cancelClick() {
  drawer.value = false;
  window.location.reload();
}

// 点击确定 关闭用户权限抽屉
function onSubmit() {
  ElMessageBox.confirm("确定了吗?")
    .then(() => {
      drawer.value = false;
      window.location.reload();
      ElMessage({
        showClose: true,
        message: "修改成功",
        type: "success",
      });
    })
    .catch(() => {
      // catch error
    });
}

// 点击修改用户权限提示框对话的x
const handleUserLevelClose = (done) => {
  ElMessageBox.confirm("确定关闭吗?")
    .then(() => {
      window.location.reload();
      done();
    })
    .catch(() => {
      // catch error
    });
};

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm("确定删除吗?")
    .then(async () => {
      const deletedUser = {
        username: row.username,
        department: row.department,
        email: row.email,
        phoneNum: row.phoneNum,
        currentUser: userAndProject.user,
        currentProject: userAndProject.project.selectedProject,
        currentProjectId: userAndProject.project.selectedProjectId,
      };
      await proxy.$api.deleteUser(deletedUser);
      ElMessage({
        showClose: true,
        message: "删除成功",
        type: "success",
      });
      window.location.reload();
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