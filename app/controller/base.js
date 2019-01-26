'use strict';

const moment = require('moment');
const egg = require('egg');

class Controller extends egg.Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {};
    this.name = 'base';
  }
  getService() {
    const service = this.service[this.name];
    if (!service) throw new Error('没有找到对应的service:' + this.name);
    return service;
  }
  // 创建
  async create() {
    const { ctx } = this;
    if (Object.keys(this.createRule).length) {
      ctx.validate(this.createRule);
    }
    const payload = ctx.request.body || {};
    const res = await this.getService().create(payload);
    ctx.success(res);
  }
  // 删除单个
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    await this.getService().destroy(id);
    ctx.success();
  }
  // 修改
  async update() {
    const { ctx } = this;
    if (Object.keys(this.createRule).length) {
      ctx.validate(this.createRule);
    }
    const { id } = ctx.params;
    const payload = ctx.request.body || {};
    const doc = await this.getService().update(id, payload);
    ctx.success(doc);
  }

  // 获取单个
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const doc = await this.getService().show(id);
    ctx.success(doc);
  }

  getSearchObject(query) {
    const { ctx } = this;
    const search = {};
    Object.keys(query).forEach(key => {
      const value = query[key];
      const prefix = key[0];
      if (prefix === '$') {
        key = key.substr(1);
      }
      const schema = this.getService().schema;
      if (!schema) ctx.error(500, `controller.${this.name}中找不到字段${key}对应的schema`);
      const type = schema.type || schema;
      if (prefix === '$') {
        if (type instanceof String) {
          search[key] = { $regex: new RegExp(value, 'gi') };
        } else {
          try {
            const searchObj = JSON.parse(value);
            search[key] = {};
            if (typeof searchObj.$gt !== 'object') search[key].$gt = searchObj.$gt;
            if (typeof searchObj.$gte !== 'object') search[key].$gte = searchObj.$gte;
            if (typeof searchObj.$lt !== 'object') search[key].$lt = searchObj.$lt;
            if (typeof searchObj.$lte !== 'object') search[key].$lte = searchObj.$lte;
            if (type instanceof Date) {
              search[key] = Object.keys(search[key]).reduce((o, item) => {
                o[item] = moment(search[key][item]).toDate();
                return o;
              }, {});
            }
          } catch (e) {
            ctx.error(400, `搜索参数格式错误:${value}`);
          }
        }
      } else {
        if (type instanceof Date) {
          search[key] = moment(value).toDate();
        } else {
          search[key] = value;
        }
      }
    });
    return search;
  }

  // 获取所有(分页/模糊)
  async index() {
    const { ctx } = this;
    // 组装参数
    const { pageSize = 10, current = 1, isPaging = true, ...query } = ctx.query;
    const search = this.getSearchObject(query);
    const res = await this.getService().index({ isPaging, pageSize, current, search });
    ctx.success(res);
  }

  // 删除所选(条件id[])
  // {id: ["5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"]}
  async removes() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const payload = id || [];
    await this.getService().removes(payload);
    ctx.success();
  }
}
egg.BaseController = Controller;
module.exports = Controller;
