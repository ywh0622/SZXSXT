<template>
  <p>relation</p>
  <p>可修改内容: {{ msg2 }}</p>
  <div />
  <p>连接测试: {{ msg3 }}</p>
  <p>仓库数据: {{ msg1 }}</p>
  <div />
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick, reactive } from "vue";
import { SortUp } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
import axios from "axios";
const store = useStore();
const router = useRouter();

// 获取当前登陆用户以及所操作的项目
store.commit("getCurrentUser");
store.commit("getCurrentUserSelectedProject");
const userAndProject = reactive({
  user: store.state.currentUser,
  project: store.state.selectedProject,
});

let msg1 = ref(null);
let msg2 = ref(null);
let msg3 = ref(null);

const getRepoList = async () => {
  let tempList = await proxy.$api.getRepoList(userAndProject);
  // 向接口请求数据，tempList为得到后的数据
  msg1.value = tempList;
};

const getModifiableElement = async () => {
  let tempModifiableElementList = await proxy.$api.getModifiableElement();
  // 向接口请求数据，tempList为得到后的数据
  msg2.value = tempModifiableElementList;
};

const connect = async () => {
  let testConnectionFlag = await proxy.$api.testConnection();
  msg3.value = testConnectionFlag;
};

onMounted(() => {
  // 该组件被启用时就要调用获取项目总数函数
  getRepoList();
  getModifiableElement();
  connect();
});
</script>

<style>
</style>