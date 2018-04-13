'use strict'
// 引入nodejs路径模块
const path = require('path')
// 引入utils工具模块，具体查看我的博客关于utils的解释，utils主要用来处理css-loader和vue-style-loader的
const utils = require('./utils')
const webpack = require('webpack')
// 引入config目录下的index.js配置文件，主要用来定义一些开发和生产环境的属性
const config = require('../config')
// vue-loader.conf配置文件是用来解决各种css文件的，定义了诸如css,less,sass之类的和样式有关的loader
const vueLoaderConfig = require('./vue-loader.conf')
// const manifest = require('../vendor-manifest.json')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

// 此函数是用来返回当前目录的平行目录的路径，因为有个'..'
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
     // 入口文件是src目录下的main.js
    app: './src/main.js'
  },
  output: {
    // 路径是config目录下的index.js中的build配置中的assetsRoot，也就是dist目录
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      // 上线地址，也就是真正的文件引用路径，如果是production生产环境，其实这里都是 '/'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // resolve是webpack的内置选项，顾名思义，决定要做的事情，也就是说当使用 import "jquery"，该如何去执行这件事
    // 情就是resolve配置项要做的，import jQuery from "./additional/dist/js/jquery" 这样会很麻烦，可以起个别名简化操作
    extensions: ['.js', '.vue', '.json'],// 省略扩展名，也就是说.js,.vue,.json文件导入可以省略后缀名，这会覆盖默认的配置，所以要省略扩展名在这里一定要写上
    alias: {
      //后面的$符号指精确匹配，也就是说只能使用 import vuejs from "vue" 这样的方式导入vue.esm.js文件，不能在后面跟上 vue/vue.js
      'vue$': 'vue/dist/vue.esm.js',
      // resolve('src') 其实在这里就是项目根目录中的src目录，使用 import somejs from "@/some.js" 就可以导入指定文件，是不是很高大上
      '@': resolve('src'),
    }
  },
  /**
   *  test：必须满足的条件（正则表达式，不要加引号，匹配要处理的文件）
      exclude：不能满足的条件（排除不处理的目录）
      include：导入的文件将由加载程序转换的路径或文件数组（把要处理的目录包括进来）
      loader：一串“！”分隔的装载机（2.0版本以上，”-loader”不可以省略）
      loaders：作为字符串的装载器阵列
   */
  module: {
    rules: [
      //eslint检查
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      /**这里也包括css-loader */
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
        exclude: [resolve('src/config'), resolve('src/router'), resolve('src/store'), resolve('src/server'), resolve('config'), resolve('build'), resolve('resource'), resolve('static')]
      },
      {
        test: /\.js$/,
        // loader: 'babel-loader?cacheDirectory=true',
        use: 'happypack/loader?id=happybabel',
        include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      // {
      //   test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: utils.assetsPath('media/[name].[hash:7].[ext]')
      //   }
      // },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        },
        exclude: [resolve('build'), resolve('config'), resolve('resource'), resolve('server'), resolve('static'), resolve('src/components'), resolve('src/config'), resolve('src/router'), resolve('src/store'), resolve('src/common/js'), resolve('src/common/json'), resolve('src/common/stylus')]
      }
    ]
  },
  plugins: [
    // new webpack.DllReferencePlugin({
    //   manifest
    // }),
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      verbose: true
    })
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
