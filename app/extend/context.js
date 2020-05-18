const crypto = require('crypto');

module.exports = {
  // 成功响应
  success(message = {}) {
    this.status = 200;
    this.body = { status: 200, data: message };
  },
  // 错误响应
  error(code, message) {
    this.throw(code, { message });
  },
  hash(message, type = 'md5') {
    const sha256 = crypto.createHash(type);
    return sha256.update(message, 'utf8').digest('hex');
  },
  // 当前登录的用户
  user: {},
  // 是否超级管理员
  isAdmin: false,
  // 定义的schema
  get schema() {
    return this.app.schema;
  },
};
