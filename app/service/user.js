'use strict';

module.exports = {
  // 新增
  async create(payload) {
    // 生成salt
    payload.salt = this.ctx.sha256(this.app.mongoose.Types.ObjectId().toString());
    // 加密密码
    payload.password = this.ctx.sha256(payload.password + payload.salt + this.config.schema.secret);
    const res = await this.model.create(payload);
    const user = res._doc;
    delete user.salt;
    delete user.password;
    return user;
  },
  // 修改，返回修改后的数据
  async update(id, payload) {
    const { ctx } = this;
    const user = await this.findOne(id);
    if (!user) ctx.error(404, '记录不存在');
    // 加密密码
    if (payload.password) {
      payload.password = ctx.sha256(payload.password + user.salt + this.config.schema.secret);
    }
    return this.model.findOneAndUpdate(this.getCondition(id), payload, {
      new: true,
    });
  },
  // 登陆
  async login(payload) {
    const { ctx } = this;
    const user = await this.findOne({ username: payload.username });
    if (!user) ctx.error(404, '用户不存在');
    const verifyPassword = this.ctx.verifysha256(payload.password + user.salt + this.config.schema.secret, user.password);
    if (!verifyPassword) ctx.error(404, '密码错误');
    const lastLoginTime = new Date();
    await this.update(String(user._id), { lastLoginTime });
    const time = lastLoginTime.getTime();
    const key = user.password + user.salt + this.config.schema.secret + time;
    const token = ctx.sha256(key);
    const doc = user._doc;
    delete doc.password;
    delete doc.salt;
    return {
      token,
      id: user._id.toString(),
      user: doc,
      time,
    };
  },
  // 校验token
  async verifyToken(id, token, time) {
    const doc = await this.findOne(id);
    if (!doc) return false;
    const user = doc._doc;
    const key = user.password + user.salt + this.config.schema.secret + time;
    const verifyPassword = this.ctx.verifysha256(key, token);
    if (!verifyPassword) return false;
    user.role = await this.service.role.findOne(user.role);
    delete user.salt;
    delete user.password;
    return user;
  },
  // 获取详情
  async show(id) {
    const doc = await this.findOne(id);
    if (!doc) this.ctx.error(404, '记录不存在');
    const user = doc._doc;
    delete user.salt;
    delete user.password;
    user.role = await this.service.role.findOne(user.role);
    return user;
  },
};
