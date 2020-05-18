module.exports = (option, app) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const status = err.status || 500;
      if (status === 500) {
        // 内部错误，触发一个 error 事件，框架会记录一条错误日志
        app.emit('error', err, this);
      }
      ctx.status = 200;
      ctx.body = { status };
      if (status === 200) {
        ctx.body.data = err.message;
      } else {
        ctx.body.error = status === 500 ? '服务器内部错误' : err.message;
      }
    }
  };
};
