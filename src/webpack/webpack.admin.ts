/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import {VueLoaderPlugin} from 'vue-loader'
import webpack, {Configuration} from 'webpack'
import merge from 'webpack-merge'
import config from './webpack.base.config'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const entry: Configuration['entry'] = {
  index: path.resolve(__dirname, '../../client/src/entries/entry-admin.ts'),
  login: path.resolve(__dirname, '../../client/src/entries/entry-admin-login.ts'),
}
const entries = Object.keys(entry)

const plugins: NonNullable<Configuration['plugins']> = [
  new VueLoaderPlugin(),
]
if (IS_PRODUCTION) {
  console.log('production webpack') // eslint-disable-line no-console
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[fullhash].css',
      chunkFilename: 'css/[id].css',
    }),
  )

  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: 'client/src/html/admin.html',
      inject: true,
      chunks: [entry, 'vendor'],
    }))
  })
} else {
// add hot-reload related code to entry chunks
  entries.forEach((name) => {
    entry[name] = ['webpack-hot-middleware/client?name=admin'].concat(entry[name] as string)
  })
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  )
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: 'client/src/html/admin.html',
      inject: true,
      chunks: [entry],
    }))
  })
}

export default merge(config, {
  name: 'admin',
  entry,
  plugins,
  output: {
    path: path.resolve(__dirname, '../../client/dist/admin'),
    publicPath: '/admin/',
    filename: 'js/[name].[fullhash].js',
  },
})
