# Tracker Backend

智能物品保质期管理系统后端服务

## 项目结构

```
backend/
├── config/           # 配置文件
│   └── db.js        # 数据库连接配置
├── controllers/      # 控制器
├── middleware/       # 中间件
│   └── error.js     # 错误处理中间件
├── models/          # 数据模型
├── routes/          # 路由定义
│   └── index.js     # 主路由文件
├── services/        # 业务逻辑服务
├── utils/           # 工具函数
├── uploads/         # 文件上传目录
├── server.js        # 服务器入口文件
├── package.json     # 项目配置
└── .env.example     # 环境变量示例
```

## 快速开始

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件填入你的配置
```

3. 启动开发服务器
```bash
npm run dev
```

## API端点

- `GET /api/health` - 健康检查
- `GET /` - 基础欢迎信息

## 技术栈

- **框架**: Express.js
- **数据库**: Supabase (PostgreSQL)
- **中间件**: CORS, Morgan, Helmet
- **环境变量**: dotenv

## 开发

服务器将在端口 3001 启动，使用 nodemon 实现热重载。