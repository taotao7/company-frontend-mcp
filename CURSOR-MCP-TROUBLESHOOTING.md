# Cursor MCP 故障排除指南

## 问题：显示 "0 tools enabled"

如果您在 Cursor 中看到"0 tools enabled"，请按照以下步骤进行排查：

### ✅ 检查清单

#### 1. 确认配置文件存在

```bash
# 检查项目配置文件是否存在
ls -la .cursor/mcp.json

# 查看配置文件内容
cat .cursor/mcp.json
```

#### 2. 确认 Node.js 版本

```bash
node -v
# 应该显示 >= v18.0.0
```

#### 3. 确认 MCP 服务器文件存在

```bash
ls -la src/mcp-server/dist/page-guidelines-server.js
```

#### 4. 测试 MCP 服务器是否能启动

```bash
# 简单测试（会快速退出）
node src/mcp-server/dist/page-guidelines-server.js
```

### 🔧 解决方案

#### 解决方案 1：重新构建和配置

```bash
# 重新运行Cursor设置脚本
./scripts/setup-cursor-mcp.sh
```

#### 解决方案 2：手动创建配置

如果自动脚本失败，请手动创建配置：

```bash
# 创建.cursor目录
mkdir -p .cursor

# 创建配置文件
cat > .cursor/mcp.json << 'EOF'
{
  "mcpServers": {
    "jingle-page-guidelines": {
      "command": "node",
      "args": ["src/mcp-server/dist/page-guidelines-server.js"],
      "env": {}
    }
  }
}
EOF
```

#### 解决方案 3：使用绝对路径

如果相对路径有问题，尝试使用绝对路径：

```bash
# 获取当前项目路径
PROJECT_PATH=$(pwd)

# 创建使用绝对路径的配置
cat > .cursor/mcp.json << EOF
{
  "mcpServers": {
    "jingle-page-guidelines": {
      "command": "node",
      "args": ["$PROJECT_PATH/src/mcp-server/dist/page-guidelines-server.js"],
      "env": {}
    }
  }
}
EOF
```

### 🔄 Cursor 特定步骤

#### 1. 重启 Cursor

完全关闭并重新打开 Cursor IDE。

#### 2. 检查 MCP 设置

- 打开 Cursor 设置
- 导航到 MCP 部分
- 确认服务器被正确识别

#### 3. 查看 Cursor 日志

- 在 Cursor 中按 `Cmd/Ctrl + Shift + P`
- 搜索 "Developer: Reload Window"
- 检查开发者控制台是否有错误

### 🐛 常见问题

#### 问题 1：权限错误

```bash
# 确保脚本有执行权限
chmod +x scripts/setup-cursor-mcp.sh

# 确保Node.js文件可读
chmod 644 src/mcp-server/dist/page-guidelines-server.js
```

#### 问题 2：路径问题

- 确保当前工作目录是项目根目录
- 检查配置文件中的路径是否正确
- 在配置中使用绝对路径

#### 问题 3：端口或进程冲突

```bash
# 检查是否有其他MCP服务在运行
ps aux | grep page-guidelines-server

# 如果有，杀死进程
pkill -f page-guidelines-server
```

### 📋 验证步骤

配置完成后，按照以下步骤验证：

1. **重启 Cursor IDE**
2. **打开聊天界面**
3. **查看工具状态**：应该显示可用工具数量 > 0
4. **测试工具**：发送消息 "请获取页面创建规范"

### 🆘 最终方案

如果以上方案都不工作，尝试全局配置：

```bash
# 创建全局配置目录
mkdir -p ~/.cursor

# 创建全局配置文件
cat > ~/.cursor/mcp.json << EOF
{
  "mcpServers": {
    "jingle-page-guidelines": {
      "command": "node",
      "args": ["$(pwd)/src/mcp-server/dist/page-guidelines-server.js"],
      "env": {}
    }
  }
}
EOF
```

### 📞 获取帮助

如果问题仍然存在：

1. **收集信息**：

   - Cursor 版本
   - Node.js 版本
   - 操作系统版本
   - 错误日志

2. **检查官方文档**：

   - [Cursor MCP 文档](https://docs.cursor.com/context/model-context-protocol)

3. **社区支持**：
   - Cursor Discord 服务器
   - GitHub Issues

---

## 快速命令参考

```bash
# 完整重新设置
./scripts/setup-cursor-mcp.sh

# 检查状态
ls -la .cursor/mcp.json
node -v
ls -la src/mcp-server/dist/

# 手动测试
node src/mcp-server/dist/page-guidelines-server.js

# 重建服务
pnpm mcp:build
```
