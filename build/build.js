'use strict'
require('./check-versions')()

//process 对象是一个全局变量，它提供当前 Node.js 进程的有关信息，以及控制当前 Node.js 进程。 因为是全局变量，所以无需使用 require()
process.env.NODE_ENV = 'production'

// ora是一个命令行转圈圈动画插件，好看用的
const ora = require('ora')
// rimraf插件是用来执行UNIX命令rm和-rf的用来删除文件夹和文件，清空旧的文件
const rm = require('rimraf')
// node.js路径模块
const path = require('path')
// chalk插件，用来在命令行中输入不同颜色的文字
const chalk = require('chalk')
// 引入webpack模块使用内置插件和webpack方法
const webpack = require('webpack')
// 引入config下的index.js配置文件
const config = require('../config')
// 下面是生产模式的webpack配置文件
const webpackConfig = require('./webpack.prod.conf')

// 开启转圈圈动画
const spinner = ora('building for production...')
spinner.start()
let start = new Date().getTime()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    //process.stdout.write 表示标准输出。该对象的write方法等同于console.log，可用在标准输出向用户显示内容。
    // stats对象中保存着编译过程中的各种消息
    process.stdout.write(stats.toString({
      colors: true, // 增加控制台颜色开关
      modules: false, // 不增加内置模块信息
      children: false, // 不增加子级信息
      chunks: false, // 允许较少的输出
      chunkModules: false // 不将内置模块的信息加到包信息
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.yellow('  Build failed with errors.\n'))
      process.exit(1)
    }

    let end = new Date().getTime()
    let time= (end - start) / 1000
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.red('打包用时:' + time + 's'))
  })
})
