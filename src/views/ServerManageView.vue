<script setup lang="ts">
import { onMounted } from "vue";
import { useServerStore } from "@/stores/server";
import ServerList from "@/components/ServerList.vue";

const serverStore = useServerStore();

onMounted(() => {
  serverStore.getServers();
});
</script>

<template>
  <div class="server-manage">
    <h2>服务器管理</h2>
    <ServerList />
  </div>
</template>

<style scoped>
.server-manage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 20px;
}

.server-manage h2 {
  margin-bottom: 30px;
  font-size: 16px;
  text-align: center;
}
</style>
