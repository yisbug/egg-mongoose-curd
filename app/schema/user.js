module.exports = {
  username: {
    type: String,
    name: '用户名',
    index: true,
    unique: true,
    dropDups: true,
    required: true,
  },
  password: {
    type: String,
    name: '密码',
    required: true,
  },
  role: {
    type: String,
    name: '所属角色',
    required: true,
  },
  salt: {
    type: String,
    name: 'salt',
  },
  nickName: {
    type: String,
    name: '昵称',
  },
  lastLoginTime: {
    type: Date,
    name: '最后登陆时间',
    default: Date.now,
  },
};
