import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
const server = new Server({
    name: "jingle-page-guidelines",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// 页面规范数据
const PAGE_GUIDELINES = {
    headerConfig: {
        description: "新增页面必须使用空header配置",
        code: `header={{
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
}}`,
    },
    apiGuidelines: {
        fileOrganization: {
            description: "API按功能模块分类，存放在src/api/目录下",
            examples: ["task.ts", "user.ts", "order.ts"],
        },
        namingConventions: {
            list: "xxxList",
            add: "addXxx",
            update: "updateXxx",
            delete: "delXxx",
            detail: "getXxxById 或 getXxxDetail",
            toggle: "toggleXxxStatus",
        },
        requestWrapper: "request(url: string, method: Method, data?: any, opts?: any)",
        listApiResponse: {
            structure: `{
  "code": 0,
  "msg": "string",
  "data": {
    "records": []
  },
  "time": "2019-08-24T14:15:22.123Z",
  "isSuccess": true
}`,
        },
        normalApiResponse: {
            structure: `{
  "code": 0,
  "msg": "string",
  "data": {},
  "time": "2019-08-24T14:15:22.123Z",
  "isSuccess": true
}`,
        },
    },
    componentGuidelines: {
        fileNaming: {
            componentFile: "kebab-case (如: language-switcher.tsx)",
            componentName: "PascalCase (如: LanguageSwitcher)",
            directory: "kebab-case (如: signal-display/)",
        },
        structure: {
            shared: "src/components/",
            pageSpecific: "对应页面目录中",
        },
        implementation: [
            "尽可能使用函数式组件和React Hooks",
            "使用TypeScript定义组件props类型",
            "适当拆分大型组件为小型可复用组件",
        ],
        styling: [
            "优先使用Tailwind CSS实现样式",
            "组件特有样式可以使用CSS Modules",
            "遵循项目已有的样式规范和UI设计",
        ],
    },
    hookGuidelines: {
        naming: "以use开头，使用camelCase命名规则",
        location: "src/hooks/目录下",
        dataFetching: "优先使用@tanstack/react-query",
        stateManagement: "优先使用Zustand",
        eventTracking: "使用useSensor进行事件追踪",
    },
};
// 页面模板
const PAGE_TEMPLATES = {
    basicPage: `import { FC } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { useTranslation } from 'react-i18next'

const [PageName]: FC = () => {
  const { t } = useTranslation()

  return (
    <PageContainer
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
    >
      {/* 页面内容 */}
    </PageContainer>
  )
}

export default [PageName]`,
    apiTemplate: `import { request } from '@/utils/request'

// 定义请求参数类型
export interface [ModelName]ListParams {
  name?: string
  status?: number
  pageNumber: number
  pageSize: number
}

export interface [ModelName] {
  id: string
  name: string
  status: number
  createTime: string
}

// 列表查询
export const [modelName]List = (params: [ModelName]ListParams) => {
  return request('/api/[modelName]', 'POST', params, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// 添加
export const add[ModelName] = (data: Partial<[ModelName]>) => {
  return request('/api/[modelName]', 'POST', data)
}

// 更新
export const update[ModelName] = (id: string, data: Partial<[ModelName]>) => {
  return request(\`/api/[modelName]/\${id}\`, 'PUT', data)
}

// 删除
export const del[ModelName] = (id: string) => {
  return request(\`/api/[modelName]/\${id}\`, 'DELETE')
}

// 详情
export const get[ModelName]ById = (id: string) => {
  return request(\`/api/[modelName]/\${id}\`, 'GET')
}`,
    hookTemplate: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { [modelName]List, add[ModelName], update[ModelName], del[ModelName] } from '@/api/[modelName]'
import type { [ModelName]ListParams, [ModelName] } from '@/api/[modelName]'

// 数据查询Hook
export const use[ModelName]List = (params?: [ModelName]ListParams) => {
  return useQuery({
    queryKey: ['[modelName]List', params],
    queryFn: () => [modelName]List(params || { pageNumber: 1, pageSize: 10 }),
  })
}

// 添加Hook
export const useAdd[ModelName] = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: add[ModelName],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[modelName]List'] })
    },
  })
}

// 更新Hook
export const useUpdate[ModelName] = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<[ModelName]> }) => 
      update[ModelName](id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[modelName]List'] })
    },
  })
}

// 删除Hook
export const useDel[ModelName] = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: del[ModelName],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['[modelName]List'] })
    },
  })
}`,
};
// 工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_page_guidelines",
                description: "获取页面创建规范和指导原则",
                inputSchema: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            enum: ["header", "api", "component", "hook", "all"],
                            description: "获取特定类型的规范，或获取全部规范",
                        },
                    },
                },
            },
            {
                name: "generate_page_template",
                description: "根据规范生成页面模板代码",
                inputSchema: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            enum: ["page", "api", "hook"],
                            description: "模板类型：页面、API或Hook",
                        },
                        name: {
                            type: "string",
                            description: "名称（用于替换模板中的占位符）",
                        },
                    },
                    required: ["type", "name"],
                },
            },
            {
                name: "validate_page_structure",
                description: "验证页面代码是否符合规范",
                inputSchema: {
                    type: "object",
                    properties: {
                        code: {
                            type: "string",
                            description: "要验证的代码",
                        },
                        type: {
                            type: "string",
                            enum: ["page", "api", "hook", "component"],
                            description: "代码类型",
                        },
                    },
                    required: ["code", "type"],
                },
            },
            {
                name: "get_naming_suggestions",
                description: "根据功能描述获取命名建议",
                inputSchema: {
                    type: "object",
                    properties: {
                        description: {
                            type: "string",
                            description: "功能描述",
                        },
                        type: {
                            type: "string",
                            enum: ["api", "component", "hook", "file"],
                            description: "命名类型",
                        },
                    },
                    required: ["description", "type"],
                },
            },
        ],
    };
});
// 工具调用处理器
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case "get_page_guidelines": {
            const { type = "all" } = args;
            let guidelines;
            switch (type) {
                case "header":
                    guidelines = { headerConfig: PAGE_GUIDELINES.headerConfig };
                    break;
                case "api":
                    guidelines = { apiGuidelines: PAGE_GUIDELINES.apiGuidelines };
                    break;
                case "component":
                    guidelines = {
                        componentGuidelines: PAGE_GUIDELINES.componentGuidelines,
                    };
                    break;
                case "hook":
                    guidelines = { hookGuidelines: PAGE_GUIDELINES.hookGuidelines };
                    break;
                default:
                    guidelines = PAGE_GUIDELINES;
            }
            return {
                content: [
                    {
                        type: "text",
                        text: `# Jingle Frontend 页面开发规范\n\n${JSON.stringify(guidelines, null, 2)}`,
                    },
                ],
            };
        }
        case "generate_page_template": {
            const { type, name } = args;
            let template = "";
            const pascalName = name.charAt(0).toUpperCase() + name.slice(1);
            const camelName = name.charAt(0).toLowerCase() + name.slice(1);
            switch (type) {
                case "page":
                    template = PAGE_TEMPLATES.basicPage.replace(/\[PageName\]/g, pascalName);
                    break;
                case "api":
                    template = PAGE_TEMPLATES.apiTemplate
                        .replace(/\[ModelName\]/g, pascalName)
                        .replace(/\[modelName\]/g, camelName);
                    break;
                case "hook":
                    template = PAGE_TEMPLATES.hookTemplate
                        .replace(/\[ModelName\]/g, pascalName)
                        .replace(/\[modelName\]/g, camelName);
                    break;
                default:
                    throw new Error(`未知的模板类型: ${type}`);
            }
            return {
                content: [
                    {
                        type: "text",
                        text: template,
                    },
                ],
            };
        }
        case "validate_page_structure": {
            const { code, type } = args;
            const issues = [];
            switch (type) {
                case "page":
                    // 检查是否包含正确的header配置
                    if (!code.includes("title: null")) {
                        issues.push("❌ 缺少 title: null 配置");
                    }
                    if (!code.includes('children: <div className="h-0 w-0" />')) {
                        issues.push("❌ 缺少正确的 children 配置");
                    }
                    if (!code.includes("childrenContentStyle")) {
                        issues.push("❌ 缺少 childrenContentStyle 配置");
                    }
                    break;
                case "api":
                    // 检查API命名规范
                    if (!code.includes("List") &&
                        !code.includes("add") &&
                        !code.includes("update") &&
                        !code.includes("del")) {
                        issues.push("❌ API函数命名不符合规范（应包含List、add、update、del等）");
                    }
                    if (!code.includes("request(")) {
                        issues.push("❌ 未使用统一的request函数");
                    }
                    break;
                case "hook":
                    // 检查Hook命名规范
                    if (!code.includes("use")) {
                        issues.push("❌ Hook命名必须以use开头");
                    }
                    if (!code.includes("useQuery") && !code.includes("useMutation")) {
                        issues.push("⚠️ 建议使用React Query进行数据管理");
                    }
                    break;
            }
            const result = issues.length === 0
                ? "✅ 代码结构符合规范！"
                : `发现以下问题：\n${issues.join("\n")}`;
            return {
                content: [
                    {
                        type: "text",
                        text: result,
                    },
                ],
            };
        }
        case "get_naming_suggestions": {
            const { description, type } = args;
            // 基于描述生成命名建议的简单逻辑
            const words = description.toLowerCase().split(/\s+/);
            const mainWord = words[0] || "item";
            let suggestions = [];
            switch (type) {
                case "api":
                    suggestions = [
                        `${mainWord}List`,
                        `add${mainWord.charAt(0).toUpperCase() + mainWord.slice(1)}`,
                        `update${mainWord.charAt(0).toUpperCase() + mainWord.slice(1)}`,
                        `del${mainWord.charAt(0).toUpperCase() + mainWord.slice(1)}`,
                        `get${mainWord.charAt(0).toUpperCase() + mainWord.slice(1)}ById`,
                    ];
                    break;
                case "component":
                    const pascalCase = words
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join("");
                    suggestions = [pascalCase];
                    break;
                case "hook":
                    suggestions = [
                        `use${words
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join("")}`,
                    ];
                    break;
                case "file":
                    suggestions = [words.join("-")];
                    break;
            }
            return {
                content: [
                    {
                        type: "text",
                        text: `根据描述"${description}"，建议的${type}命名：\n${suggestions
                            .map((s) => `• ${s}`)
                            .join("\n")}`,
                    },
                ],
            };
        }
        default:
            throw new Error(`未知的工具: ${name}`);
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Jingle Page Guidelines MCP Server 启动成功");
}
main().catch((error) => {
    console.error("服务器启动失败:", error);
    process.exit(1);
});
