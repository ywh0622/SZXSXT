<template>
  <p>relation</p>
  <p>可修改内容: {{ msg2 }}</p>
  <div />
  <p>连接测试: {{ msg3 }}</p>
  <p>仓库数据: {{ msg1 }}</p>
  <div />
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick } from "vue";
import { SortUp } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();
import axios from "axios";
let msg1 = ref(null);
let msg2 = ref(null);
let msg3 = ref(null);
// axios.get("/api/repo/modifiableElement").then(
//   (res) => {
//     console.log("请求成功:", res);
//     msg1.value = res.data;
//   },
//   (error) => {
//     console.log("请求失败:", error.messgae);
//   }
// );

const getRepoList = async () => {
  let tempList = await proxy.$api.getRepoList();
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