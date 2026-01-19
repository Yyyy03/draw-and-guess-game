# 你画我猜 AI 游戏

这是一个基于 Next.js 和 Google Gemini API 的在线"你画我猜"游戏。

## 功能特点

- 🎨 实时绘画工具：画笔、橡皮、颜色选择、粗细调节
- 🤖 AI 智能识别：使用 Google Gemini API 识别绘画内容
- 🎯 多种绘画主题支持：动物、水果、日常物品等
- 💫 美观的 UI 界面：渐变背景、流畅动画

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env`，并填入你的 Gemini API Key：

```bash
cp .env.example .env
```

然后编辑 `.env` 文件：

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

获取 Gemini API Key：
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录 Google 账号
3. 创建新的 API Key

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 http://localhost:3000

## 使用方法

1. 在画布上使用鼠标或触摸设备绘制图案
2. 可以选择不同颜色和画笔大小
3. 点击"AI 猜测"按钮提交画作
4. AI 会分析你的绘画并给出猜测结果

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **AI**: Google Gemini API (直接 HTTP 调用)
- **语言**: TypeScript

## 项目结构

```
draw-and-guess-game/
├── app/
│   ├── api/
│   │   └── guess/
│   │       └── route.ts      # AI 猜测 API 接口
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── components/
│   ├── DrawingCanvas.tsx     # 绘画画布组件
│   └── GameInfo.tsx          # 游戏说明组件
├── .env.example              # 环境变量示例
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 环境变量

| 变量 | 描述 | 必需 |
|------|------|------|
| `GEMINI_API_KEY` | Google Gemini API Key | 是 |
| `GEMINI_MODEL` | 使用的模型名称 (可选) | 否，默认 `gemini-1.5-flash` |

## 注意事项

- 需要有效的 Google Gemini API Key
- 确保网络可以访问 Google API
- 建议使用现代浏览器以获得最佳体验
