/**
 * Created by bangbang93 on 16/9/20.
 */
'use strict';
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const projectRoot = path.resolve(__dirname, './src');

let config = (function(){
  let config = {
    build: {
      index: path.resolve(__dirname, '../client/dist/index.html'),
      assetsRoot: path.resolve(__dirname, '../client/dist'),
      assetsSubDirectory: 'static',
      assetsPublicPath: '/',
      productionGzip: true,
      productionGzipExtensions: ['js', 'css'],
      devtool: false,
    },
    dev: {
      port: 8080,
      assetsSubDirectory: 'static',
      assetsPublicPath: '/',
      cssSourceMap: false,
      devtool: '#eval-source-map',
    },
  };
  return config[process.env.NODE_ENV == 'production'? 'build' : 'dev']
})();
module.exports = Object.assign(config, {
  entry: {
    index: path.resolve(__dirname, '../client/src/entries/index.js'),
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../client/src'),
      'assets': path.resolve(__dirname, '../client/src/assets'),
      'components': path.resolve(__dirname, '../client/src/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  vue: {
    loaders: cssLoaders()
  }
});

function assetsPath (_path) {
  var assetsSubDirectory = config['assetsSubDirectory'];
  return path.posix.join(assetsSubDirectory, _path)
}

function cssLoaders(options) {
  options = options || {};
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar;
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?');
        extraParamChar = '&'
      } else {
        loader = loader + '-loader';
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!');

    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

module.exports.cssLoaders = cssLoaders;