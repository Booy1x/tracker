const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 路由
const routes = require('./routes');
app.use('/api', routes);

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: '智能物品保质期管理系统API服务已启动' });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '路由未找到' });
});

// 错误处理中间件
const errorHandler = require('./middleware/error');
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/health`);
});