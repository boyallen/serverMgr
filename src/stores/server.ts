import { ref } from "vue";
import { defineStore } from "pinia";
import { API_ENDPOINTS, buildGatewayUrl, GATEWAY_PATHS } from "@/config";

export interface LocalizedName {
  code: string;
  value: string;
}

export interface Server {
  id: number;
  name: LocalizedName[];
  gateAddr: string;
}

export const useServerStore = defineStore("server", () => {
  const servers = ref<Server[]>([]);
  const isLoading = ref(false);

  const getServers = async () => {
    isLoading.value = true;
    try {
      const response = await fetch(API_ENDPOINTS.SERVER_LIST);
      if (!response.ok) {
        throw new Error(`获取服务器列表失败: ${response.statusText}`);
      }
      const data = await response.json();
      servers.value = data.data.lst;
    } catch (error) {
      console.error("获取服务器列表失败:", error);
      // Fallback to mock data for development
      servers.value = [
        {
          id: 8,
          name: [
            { code: "zh-Hant", value: "(V1.1.000)李晖私服" },
            { code: "en", value: "(V1.1.000)李晖私服" },
            { code: "zh-Hans", value: "(V1.1.000)李晖私服" },
          ],
          gateAddr: "10.172.188.11:21000",
        },
      ];
    } finally {
      isLoading.value = false;
    }
  };

  const startServer = async (serverId: number) => {
    const server = servers.value.find((s) => s.id === serverId);
    if (!server) {
      throw new Error(`未找到ID为${serverId}的服务器`);
    }

    const url = buildGatewayUrl(server.gateAddr, GATEWAY_PATHS.SERVER_OP_START);

    try {
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            force: false,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`启动服务器失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("启动服务器失败:", error);
      throw error;
    }
  };

  const stopServer = async (serverId: number) => {
    const server = servers.value.find((s) => s.id === serverId);
    if (!server) {
      throw new Error(`未找到ID为${serverId}的服务器`);
    }

    const url = buildGatewayUrl(server.gateAddr, GATEWAY_PATHS.SERVER_OP_STOP);

    try {
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            force: false,
            saveData: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`停止服务器失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("停止服务器失败:", error);
      throw error;
    }
  };

  const restartServer = async (serverId: number) => {
    const server = servers.value.find((s) => s.id === serverId);
    if (!server) {
      throw new Error(`未找到ID为${serverId}的服务器`);
    }

    const url = buildGatewayUrl(server.gateAddr, GATEWAY_PATHS.SERVER_OP_RESTART);

    try {
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            force: false,
            saveData: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`重启服务器失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("重启服务器失败:", error);
      throw error;
    }
  };

  const setServerTime = async (
    serverId: number,
    timestamp: string,
    syncGameTime: boolean = true,
  ) => {
    const server = servers.value.find((s) => s.id === serverId);
    if (!server) {
      throw new Error(`未找到ID为${serverId}的服务器`);
    }

    const url = buildGatewayUrl(server.gateAddr, GATEWAY_PATHS.SERVER_TIME);

    try {
      const response = await fetch(
        url,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serverId,
            timestamp,
            syncGameTime,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`设置时间失败: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("设置服务器时间失败:", error);
      throw error;
    }
  };

  return {
    servers,
    isLoading,
    getServers,
    startServer,
    stopServer,
    restartServer,
    setServerTime,
  };
});
