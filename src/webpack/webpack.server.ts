/**
 * Created by bangbang93 on 2017/8/25.
 */
'use strict'
import path from 'path'
import {VueLoaderPlugin} from 'vue-loader'
import merge from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'
import baseConfig from './webpack.base.config'


const config = merge(baseConfig, {
  entry: {
    server: path.join(__dirname, '../../client/src/entries/entry-server.ts'),
  },
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '../../client/dist/server'),
  },
  externals: nodeExternals({
    allowlist: /\.(?:css|scss)$/,
  }),
  plugins: [
    new VueLoaderPlugin(),
  ],
})

config.module?.rules?.forEach((rule) => {
  if (typeof rule !== 'string') {
    switch (rule?.test?.toString()) {
      case '/\\.css$/':
        rule.use = ['vue-style-loader', 'css-loader']
        break
      case '/\\.s[ca]ss$/':
        rule.use = ['vue-style-loader', 'css-loader', 'sass-loader']
        break
      default:
    }
  }
})

export default config
