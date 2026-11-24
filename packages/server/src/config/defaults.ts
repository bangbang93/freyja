// 内置默认值随程序发布；config/<env> 下的同名段文件按键覆盖
export const defaults = {
  database: {
    mongodb: {
      uri: 'mongodb://localhost:27017/freyja',
    },
    meilisearch: {
      host: 'localhost',
      apiKey: 'apiKey',
    },
  },
  jwt: {
    expiresIn: '7d',
  },
  freyja: {
    mail: {
      from: 'noreply@bangbang93.com',
    },
    fundebug: {
      apikey: '',
      enable: false,
    },
  },
}
