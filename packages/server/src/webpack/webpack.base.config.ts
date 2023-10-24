/**
 * Created by bangbang93 on 16/9/20.
 */
'use strict'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path, {join} from 'path'
import {Configuration} from 'webpack'

const projectRoot = path.resolve(__dirname, '../../client/src')
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const config: Configuration = {
  devtool: IS_PRODUCTION ? false : 'source-map',
  mode: IS_PRODUCTION ? 'production' : 'development',
  name: 'freyja',
  bail: true,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.vue'],
    alias: {
      url: require.resolve('url/'),
    },
  },
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/],
              configFile: 'tsconfig-fe.json',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: IS_PRODUCTION
          ? [MiniCssExtractPlugin.loader, 'css-loader']
          : ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.s[ca]ss$/,
        use: IS_PRODUCTION
          ? [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
          : ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(?:png|jpe?g|gif|svg)(?:\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: assetsPath(IS_PRODUCTION ? 'img/[name].[hash:7].[ext]' : 'img/[name].[ext]'),
        },
      },
      {
        test: /\.(?:woff2?|eot|ttf|otf)(?:\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: assetsPath(IS_PRODUCTION ? 'fonts/[name].[hash:7].[ext]' : 'fonts/[name].[ext]'),
        },
      },
    ],
  },
}
export default config

function assetsPath(path: string): string {
  const assetsSubDirectory = 'static'
  return join(assetsSubDirectory, path)
}
