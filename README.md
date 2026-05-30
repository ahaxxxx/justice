# Justice Cat

Justice Cat（中文版 AI 吵架仲裁官）是一个 MVP Web 应用：用户输入 A 方、B 方和可选背景，系统通过 DeepSeek Chat API 生成一份可爱、好笑但有同理心的「猫猫法官判决书」。

## 项目结构

```text
justice-cat/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PaymentModal.jsx
│   │   │   ├── VerdictForm.jsx
│   │   │   └── VerdictResult.jsx
│   │   ├── lib/
│   │   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── public/
│   │   └── payment-qr.svg
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── api/
│   │   ├── health.js
│   │   └── verdict.js
│   ├── lib/
│   │   ├── cors.js
│   │   ├── deepseek.js
│   │   ├── prompt.js
│   │   ├── rateLimit.js
│   │   └── validate.js
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml
├── .gitignore
└── README.md
```

## 本地开发

线上版本推荐使用：

```text
前端 GitHub Pages: https://ahaxxxx.github.io/justice/
后端 Vercel: https://justice-snowy-ten.vercel.app
健康检查: https://justice-snowy-ten.vercel.app/api/health
```

前端源码已内置 Vercel 后端地址作为默认值；如果 GitHub Actions 没有配置 `VITE_API_BASE_URL`，也会请求 `https://justice-snowy-ten.vercel.app`。

## 收款码配置

当前支付流程是人工确认版：用户点击「开始仲裁」后会先看到收款码；用户付款并点击「我已付款，开始仲裁」后，前端才会调用后端 API 生成结果。

默认会优先加载真实收款码：

```text
frontend/public/payment-qr.png
```

请把你的真实收款码图片放到 `frontend/public/`，并命名为：

```text
frontend/public/payment-qr.png
```

如果你想使用其他文件名，可以在 GitHub Actions 变量或 `frontend/.env` 中设置：

```env
VITE_PAYMENT_QR_URL=./payment-qr.png
```

如果 `payment-qr.png` 不存在，页面会自动显示项目自带的占位图 `payment-qr.svg`。

### 1. 启动后端

```bash
cd backend
npm install
cp .env.example .env
```

在 `backend/.env` 中填入：

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key
FRONTEND_ORIGIN=http://localhost:5173
```

启动 Vercel 本地函数：

```bash
npm run dev
```

默认 API 地址通常是 `http://localhost:3000/api/verdict`。

### 2. 启动前端

```bash
cd frontend
npm install
cp .env.example .env
```

在 `frontend/.env` 中填入：

```bash
VITE_API_BASE_URL=https://justice-snowy-ten.vercel.app
```

启动前端：

```bash
npm run dev
```

打开 `http://localhost:5173`。

## 后端部署到 Vercel

1. 在 Vercel 新建项目，Root Directory 选择 `backend`。
2. 添加环境变量：
   - `DEEPSEEK_API_KEY`: DeepSeek API Key
   - `FRONTEND_ORIGIN`: GitHub Pages 前端 origin，例如 `https://ahaxxxx.github.io`
3. 部署后，后端接口为：

```text
https://justice-snowy-ten.vercel.app/api/verdict
```

后端没有传统服务器，只有 Vercel Serverless Function。

## 前端部署到 GitHub Pages

项目已包含 GitHub Actions 工作流：`.github/workflows/deploy-frontend.yml`。

1. 把代码推送到 GitHub。
2. 在 GitHub 仓库设置中打开 `Settings -> Pages`。
3. Source 选择 `GitHub Actions`。
4. 可选：在仓库 `Settings -> Secrets and variables -> Actions` 添加变量：
   - `VITE_API_BASE_URL`: Vercel 后端域名，例如 `https://justice-snowy-ten.vercel.app`
5. 推送到 `main` 分支后，工作流会自动构建并部署 `frontend/dist`。

如果不添加 `VITE_API_BASE_URL`，工作流会使用默认后端 `https://justice-snowy-ten.vercel.app`。

`frontend/vite.config.js` 使用相对路径 `base: "./"`，适合 GitHub Pages 项目页。

## API

### `POST /api/verdict`

请求：

```json
{
  "sideA": "A方观点",
  "sideB": "B方观点",
  "background": "事件背景，可选"
}
```

响应：

```json
{
  "rootCause": "核心矛盾分析",
  "responsibilityA": 50,
  "responsibilityB": 50,
  "verdict": "猫猫法官判决书",
  "reconciliationTask": "和好任务",
  "relationshipScore": 80
}
```

## MVP 说明

- 支付是人工确认版：用户扫码付款后点击「我已付款，开始仲裁」，前端才会调用后端生成判决。
- 限流是 MVP 版本：每个 IP 每分钟最多 1 次请求。Serverless 内存限流不适合严肃生产环境，后续可替换为 Vercel KV、Upstash Redis 或数据库。
- 当前未实现微信支付、申诉系统、用户账号和历史记录，但前后端结构已预留出清晰扩展位置。
