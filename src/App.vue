<template>
  <router-view v-if="isRouter" />
</template>

<script setup>
import { nextTick, provide, ref } from "vue";
const isRouter = ref(true);
const reload = () => {
  isRouter.value = false;
  nextTick(() => {
    isRouter.value = true;
  });
};
provide("reload", reload);
</script>

<style>
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  /* padding-right: 0px !important; */
  overflow: hidden !important;
}
</style>
