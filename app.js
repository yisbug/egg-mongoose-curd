'use strict';
module.exports = app => {
  // 权限
  app.config.coreMiddleware.unshift('access');
  // 错误处理
  app.config.coreMiddleware.unshift('errorHandler');

};
