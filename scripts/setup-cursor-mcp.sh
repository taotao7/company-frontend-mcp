#!/bin/bash

echo "🎯 设置 Cursor IDE MCP 服务..."

# 确保MCP服务已构建
echo "🔨 构建MCP服务..."
pnpm mcp:build

# 获取项目根目录
PROJECT_ROOT=$(pwd)

# 创建.cursor目录（如果不存在）
mkdir -p .cursor

# 创建Cursor MCP配置文件
CONFIG_FILE=".cursor/mcp.json"

echo "📝 创建Cursor MCP配置文件..."
cat > "$CONFIG_FILE" << EOF
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

echo "✅ Cursor MCP 配置完成！"
echo ""
echo "📋 配置文件已创建："
echo "   $PROJECT_ROOT/$CONFIG_FILE"
echo ""
echo "配置内容："
cat "$CONFIG_FILE"
echo ""
echo "🔄 请重启 Cursor IDE 以加载 MCP 服务"
echo ""
echo "📍 使用说明："
echo "1. 重启 Cursor IDE"
echo "2. 在聊天界面查看是否显示 'Available Tools'"
echo "3. 如果显示 '0 tools enabled'，请检查："
echo "   - Node.js 版本是否 >= 18"
echo "   - MCP 服务器文件是否存在"
echo "   - 配置文件格式是否正确"
echo ""
echo "🎉 配置完成后，您可以使用以下命令："
echo "   - '请获取页面创建规范'"
echo "   - '为用户管理页面生成模板'"
echo "   - '验证这段代码是否符合规范'" 