module.exports = async app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  console.log('controller.user', controller.user);
  router.get('/api/order/getOrderCount', controller.order.getOrderCount);

  router.resources('user', '/api/user', controller.user);
  router.resources('article', '/api/article', controller.article);
  router.resources('order', '/api/order', controller.order);
};
