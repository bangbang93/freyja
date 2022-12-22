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
  output: {
    path: path.resolve(__dirname, '../../client/dist'),
    publicPath: '/',
    filename: IS_PRODUCTION ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.vue'],
    alias: {
      url: require.resolve('url/'),
    },
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
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.(?:woff2?|eot|ttf|otf)(?:\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]'),
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
