'use strict';

module.exports = {
  assertAuth(name) {
    return async (ctx, next) => {
      if (!ctx.verifyAuth(name)) ctx.error(401, '权限不足');
      await next();
    };
  },
};
