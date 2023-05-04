<template>
  <el-header>
    <div class="l-content">
      <el-button size="small" plain @click="handleCollapse">
        <el-icon size="20">
          <Menu />
        </el-icon>
      </el-button>
      <!--  面包屑 -->
      <el-breadcrumb separator="/">
        <!-- 首页一定是存在的  直接写死 -->
        <el-breadcrumb-item :to="{ path: '/' }"
          ><span>首页</span></el-breadcrumb-item
        >
        <el-breadcrumb-item
          :to="current.path"
          v-if="current && $route.name == current.name"
        >
          <span>{{ current.label }}</span>
          <span class="blank">/</span>
          <span>{{ currentProjectName }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="imgSrc" alt="" class="user" />
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const store = useStore();
const router = useRouter();
const imgSrc = require("../assets/user1.jpg");

function handleCollapse() {
  store.commit("updateCollapse", "123");
}

const current = computed(() => {
  return store.state.currentMenu;
});

// 获取当前项目名称
store.commit("getCurrentUserSelectedProject");
const currentProjectName = store.state.selectedProject.selectedProjectName;
const handleLoginOut = () => {
  store.commit("cleanMenu");
  store.commit("clearToken");
  store.commit("clearCurrentUser");
  store.commit("clearCurrentUserLevel");
  store.commit("clearCurrentUserProjectList");
  store.commit("clearCurrentUserSelectedProject");
  router.push({
    name: "login",
  });
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #eaedf1;
}
.blank {
  padding-left: 8px;
  padding-right: 8px;
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
:deep(.bread span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>