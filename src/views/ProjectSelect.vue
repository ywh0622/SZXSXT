<template>
  <div class="login_style">
    <div class="login_box">
      <div class="title_area">
        <h1>数字线索系统</h1>
      </div>
      <el-form
        :model="selectedProject"
        ref="selectedProjectRef"
        require-asterisk-position="right"
      >
        <el-form-item
          label="project"
          label-width="150px"
          prop="project"
          :rules="[
            {
              required: true,
              message: '请选择项目',
            },
          ]"
        >
          <el-select v-model="selectedProject.project" placeholder="选择项目">
            <el-option label="MagicDraw" value="MagicDraw" />
            <el-option label="MatLab" value="MatLab" />
            <el-option label="MatLab" value="MatLab" />
            <el-option label="MatLab" value="MatLab" />
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
import { reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();

const store = useStore();
const router = useRouter();

const selectedProject = reactive({
  project: "",
});

const Continue = () => {
  proxy.$refs.selectedProjectRef.validate(async (valid) => {
    // console.log("ccc");
    // console.log("selectedProject : ", selectedProject.project);
    if (valid) {
      console.log("valid = ", valid);
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
</script>

<style lang="less" scoped>
.title_area {
  text-align: center;
  font-size: 200%;
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