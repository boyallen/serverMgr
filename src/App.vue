<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div id="app">
    <div class="main-layout">
      <!-- 左侧菜单 -->
      <div class="sidebar">
        <div class="logo">GM管理后台</div>
        <div class="menu">
          <div class="menu-item active">服务器管理</div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.main-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #304156;
  color: #bfcbd9;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  border-bottom: 1px solid #3a4a5c;
}

.menu {
  flex: 1;
  padding: 20px 0;
}

.menu-item {
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  text-align: center;
}

.menu-item:hover {
  background-color: #415369;
}

.menu-item.active {
  background-color: #409eff;
  color: #fff;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
}
</style>
