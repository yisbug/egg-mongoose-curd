# ocore


## controller 部分

1. 加载顺序

pkg -> plugin -> config -> extend -> agent.js -> app.js
-> service -> middleware -> controller -> router

2. controller处理过程

EggLoader.loadController()
默认参数为object，其中directory定义了默认只加载应用目录的app/controller。

加载时，初始化定义的controller类。
a. 如果是纯函数，则注入app参数，类似：func = func(app)
b. 遍历每一个方法，包裹每一个方法，生成一个新的对象，类似：
const ret = {};  ret[methodName] = wrapMethod(method);
wrapMethod内部处理主要是改变this的指向，类似这样：
wrapMethod = function(func){
  const controller = new Controller(this);
  return function(...args){
    return func.call(args,controller);
  }
}

3. 扩展controller的方式

a. 定义了schema，希望扩展 schema 自动生成的 controller
module.exports = (app)=>{
  class Controller extend app.BaseController{
    constructor(ctx) {
      super(ctx);
      this.name = 'user'; // 必须，对应的service名称
    }
  }
  return Controller;
}
b. 扩展UserController
module.exports = (app)=>{
  class Controller extend app.UserController{
    constructor(ctx) {
      super(ctx);
      this.name = 'user'; // 必须，对应的service名称
    }
  }
  return Controller;
}

4. 扩展service的方式

a. 定义了schema，希望扩展 schema 自动生成的 controller
module.exports = {
  async customMethod(){
    // do something
  }
}

## user部分

### 登陆

根据密码、salt、secret、时间戳生成token，cookie 中存储id,token,time

### 退出

清空cookie

### 校验

根据 cookie 中的id,token,time，db 中的password,salt,配置的secret，校验token

### 多设备登陆

db 中不存储 token，所以互相不影响

### 扩展

把password,salt,secret存储到redis即可

### 踢出

修改密码，后续考虑增加一个seed字段，重置该字段即可踢出所有已登陆账户

## QuickStart

```bash
$ npm install
$ npm test
```

publish your framework to npm, then change app's dependencies:

```js
// {app_root}/index.js
require('ocore').startCluster({
  baseDir: __dirname,
  // port: 7001, // default to 7001
});

```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

