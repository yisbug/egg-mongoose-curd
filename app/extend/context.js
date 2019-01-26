'use strict';

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
  // sha256加密
  sha256(message) {
    const sha256 = crypto.createHash('sha256');
    return sha256.update(message, 'utf8').digest('hex');
  },
  // 验证sha256
  verifysha256(message, result) {
    const res = this.sha256(message);
    return res === result;
  },
  // 验证权限，返回true/false
  verifyAuth(name) {
    if (this.isAdmin) return true;
    if (!name && this.user._id) return true; // 仅校验是否登录
    if (this.auth && this.auth.indexOf(name) > -1) return true;
    return false;
  },
  // 断言权限，无权限抛出401
  assertAuth(name) {
    if (!this.verifyAuth(name)) this.error(401, '权限不足');
  },
  // 权限列表
  auth: [],
  // 当前登录的用户
  user: {},
  // 是否超级管理员
  isAdmin: false,
  // 定义的schema
  get schema() {
    return this.app.schema;
  },
};
