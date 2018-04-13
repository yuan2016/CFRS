'use strict'
//引入utils工具
const utils = require('./utils')
// 引入webpack来使用webpack内置插件
const webpack = require('webpack')
// 引入config目录中的index.js配置文件
const config = require('../config')
// 引入webpack-merge插件用来合并webpack配置对象，也就是说可以把webpack配置文件拆分成几个小的模块，然后合并
const merge = require('webpack-merge')
// node的内置模块path
const path = require('path')
// 引入当前目录下的webpack.base.conf.js配置文件，主要配置的是打包各种文件类型的配置
const baseWebpackConfig = require('./webpack.base.conf')
//复制文件的插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 下面是一个自动生成html的插件，能够把资源自动加载到html文件中
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 一个友好提示错误信息的插件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 自动检索下一个可用端口
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // 下面是把utils配置中的处理css类似文件的处理方法拿过来，并且不生成cssMap文件
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    // console 控制台显示的消息，可能的值有 none, error, warning 或者 
    clientLogLevel: 'warning',
    // History API 当遇到 404 响应时会被替代为 index.html
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    // 模块热重载
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
// 比如你在src 文件夹下运行webpack-dev-server，访问http://localhost:8801/index.html 时，对应的就是src/index.html；
// 设置了{contentBase: 'build/'} 后，再访问http://localhost:8801/index.html，对应的就是src/build/index.html了。
// 类似于wwwroot。
//gzip
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    //自动打开浏览器
    open: config.dev.autoOpenBrowser,
    // warning不显示 和 error 要显示
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
      // 配置publicPath
    publicPath: config.dev.assetsPublicPath,
    //设置是否需要跨域
    proxy: config.dev.proxyTable,
    // 控制台是否禁止打印警告和错误 若使用 FriendlyErrorsPlugin 此处为 true
    quiet: true, // necessary for FriendlyErrorsPlugin
    // 文件系统检测改动
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    //热加载插件
    new webpack.HotModuleReplacementPlugin(),
    // 热加载时直接返回更新的文件名，而不是id
    new webpack.NamedModulesPlugin(),
     // 跳过编译时出错的代码并记录下来，主要作用是使编译往后运行
    new webpack.NoEmitOnErrorsPlugin(),
// 该插件可自动生成一个 html 文件或使用模板文件将编译好的代码注入
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    // 拷贝静态文档到虚拟的../static 中
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    //执行过程自动屏蔽掉console
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        pure_funcs: ['console.log']
      },
      sourceMap: false
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig) // 执行！！！
    }
  })
})
