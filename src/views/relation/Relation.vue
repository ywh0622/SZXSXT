<template>
  <p>relation</p>
</template>

<script setup>
import { getCurrentInstance, onMounted, nextTick, reactive } from "vue";
import { SortUp } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
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

// 获取当前登陆用户id
store.commit("getCurrentUserId");
const currentUserId = store.state.currentUserId;

onMounted(() => {
  // 该组件被启用时就要调用获取项目总数函数
});
</script>

<style>
</style>