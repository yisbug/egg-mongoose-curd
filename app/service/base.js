'use strict';

const Service = require('egg').Service;

class BaseService extends Service {
  get name() { return ''; }
  get schema() { return this.app.schema[this.name]; }
  get model() {
    const { app } = this;
    if (app.model[this.name]) return app.model[this.name];
    const model = app.mongoose.model(this.name, new app.mongoose.Schema(app.schema[this.name]));
    if (!model) throw new Error('没有找到对应的model:' + this.name);
    app.model[this.name] = model;
    return app.model[this.name];
  }
  getCondition(id) {
    const { ObjectId } = this.app.mongoose.Types.ObjectId;
    try {
      return typeof id === 'object' ? id : { _id: ObjectId(id) };
    } catch (e) {
      this.ctx.error(500, 'ObjectId 参数错误');
    }
  }
  // 查找一条记录
  async findOne(id) {
    return this.model.findOne(this.getCondition(id));
  }
  // 获取详情
  async show(id) {
    const doc = await this.findOne(id);
    if (!doc) this.ctx.error(404, '记录不存在');
    return doc;
  }
  // 新增
  async create(payload) {
    return this.model.create(payload);
  }
  // 删除
  async destroy(id) {
    const doc = await this.findOne(id);
    if (!doc) this.ctx.error(404, '记录不存在');
    return this.model.findByIdAndRemove(id);
  }
  // 批量删除
  async removes(payload) {
    return this.model.remove({ _id: { $in: payload } });
  }
  // 修改，返回修改后的数据
  async update(id, payload) {
    const doc = await this.findOne(id);
    if (!doc) this.ctx.error(404, '记录不存在');
    return this.model.findOneAndUpdate(this.getCondition(id), payload, {
      new: true,
    });
  }
  // 修改，如不存在则插入，返回修改后的数据
  async upsert(id, payload) {
    return this.model.findOneAndUpdate(this.getCondition(id), payload, {
      upsert: true,
      new: true,
    });
  }
  // 列表
  async index(payload) {
    const { isPaging = false, pageSize = 10, current = 1, search = {} } = payload || {};
    const skip = (current - 1) * pageSize;
    let query = this.model.find(search);
    if (isPaging) query = query.skip(skip).limit(pageSize);
    const res = await query.exec();
    const total = await this.model.countDocuments(search).exec();
    return {
      list: res.map(e => {
        return { key: e._doc._id, ...e._doc };
      }),
      pagination: isPaging ? { total, pageSize, current } : { total },
    };
  }
}

module.exports = BaseService;
