// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // 默认错误响应
  let status = 500;
  let message = '服务器内部错误';

  // 处理特定错误类型
  if (err.name === 'ValidationError') {
    status = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = '未授权访问';
  } else if (err.code === 'ENOTFOUND') {
    status = 503;
    message = '服务暂时不可用';
  }

  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;