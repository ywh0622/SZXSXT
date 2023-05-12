<template>
  <el-aside :width="$store.state.isCollapse ? '64px' : '200px'">
    <el-menu
      class="el-menu-vertical-demo"
      background-color="rgb(27, 20, 76)"
      text-color="#fff"
      :collapse="$store.state.isCollapse"
      :collapse-transition="false"
    >
      <h3 v-show="!$store.state.isCollapse"><span>数字线索系统</span></h3>
      <h3 v-show="$store.state.isCollapse"><span>系统</span></h3>
      <el-menu-item
        :index="item.path"
        v-for="item in noChildren()"
        :key="item.path"
        @click="clickMenu(item)"
      >
        <!-- <el-icon><User /></el-icon> -->
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>
      <el-sub-menu
        :index="item.label"
        v-for="item in hasChildren()"
        :key="item.path"
      >
        <template #title>
          <!-- <el-icon><Location /></el-icon> -->
          <component class="icons" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="(subItem, subIndex) in item.children"
            :key="subIndex"
            :index="subItem.path"
            @click="clickMenu(subItem)"
          >
            <!-- <el-icon><Setting /></el-icon> -->
            <component class="icons" :is="item.icon"></component>
            {{ subItem.label }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

function noChildren() {
  // 子菜单判断
  return asyncList.filter((item) => {
    return !item.children;
  });
}

// 子菜单判断
function hasChildren() {
  return asyncList.filter((item) => {
    return item.children;
  });
}

function clickMenu(item) {
  router.push({
    name: item.name,
  });
  store.commit("selectMenu", item);
}

// 读取store中存储的菜单信息
// 该信息是在用户登陆后，后端返回该用户的菜单列表，然后持久化保存在浏览器中
// 然后这时候页面再去store中state.menu找到该用户的菜单，然后显示在页面左侧
const asyncList = store.state.menu;
</script>

<style lang="less" scoped>
.el-menu {
  border-right: none;
  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
    font-size: 20px;
  }
  .el-menu-item {
    span {
      margin-left: 5px;
    }
  }
}
.icons {
  width: 18px;
  height: 18px;
}
</style>