'use strict';

// 角色表
module.exports = {
  name: {
    type: String,
    name: '角色名',
    unique: true,
    dropDups: true,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    name: '是否超级管理员',
    default: false,
  },
  auth: {
    type: Array,
    name: '权限列表',
  },
};
