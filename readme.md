# HARUHI
haruhi是一个前后端混合快速开发种子项目，前端使用Vue.JS和Element，后端Express，数据库层没有实现，可以任意

## 注意事项
用到了async/await语法，需要node7.0以上的支持

## 目录约定

- bin/         可执行脚本，应用入口文件或者有其他需要直接运行的脚本，放在这里并且加上shebang
- client/      前端根目录
  - dist/      前端编译结果，gitignore
  - src/       前端源文件
  - static/    前端静态文件
  - etc/       前端其余配置
- public/      服务端认为的静态文件根目录，webpack会把编译结果和static目录复制过来
- route/       路由，会自动按照目录结构加载其中的路由文件，路由层只负责校验和格式化相应，不负责任何具体业务逻辑
- service/     服务，路由层require这里的服务推荐命名为NameService这种大驼峰结构，负责具体业务逻辑的处理
- model/       模型，与数据库的交互逻辑，使用ORM和ODM时，在这里定义对应的Schema
- module/      模块，模块和服务的区别是调用来源，服务是通过路由调用的，而模块是来自于服务或者其他模块调用的
- helper/      帮助函数，存放一些业务无关的，可重用的代码
- lib/         不在npm上的第三方代码
- config/      配置文件，gitignore。在一些需要自动部署的环境下，可以取消这个目录的gitignore并且通过环境变量控制config载入
- config.d/    配置文件样例，在一些自动部署环境下，可以删除这个目录并且使用上面的config目录
- script/      非服务的一些脚本文件，比如部署和编译
- app.js       express的初始化文件，设置了各类中间件和错误处理过程
- model.js     数据库的初始化文件，设置了各种数据库的连接，比如mysql和redis，最后通过exports导出给其他文件调用

## 命名约定

- 变量名无特殊说明全部使用小驼峰(someVariable)
- 文件名使用减号(-)分隔符的小写命名(filename-example.js)
- 常量使用大写蛇形命名(SOME_CONSTANT_NAME)
- require的npm模块按照以下规则命名
  - 引入的是一个构造方法，需要new的，使用大驼峰命名`const MemoryStream = require('memorystream')`
  - 引入的是一个普通方法，不需要new就可以使用的，使用小驼峰`const bunyan = require('bunyan')`
  - 引入的是一个对象，下面挂着很多方法的，使用小驼峰
- route 尽量遵守RESTful API风格，不在url内使用动词，注意是尽量，因为实际上太TM难了
  - GET方法不能对数据进行修改，统计类除外，幂等
  - POST方法是非幂等的，通常表示创建
  - PUT方法是幂等的，通常表示替代
  - PATCH方法是幂等的，通常表示修改局部
  - 引用service时使用`const NameService = require('../service/name')`的大驼峰规则
  - 必须且只能export出一个connect中间件路由对象
- service 
  - 引用model和modules时使用`const SomeModel = require('../model/some')`的大驼峰规则
- model
  - 对于mongoose,在各个collection对应的model文件内声明Schema和model
  - 对于sequelize，在各个table对应的model文件内声明define，最后在model.js中统一进行关系映射
  - 若无意外，不允许引用任何service层和module层代码，允许引用helper和lib
  
## 格式约定

- 两空格缩进，禁用tab
- 对象最后一个属性后带逗号
```javascript 
{
  foo: 'bar',
  a: 'b',
}
```
- 使用分号
- 大括号不换行
```javascript 
function foo(){
  return 'bar';
}
class far {
  constrator() {
    console.log('constrator');
  }
}
if (1=1) {
  next();
} else {
  door();
}
```
- fail fast
```javascript
//good
if (!ok){
  throw new Error();
}
doSometing();

//bad
if (ok){
  doSometing();
} else {
  throw new Error();
}
```
