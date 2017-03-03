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