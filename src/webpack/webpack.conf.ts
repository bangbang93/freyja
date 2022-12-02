/**
 * Created by bangbang93 on 16/9/30.
 */
'use strict'
/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
import config from './webpack.base.config'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import webpack, {Configuration} from 'webpack'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import {VueLoaderPlugin} from 'vue-loader'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const entry: Configuration['entry'] = {
  index: path.resolve(__dirname, '../../client/src/entries/entry-client.ts'),
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
      filename: 'css/[name].[chunkhash:8].css',
      chunkFilename: 'css/[id].[chunkhash:8].css',
    }),
  )
  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: `${entry}.html`,
      template: `client/src/html/${entry}.html`,
      inject: true,
      chunks: [entry],
    }))
  })
} else {
// add hot-reload related code to entry chunks
  for (const name of Object.keys(entry)) {
    entry[name] = ['webpack-hot-middleware/client?name=freyja'].concat(entry[name] as string)
  }
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  )

  entries.forEach((entry) => {
    plugins.push(new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'client/src/html/index.html',
      inject: true,
      chunks: [entry],
    }))
  })
}

export default merge(config, {
  entry,
  plugins,
})
