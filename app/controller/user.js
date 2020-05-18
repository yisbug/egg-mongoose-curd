module.exports = {
  // 登陆
  async login() {
    const { ctx } = this;
    ctx.validate({
      username: { type: 'string', required: true, allowEmpty: false },
      password: { type: 'string', required: true, allowEmpty: false },
    });
    const payload = ctx.request.body || {};
    const res = await this.getService().login(payload);
    ctx.cookies.set('id', res.id);
    ctx.cookies.set('token', res.token);
    ctx.cookies.set('time', res.time);
    ctx.success(res);
  },
  async logout() {
    const { ctx } = this;
    ctx.cookies.set('id', '');
    ctx.cookies.set('token', '');
    ctx.cookies.set('time', '');
    ctx.success();
  },
  async current() {
    const { ctx } = this;
    ctx.success(ctx.user);
  },
};
