module.exports = () => {
  const config = {};

  config.keys = 'abcdefg';

  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '0.0.0.0',
    },
  };
  config.mongoose = {
    url: 'mongodb://localhost/example',
    options: {
      socketTimeoutMS: 1000 * 60 * 60, // 1小时超时
      useCreateIndex: true, // 设置为true使Mongoose的默认索引构建使用，createIndex()而不是ensureIndex()避免MongoDB驱动程序的弃用警告。
      useUnifiedTopology: true,
    },
  };

  return config;
};
