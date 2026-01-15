# Copilot Instructions for Server Manager Frontend

## Project Overview

**Server Manager** is a Vue 3 + TypeScript frontend for game server operations. It provides a dashboard for monitoring and controlling game servers (start, stop, restart, set time) with a Chinese-focused UI.

## Architecture & Data Flow

### Core Tech Stack
- **Framework**: Vue 3 (Composition API) + TypeScript
- **State Management**: Pinia (single `useServerStore`)
- **HTTP**: Native Fetch API (no Axios wrapper despite being in dependencies)
- **UI Components**: Element Plus
- **Build**: Vite with path alias `@` → `src/`

### Key Data Flow Pattern
1. **View** (`ServerManageView.vue`) calls `onMounted()` → triggers store action
2. **Store** (`src/stores/server.ts`) executes async API calls with error handling + fallback mock data
3. **Component** (`ServerList.vue`) receives reactive `serverStore.servers` and renders table
4. **User Actions** (start/stop/restart) → confirmation dialog via `ElMessageBox` → store action → refresh data

### Server Data Structure
```typescript
// Core interface in stores/server.ts
interface Server {
  id: number;
  name: Array<{ code: string; value: string }>; // Multi-language support (zh-Hans, zh-Hant, en)
  gateAddr: string;          // "IP:port" format
  backendAddr: string;       // Not currently used in API
  status: number;            // 0=normal (green), non-0=error (red)
  currentTime?: string;      // ISO format from API or fallback
  // Additional fields: modifyTime, modifyUser, sortId, isOnlyWhiteListOpen
}
```

## API Integration Patterns

### Endpoint Base
- **Production Base URL**: `https://c1p-innertest-center.avalongames.com/v1`
- **Response Format**: Consistent wrapper with `{ code, message, data }` structure

### Critical Methods in Store
- `getServers()` - Fetches server list on app load, has **fallback mock data** for development
- `startServer(serverId)` → POST `/server/op/start/{id}`
- `stopServer(serverId)` → POST `/server/op/stop/{id}`
- `restartServer(serverId)` → POST `/server/op/restart/{id}`
- `setServerTime(serverId, timestamp, syncGameTime?)` → POST `/server/op/time/{id}`

### Error Handling Pattern
All store methods catch errors, log to console, and throw - caller (component) handles with `ElMessage.error()` or dialog catch. Fetch API responses checked with `.ok` property.

## Component Communication & Naming Conventions

### Server ID Confusion (Known Issue)
- **Table binding uses `serverId`** in button handlers (line ~120 `ServerList.vue`)
- **Store Server object has `id`** field
- **Currently works because passed as string** to all store methods, but inconsistent - consider normalizing to use `row.id` consistently

### Multi-language Name Handling
```typescript
// Function needed but not shown in snippets
function getServerName(names: Array<{ code: string; value: string }>) {
  return names.find(n => n.code === 'zh-Hans')?.value || names[0]?.value
}
```
Used in table column but function definition missing from provided code - likely in component but truncated.

## UI/UX Patterns

### Dialog & Confirmation Flow
- **Sensitive operations require `ElMessageBox.confirm()`** before execution
- Success → `ElMessage.success(msg)`, Failure → `ElMessage.error(msg)`
- Time picker dialog (`ElDialog`) with `ElDatePicker` type="datetime"
- Button styling via CSS classes: `.start-btn` (green), `.stop-btn` (red), `.restart-btn` (yellow), `.time-btn` (blue)

### Responsive Constraints
- Main layout: sidebar (200px fixed) + content flex
- Server list table should maintain 16px font, centered text (per PRD section 4.2.1)
- Designed for desktop-first with mobile compatibility mentioned but not prioritized

## Development Workflow

### Key Commands
- `npm run dev` - Start Vite dev server (loads on localhost)
- `npm run build` - Runs `npm run type-check` then `vite build`
- `npm run type-check` - Vue-tsc TypeScript validation (must pass before build)
- `npm run lint` - ESLint + auto-fix for Vue/TS/JS files
- `npm run preview` - Preview built artifacts locally

### Important Notes
- **No type definition files for API responses** - Server interface is the only typed interface, API calls return `any`
- **Language support**: UI is Chinese (zh-CN locale), server names support 3 language codes
- **Loading state** exists (`isLoading` ref) but not currently used in template - add `v-loading="serverStore.isLoading"` to table if implementing

## Common Patterns to Follow

1. **Always use `const serverStore = useServerStore()` at component setup** and access reactive state as `serverStore.servers`
2. **New API methods**: follow existing pattern - use fetch, error handling with try/catch, throw on failure
3. **Confirmation required** for all destructive operations (start/stop/restart)
4. **Table updates** after operations - call `getServers()` to refresh (see `confirmSetTime` example)
5. **DateTime formatting**: use the existing `formatDateTime()` utility in ServerList for consistency

## Potential Tech Debt

- [ ] Axios imported but not used - remove or migrate fetch calls to Axios
- [ ] Missing `getServerName()` function definition - should be in ServerList or utils
- [ ] `backendAddr` field in Server interface never used - confirm if needed
- [ ] `currentTime` field marked optional but always expected - clarify data contract
- [ ] No centralized API configuration - base URL hardcoded in store methods

## File Structure Reference
- Entry: `src/main.ts`
- Root component: `src/App.vue` (sidebar + router outlet)
- Router config: `src/router/index.ts` (single route to ServerManageView)
- State: `src/stores/server.ts` (all API logic + Server interface)
- Views: `src/views/ServerManageView.vue` (mounts ServerList)
- Components: `src/components/ServerList.vue` (table + dialogs)
