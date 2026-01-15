# GM管理后台 TRD

## 3. 技术规格

### 3.1 前端技术栈
- **框架**：Vue 3 + TypeScript
- **UI组件库**：Element Plus
- **状态管理**：Pinia
- **HTTP客户端**：Axios
- **构建工具**：Vite

### 3.2 API接口规范

#### 3.2.1 基础信息
- **Base URL**: `https://api.example.com/v1`
- **数据格式**: JSON
- **字符编码**: UTF-8

#### 3.2.2 通用响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 3.2.3 服务器控制接口
**获取服务器列表**
- **URL**: `GET https://c1p-innertest-center.avalongames.com/v1/serverlist/server`
- **描述**: 获取所有服务器列表，用于在管理页面展示。列表包含服务器ID、多语言名称和网关地址。
- **请求参数**: 无

#### 响应数据结构
```typescript
// 响应根对象
interface ServerListResponse {
  code: number;        // 状态码, 200表示成功
  message: string;     // 错误信息, 成功时为空字符串
  data: ServerData;    // 服务器数据
}

// 服务器数据对象
interface ServerData {
  lst: Server[];       // 服务器列表数组
}

// 单个服务器对象
interface Server {
  id: number;          // 服务器唯一标识
  name: LocalizedName[];  // 多语言服务器名称数组
  gateAddr: string;    // 服务器网关地址 (格式: IP:端口)
}

// 本地化名称对象
interface LocalizedName {
  code: string;        // 语言代码: "zh-Hans" | "zh-Hant" | "en"
  value: string;       // 该语言下的服务器名称
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "",
  "data": {
    "lst": [
      {
        "name": [
          {"code": "zh-Hant", "value": "(V1.1.000)李晖私服"},
          {"code": "en", "value": "(V1.1.000)李晖私服"},
          {"code": "zh-Hans", "value": "(V1.1.000)李晖私服"}
        ],
        "id": 8,
        "gateAddr": "10.172.188.11:21000"
      }
    ]
  }
}
```

**停止服务器**
- **URL**: `POST /server/op/stop`
- **描述**: 停止指定服务器
- **路径参数**:
- **请求示例**:
```json
{
  "force": false, // 是否强制停止
  "saveData": true // 停止前是否保存数据
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "服务器停止成功",
  "data": {
    "serverId": "server_001",
    "status": "stopping",
    "estimatedTime": 10
  }
}
```

**重启服务器**
- **URL**: `POST /server/op/restart`
- **描述**: 重启指定服务器
- **路径参数**:
- **请求示例**:
```json
{
  "force": false,
  "saveData": true
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "服务器重启成功",
  "data": {
    "serverId": "server_001",
    "status": "restarting",
    "estimatedTime": 45
  }
}
```

**设置服务器时间**
- **URL**: `PUT /server/time`
- **描述**: 设置服务器系统时间
- **路径参数**:
  - `serverId`: 服务器ID
- **请求示例**:
```json
{
  "timestamp": "2024-01-01T15:30:00Z", // ISO 8601格式
  "syncGameTime": true // 是否同步游戏内时间
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "服务器时间设置成功",
  "data": {
    "serverId": "server_001",
    "oldTime": "2024-01-01T15:25:00Z",
    "newTime": "2024-01-01T15:30:00Z",
    "syncGameTime": true
  }
}
```

#### 3.2.6 错误码说明
| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 权限不足 |
| 404 | 服务器不存在 |
| 409 | 服务器状态冲突（如重复启动） |
| 500 | 服务器内部错误 |
| 503 | 服务器维护中 |

#### 3.2.7 接口调用限制
- 每个服务器操作间隔至少5秒
- 同一用户每分钟最多调用20次API
- 超出限制返回429状态码