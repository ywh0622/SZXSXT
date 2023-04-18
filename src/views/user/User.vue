<template>
  <div class="user-main">
    <!-- 最顶部 新增和搜索区域 -->
    <div class="user-header">
      <!-- 新增 -->
      <el-button type="primary" @click="handleAdd"> 新增 </el-button>
      <!-- 搜索 -->
      <el-form :inline="true" :model="formInline">
        <el-form-item label="请输入">
          <el-input
            v-model="formInline.keyword"
            placeholder="用户名/工作部门"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
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
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
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
    <!-- 新增/删除用户提示框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="action == 'add' ? '新增用户' : '编辑用户'"
      width="35%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="formUser" ref="userForm">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="线程软件"
              prop="software"
              :rules="[
                {
                  required: true,
                  message: '线程软件不能为空',
                },
              ]"
            >
              <el-input
                v-model="formUser.software"
                placeholder="请输入线程软件"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="工程负责人"
              prop="name"
              :rules="[
                {
                  required: true,
                  message: '工程负责人不能为空',
                },
              ]"
            >
              <el-input
                v-model="formUser.name"
                placeholder="请输入工程负责人"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="工作部门"
              prop="department"
              :rules="[
                {
                  required: true,
                  message: '工作部门不能为空',
                },
              ]"
            >
              <el-input
                v-model="formUser.department"
                placeholder="请输入工作部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="电话"
              prop="phoneNumber"
              :rules="[
                {
                  required: true,
                  message: '电话不能为空',
                },
              ]"
            >
              <el-input
                v-model.number="formUser.phoneNumber"
                placeholder="请输入电话"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button type="primary" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const list = ref([]);
const tableLabel = reactive([
  {
    prop: "software",
    label: "数字线程软件",
    width: 260,
  },
  {
    prop: "name",
    label: "工程负责人",
    width: 260,
  },
  {
    prop: "department",
    label: "工作部门",
    width: 260,
  },
  {
    prop: "phoneNumber",
    label: "电话",
    width: 260,
  },
]);
const config = reactive({
  total: 0,
  page: 1,
  limit: 11,
  name: "",
});

// 获取用户信息
async function getUserData(config) {
  // console.log('User.vue 调用getUserData函数');
  let res = await proxy.$api.getUserData(config);
  // console.log('User.vue 调用getUserData函数后');
  // console.log('res', res);
  config.total = res.count;
  list.value = res.list.map((item) => {
    return item;
  });
}

const changePage = (page) => {
  // console.log(page );
  config.page = page;
  getUserData(config);
};

const formInline = reactive({
  keyword: "",
});

const handleSearch = () => {
  config.name = formInline.keyword;
  getUserData(config);
};

// 控制对话框的显示与隐藏
const dialogVisible = ref(false);

// 点击对话的x
const handleClose = (done) => {
  ElMessageBox.confirm("确定关闭吗?")
    .then(() => {
      // resetFields需要在el-form-item标签体内添加属性prop
      proxy.$refs.userForm.resetFields();
      done();
    })
    .catch(() => {
      // catch error
    });
};

// 添加/编辑用户的form数据
const formUser = reactive({
  name: "",
  phonenumber: 1,
  software: "",
  department: "",
});

// 添加/编辑用户
const onSubmit = () => {
  // console.log("formUser",formUser);
  proxy.$refs.userForm.validate(async (valid) => {
    if (valid) {
      if (action.value == "add") {
        let res = await proxy.$api.addUser(formUser);
        console.log("res", res);
        if (res) {
          dialogVisible.value = false;
          // console.log(proxy.$refs);
          // console.log(proxy.$refs.userForm);
          // resetFields需要在el-form-item标签体内添加属性prop
          proxy.$refs.userForm.resetFields();
          getUserData(config);
          ElMessage({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      } else {
        // 编辑的接口
        // console.log(formUser);
        let res = await proxy.$api.editUser(formUser);
        // console.log('res',res);
        if (res) {
          dialogVisible.value = false;
          // console.log(proxy.$refs);
          // console.log(proxy.$refs.userForm);
          // resetFields需要在el-form-item标签体内添加属性prop
          proxy.$refs.userForm.resetFields();
          getUserData(config);
        }
        ElMessage({
          showClose: true,
          message: "编辑成功",
          type: "success",
        });
      }
    } else {
      ElMessage({
        showClose: true,
        message: "请输入正确的内容",
        type: "error",
      });
    }
  });
};

// 表单页面点击取消后，清除表单上面的内容 包括填写的内容和报错提示
const handleCancel = () => {
  dialogVisible.value = false;
  // resetFields需要在el-form-item标签体内添加属性prop
  proxy.$refs.userForm.resetFields();
};

// 区分编辑和新增
const action = ref("add");

// 编辑用户
const handleEdit = (row) => {
  console.log("handleEdit", row);
  dialogVisible.value = true;
  action.value = "edit";
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

// 新增用户
const handleAdd = () => {
  dialogVisible.value = true;
  action.value = "add";
};

// 删除用户
const handleDelete = (row) => {
  // console.log(row)
  ElMessageBox.confirm("确定删除吗?")
    .then(async () => {
      // resetFields需要在el-form-item标签体内添加属性prop
      await proxy.$api.deleteUser({
        id: row.id,
      });
      ElMessage({
        showClose: true,
        message: "删除成功",
        type: "success",
      });
      getUserData(config);
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