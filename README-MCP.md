# Jingle Frontend 页面规范 MCP 服务

这是一个基于 Model Context Protocol (MCP) 的服务，用于在创建新页面时自动提供和检查项目规范。

## 功能特性

### 🔧 工具列表

1. **get_page_guidelines** - 获取页面创建规范

   - 参数：`type` (可选) - 指定规范类型：header, api, component, hook, all
   - 功能：返回详细的开发规范文档

2. **generate_page_template** - 生成规范模板代码

   - 参数：`type` (必需) - 模板类型：page, api, hook
   - 参数：`name` (必需) - 组件/模块名称
   - 功能：根据规范自动生成符合项目标准的代码模板

3. **validate_page_structure** - 验证代码规范

   - 参数：`code` (必需) - 要验证的代码
   - 参数：`type` (必需) - 代码类型：page, api, hook, component
   - 功能：检查代码是否符合项目规范，提供详细的问题报告

4. **get_naming_suggestions** - 获取命名建议
   - 参数：`description` (必需) - 功能描述
   - 参数：`type` (必需) - 命名类型：api, component, hook, file
   - 功能：基于功能描述提供符合规范的命名建议

## 项目规范概览

### 🎯 页面 Header 规范

所有新页面必须使用空 header 配置：

```jsx
header={{
  title: null,
  children: <div className="h-0 w-0" />,
  childrenContentStyle: {
    padding: 0,
    height: 0,
    overflow: 'hidden',
    display: 'none',
    width: 0,
  },
  style: {
    height: 0,
    padding: 0,
  },
}}
```

### 🔌 API 调用规范

- **文件组织**：按功能模块分类，存放在 `src/api/` 目录
- **命名规范**：
  - 列表查询: `xxxList`
  - 添加: `addXxx`
  - 更新: `updateXxx`
  - 删除: `delXxx`
  - 详情: `getXxxById` 或 `getXxxDetail`
- **统一封装**：使用 `request()` 函数
- **分页参数**：必须包含 `pageNumber` 和 `pageSize`

### 🧩 组件开发规范

- **文件命名**：kebab-case (如: `language-switcher.tsx`)
- **组件命名**：PascalCase (如: `LanguageSwitcher`)
- **目录结构**：
  - 共享组件：`src/components/`
  - 页面特有组件：对应页面目录中
- **实现方式**：函数式组件 + React Hooks + TypeScript
- **样式方案**：优先使用 Tailwind CSS

### 🪝 Hook 开发规范

- **命名**：以 `use` 开头，camelCase 规则
- **位置**：`src/hooks/` 目录
- **数据获取**：优先使用 `@tanstack/react-query`
- **状态管理**：优先使用 Zustand
- **事件追踪**：使用 `useSensor`

## 安装和配置

### 1. 安装依赖

```bash
cd src/mcp-server
pnpm install
```

### 2. 构建服务

```bash
pnpm build
```

### 3. 配置 AI 客户端

#### 配置 Cursor IDE (推荐)

**项目配置**：
在项目根目录创建 `.cursor/mcp.json` 文件：

```json
{
  "mcpServers": {
    "jingle-page-guidelines": {
      "command": "node",
      "args": ["src/mcp-server/dist/page-guidelines-server.js"],
      "env": {}
    }
  }
}
```

**全局配置** (可选)：
在用户主目录创建 `~/.cursor/mcp.json` 文件：

```json
{
  "mcpServers": {
    "jingle-page-guidelines": {
      "command": "node",
      "args": [
        "/Users/tao/workspace/jingle-frontend/src/mcp-server/dist/page-guidelines-server.js"
      ],
      "env": {}
    }
  }
}
```

#### 配置 Claude Desktop

将以下配置添加到 Claude Desktop 的配置文件中：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "jingle-page-guidelines": {
      "command": "node",
      "args": ["src/mcp-server/dist/page-guidelines-server.js"],
      "cwd": "/Users/tao/workspace/jingle-frontend"
    }
  }
}
```

### 4. 重启应用

配置完成后重启 Cursor 或 Claude Desktop 即可使用。

## 使用示例

### 获取全部规范

```
请获取页面创建的全部规范
```

### 生成页面模板

```
请为"用户管理"页面生成页面模板
```

### 验证代码规范

```
请验证以下页面代码是否符合规范：
[粘贴代码]
```

### 获取命名建议

```
为"任务管理"功能获取API命名建议
```

## 开发和调试

### 本地运行

```bash
cd src/mcp-server
pnpm dev
```

### 日志查看

服务启动时会在控制台输出日志，可以通过 Claude Desktop 的日志查看详细信息。

## 项目规范详情

### API 响应格式

**列表接口响应**：

```json
{
  "code": 0,
  "msg": "string",
  "data": {
    "records": []
  },
  "time": "2019-08-24T14:15:22.123Z",
  "isSuccess": true
}
```

**普通接口响应**：

```json
{
  "code": 0,
  "msg": "string",
  "data": {},
  "time": "2019-08-24T14:15:22.123Z",
  "isSuccess": true
}
```

### 错误处理

- 401/403 错误自动登出
- 接口错误消息提示
- 请求失败消息提示

### 国际化支持

- 使用 `useTranslation` Hook
- 文本内容统一通过 `t()` 函数处理

---

## 问题反馈

如果在使用过程中遇到问题，请检查：

1. MCP 服务是否正确启动
2. Claude Desktop 配置是否正确
3. 文件路径是否存在

有其他问题请联系开发团队。
