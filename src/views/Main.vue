<template>
  <div class="common-layout">
    <el-container class="lay-container">
      <!-- 页面左侧菜单栏 -->
      <CommonAside />
      <el-container class="right-container">
        <!-- 页面顶部 -->
        <CommonHeader />
        <el-main>
          <!-- 根据选定的菜单跳转 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import CommonHeader from "../components/CommonHeader.vue";
import CommonAside from "../components/CommonAside.vue";
</script>

<style lang="less" scoped>
.el-container {
  flex-wrap: wrap;
  align-items: flex-start;
}

.common-layout {
  .lay-container {
    flex-wrap: nowrap;
  }
  height: 100%;
  .right-container {
    height: 100%;
  }
  & > .el-container {
    height: 100%;
    & > .el-aside {
      height: 100%;
      background-color: rgb(27, 20, 76);
    }
  }
}
.el-main {
  height: 100%;
  padding: 0;
}
</style>>
  