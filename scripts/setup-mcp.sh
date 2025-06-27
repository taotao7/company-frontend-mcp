#!/bin/bash

echo "🚀 设置 Jingle Frontend MCP 服务..."

# 1. 安装依赖
echo "📦 安装依赖..."
pnpm mcp:install

# 2. 构建服务
echo "🔨 构建服务..."
pnpm mcp:build

# 3. 生成配置文件路径
PROJECT_ROOT=$(pwd)
CONFIG_FILE="$PROJECT_ROOT/mcp-server-config.json"

echo "📝 更新配置文件路径..."
cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "jingle-page-guidelines": {
      "command": "node",
      "args": ["src/mcp-server/dist/page-guidelines-server.js"],
      "cwd": "$PROJECT_ROOT"
    }
  }
}
EOF

echo "✅ MCP 服务设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 将以下配置添加到 Claude Desktop 配置文件："
echo ""
echo "   macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "   Windows: %APPDATA%\\Claude\\claude_desktop_config.json"
echo ""
echo "2. 配置内容："
cat "$CONFIG_FILE"
echo ""
echo "3. 重启 Claude Desktop"
echo ""
echo "🎉 完成后即可在 Claude 中使用页面规范工具！" 