// API Domains
export const API_DOMAINS = {
  CENTER: "https://c1p-innertest-center.avalongames.com",
};

// 常量配置
export const API_CONSTANTS = {
  GATEWAY_PROTOCOL: "http://",
};

// 固定域名的接口
export const API_ENDPOINTS = {
  SERVER_LIST: `${API_DOMAINS.CENTER}/v1/serverlist/server`,
};

// 网关相对路径
export const GATEWAY_PATHS = {
  SERVER_OP_START: "/server/op/start",
  SERVER_OP_STOP: "/server/op/stop",
  SERVER_OP_RESTART: "/server/op/restart",
  SERVER_TIME: "/server/time",
};

export const buildGatewayUrl = (gateAddr: string, path: string) => {
  return `${API_CONSTANTS.GATEWAY_PROTOCOL}${gateAddr}${path}`;
};
