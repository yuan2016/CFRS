'use strict'
// 下面是引入nodejs的路径模块
const path = require('path')
// 下面是utils工具配置文件，主要用来处理css类文件的loader
const utils = require('./utils')
// 下面引入webpack，来使用webpack内置插件
const webpack = require('webpack')
// 下面是config目录下的index.js配置文件，主要用来定义了生产和开发环境的相关基础配置
const config = require('../config')
// 下面是webpack的merger插件，主要用来处理配置对象合并的，可以将一个大的配置对象拆分成几个小的，合并，相同的项将覆盖
const merge = require('webpack-merge')
// 下面是webpack.base.conf.js配置文件，用来处理不同类型文件的loader
const baseWebpackConfig = require('./webpack.base.conf')
// copy-webpack-plugin使用来复制文件或者文件夹到指定的目录的
const CopyWebpackPlugin = require('copy-webpack-plugin')
// html-webpack-plugin是生成html文件，可以设置模板
const HtmlWebpackPlugin = require('html-webpack-plugin')
// extract-text-webpack-plugin这个插件是用来将bundle中的css等文件产出单独的bundle文件的
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// optimize-css-assets-webpack-plugin插件的作用是压缩css代码的，还能去掉extract-text-webpack-plugin插件抽离文件产生的重复代码，因为同一个css可能在多个模块中出现所以会导致重复代码，换句话说这两个插件是两兄弟
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
//由于webpack本身集成了UglifyJS插件（webpack.optimize.UglifyJsPlugin），其命令webpack -p即表示调用UglifyJS来压缩代码
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = require('../config/prod.env')

// 把当前的配置对象和基础的配置对象合并
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 下面就是把utils配置好的处理各种css类型的配置拿过来，和dev设置一样，就是这里多了个extract: true，此项是自定义项，设置为true表示，生成独立的文件
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
    // devtool开发工具，用来生成个sourcemap方便调试
  // 按理说这里不用生成sourcemap多次一举，这里生成了source-map类型的map文件，只用于生产环境
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    // 打包后的文件放在dist目录里面
    path: config.build.assetsRoot,
    // 文件名称使用 static/js/[name].[chunkhash].js, 其中name就是main,chunkhash就是模块的hash值，用于浏览器缓存的
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunkFilename是非入口模块文件，也就是说filename文件中引用了chunckFilename,这样的文件是没有被列在entry中的
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 下面是利用DefinePlugin插件，定义process.env环境变量为env
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false // 禁止压缩时候的警告信息，给用户一种vue高大上没有错误的感觉
        }
      },
      // 压缩后是否生成map文件
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      // 生成独立的css文件，下面是生成独立css文件的名称
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      allChunks: true,
    }),
    //删除css的重复代码
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // 生成html页面的插件
    new HtmlWebpackPlugin({
      filename: config.build.index, //路径
      template: 'index.html',//模板
      // 是否将js文件放到body标签的结尾
      inject: true,
      // 压缩产出后的html页面的配置
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
    // 这个选项决定了 script 标签的引用顺序。默认有四个选项，'none', 'auto', 'dependency', '{function}'。
    // 'dependency' 不用说，按照不同文件的依赖关系来排序。
    // 'auto' 默认值，插件的内置的排序方式，具体顺序这里我也不太清楚...
    // 'none' 无序？ 不太清楚...
    // {function} 提供一个函数？但是函数的参数又是什么? 不太清楚...
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    // 通常在使用了Webpack的项目中我们会使用CommonsChunkPlugin来将所有依赖的第三方包打包到一个名为vender的chunk中。与此同时，为了避免每次更改项目代码时导致vender chunk的chunkHash改变，我们还会单独生成一个manifest chunk。
    //HashedModuleIdsPlugin这个插件的作用就是让没有改变的插件不用再次打包，hash值不再变
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    //webpack3新功能  解释是启用作用域提升， 之前卸载很多方法里边，现在只需要写在一个里边
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 下面的插件是将打包后的文件中的第三方库文件抽取出来，便于浏览器缓存，提高程序的运行速度
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
   // 通常在使用了Webpack的项目中我们会使用CommonsChunkPlugin来将所有依赖的第三方包打包到一个名为vender的chunk中。与此同时，为了避免每次更改项目代码时导致vender chunk的chunkHash改变，我们还会单独生成一个manifest chunk。
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // 复制文件到另一个文件的插件
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

//分析包文件组成的插件
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
