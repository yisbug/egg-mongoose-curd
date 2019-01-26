'use strict';

module.exports = () => {
  return async function(ctx, next) {
    const id = ctx.cookies.get('id');
    const token = ctx.cookies.get('token');
    const time = ctx.cookies.get('time');
    if (id && token && time) {
      const user = await ctx.service.user.verifyToken(id, token, time);
      if (user) {
        ctx.user = user;
        ctx.auth = (user.role || {}).auth || [];
        ctx.isAdmin = !!(user.role || {}).isAdmin;
      }
    }
    await next();
  };
};
