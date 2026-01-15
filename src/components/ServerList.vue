<script setup lang="ts">
import { ref } from "vue";
import { useServerStore, type LocalizedName } from "@/stores/server";
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElMessageBox,
  ElDatePicker,
  ElDialog,
  ElMessage,
} from "element-plus";

const serverStore = useServerStore();
const timeDialogVisible = ref(false);
const selectedServerId = ref<number | null>(null);
const selectedDateTime = ref("");

const handleStart = async (serverId: number) => {
  await ElMessageBox.confirm("确认启动服务器？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  await serverStore.startServer(serverId);
};

const handleStop = async (serverId: number) => {
  await ElMessageBox.confirm("确认停止服务器？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  await serverStore.stopServer(serverId);
};

const handleRestart = async (serverId: number) => {
  await ElMessageBox.confirm("确认重启服务器？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });
  await serverStore.restartServer(serverId);
};

const handleSetTime = (serverId: number) => {
  selectedServerId.value = serverId;
  timeDialogVisible.value = true;
};

const confirmSetTime = async () => {
  if (selectedServerId.value === null) return;
  
  await ElMessageBox.confirm("确认设置服务器时间？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  });

  try {
    await serverStore.setServerTime(
      selectedServerId.value,
      selectedDateTime.value,
    );
    ElMessage.success("时间设置成功");
    timeDialogVisible.value = false;
    selectedDateTime.value = "";
    // 刷新服务器数据
    await serverStore.getServers();
  } catch (error) {
    ElMessage.error("设置时间失败");
    console.error("设置时间失败:", error);
  }
};

const getServerName = (names: LocalizedName[]) => {
  // 简单实现：优先显示简体中文，否则显示第一个
  const targetLang = "zh-Hans";
  const nameObj = names.find(n => n.code === targetLang);
  return nameObj ? nameObj.value : (names[0]?.value || "");
};
</script>

<template>
  <div class="server-list">
    <el-table :data="serverStore.servers" style="width: 100%" :center="true">
      <el-table-column prop="id" label="服务器ID" width="120" />
      <el-table-column prop="name" label="服务器名称">
        <template #default="scope">
          {{ getServerName(scope.row.name) }}
        </template>
      </el-table-column>
      <el-table-column prop="gateAddr" label="服务器地址" width="200" />
      <el-table-column label="操作" width="350">
        <template #default="scope">
          <div class="button-group">
            <el-button
              type="success"
              size="small"
              @click="handleStart(scope.row.id)"
              >启动</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleStop(scope.row.id)"
              >停止</el-button
            >
            <el-button
              type="warning"
              size="small"
              @click="handleRestart(scope.row.id)"
              >重启</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="handleSetTime(scope.row.id)"
              >设置时间</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 设置时间对话框 -->
    <el-dialog v-model="timeDialogVisible" title="设置服务器时间" width="400px">
      <el-date-picker
        v-model="selectedDateTime"
        type="datetime"
        placeholder="选择日期时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="timeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSetTime">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.server-list {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dialog-footer {
  text-align: right;
  margin-top: 20px;
}

/* 表格居中显示 */
:deep(.el-table) {
  max-width: 1000px;
  margin: 0 auto;
}

/* 应用字体规范到表格内容 */
:deep(.el-table) {
  font-size: 16px;
  text-align: center;
}

/* 表格表头字体 */
:deep(.el-table th) {
  font-size: 16px;
  text-align: center;
}

/* 表格单元格字体 */
:deep(.el-table td) {
  font-size: 16px;
  text-align: center;
}
</style>
