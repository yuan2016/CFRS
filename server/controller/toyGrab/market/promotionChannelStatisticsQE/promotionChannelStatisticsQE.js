let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {analysis, formatCurrency, mosaicName, formatInt} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.channelCount = 0

function formatData(rows) {
  return rows.map(row => {
    if (row.d_date && String(row.d_date).indexOf('/') === -1) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.recharge_user_rate) {
      row.recharge_user_rate = (row.recharge_user_rate * 100).toFixed(2) + '%'
    }
    if (row.new_recharge_rate) {
      row.new_recharge_rate = (row.new_recharge_rate * 100).toFixed(2) + '%'
    }
    if (row.register_recharge_rate) {
      row.register_recharge_rate = (row.register_recharge_rate * 100).toFixed(2) + '%'
    }
    if (row.day_consumption) {
      row.day_consumption = formatCurrency(row.day_consumption)
    }
    if (row.recharge_money) {
      row.recharge_money = formatCurrency(row.recharge_money)
    }
    if (row.avg_recharge_money) {
      row.avg_recharge_money = formatCurrency(row.avg_recharge_money)
    }
    if (row.recharge_dramt) {
      row.recharge_dramt = formatCurrency(row.recharge_dramt)
    }
    if (row.payuser_cost) {
      row.payuser_cost = formatCurrency(row.payuser_cost)
    }

    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.user_device_num) {
      row.user_device_num = formatInt(row.user_device_num)
    }
    if (row.recharge_user_num) {
      row.recharge_user_num = formatInt(row.recharge_user_num)
    }
    if (row.login_num) {
      row.login_num = formatInt(row.login_num)
    }
    if (row.recharge_drnum) {
      row.recharge_drnum = formatInt(row.recharge_drnum)
    }
    return row
  })
}

function formatExcelData(rows) {
  return rows.map(row => {
    if (row.日期 && String(row.日期).indexOf('/') === -1) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.充值用户转化率) {
      row.充值用户转化率 = (row.充值用户转化率 * 100).toFixed(2) + '%'
    }
    if (row.新用户当日充值率) {
      row.新用户当日充值率 = (row.新用户当日充值率 * 100).toFixed(2) + '%'
    }
    if (row.当日注册用户充值金额占比) {
      row.当日注册用户充值金额占比 = (row.当日注册用户充值金额占比 * 100).toFixed(2) + '%'
    }

    if (row['当日消耗(元)']) {
      row['当日消耗(元)'] = formatCurrency(row['当日消耗(元)'])
    }
    if (row['充值总金额(元)']) {
      row['充值总金额(元)'] = formatCurrency(row['充值总金额(元)'])
    }
    if (row['平均用户充值金额(元)']) {
      row['平均用户充值金额(元)'] = formatCurrency(row['平均用户充值金额(元)'])
    }
    if (row['付费用户成本(元)']) {
      row['付费用户成本(元)'] = formatCurrency(row['付费用户成本(元)'])
    }
    if (row['注册新用户当日充值金额(元)']) {
      row['注册新用户当日充值金额(元)'] = formatCurrency(row['注册新用户当日充值金额(元)'])
    }
    if (row.注册数) {
      row.注册数 = formatInt(row.注册数)
    }
    if (row.注册设备数) {
      row.注册设备数 = formatInt(row.注册设备数)
    }
    if (row.每日充值用户人数) {
      row.每日充值用户人数 = formatInt(row.每日充值用户人数)
    }
    if (row.登录人数) {
      row.登录人数 = formatInt(row.登录人数)
    }
    if (row.注册新用户当日充值人数) {
      row.注册新用户当日充值人数 = formatInt(row.注册新用户当日充值人数)
    }
    return row
  })
}

function formatProperty (rs) {
  let result = {}
  result.a = []
  result.b = []
  if (rs.length > 0) {
    let a = []
    let b = []
    let keys = Object.keys(rs[0])
    rs.map(r => {
      a.push(r[keys[0]])
      b.push(r[keys[1]])
    })
    result.a = a
    result.b = b
  }
  return result
}

function packageRows(rows) {
  let options = [{value: '', label: '不限'}]
  for (let row of rows) {
    let option = {}
    if (row.channel_name && row.channel_name !== '') {
      option.value = row.channel_name
      option.label = row.channel_name
      options.push(option)
    }
  }
  return options
}

module.exports = {
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.toyGrab.market.promotionChannelStatisticsQE.order
    let query = sql.toyGrab.market.promotionChannelStatisticsQE.selectAll + queries + sql.toyGrab.market.promotionChannelStatisticsQE.groupByD + order + sql.toyGrab.market.promotionChannelStatisticsQE.selectAllBack
    func.connPool1(query, [tableName.QEpromotionChannelStatistics, params.offset, params.limit], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        if (err.message === 'Query inactivity timeout') {
          res.json({
            code: '1024'
          })
        } else {
          res.json({
            code: '404'
          })
        }
        return
      }
      rs = formatData(rs)
      res.json(rs)
    })
  },
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query
    if (params.startTime[0] === params.endTime[0] || params.startTime[0] === moment(new Date()).format('YYYY-MM-DD')  || (!params.startTime[0] && !params.endTime[0])) {
      query = sql.toyGrab.market.promotionChannelStatisticsQE.getCount + queries
    } else {
      query = sql.toyGrab.market.promotionChannelStatisticsQE.getCountD + queries
    }
    func.connPool1(query, [tableName.QEpromotionChannelStatistics], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        if (err.message === 'Query inactivity timeout') {
          res.json({
            code: '1024'
          })
        } else {
          res.json({
            code: '404'
          })
        }
        return
      }
      res.json(rs)
    })
  },
  refreshData(req, res) {
    if (global.channelCount === 0) {
      global.channelCount++
      pro.exec(shell.promotionChannelStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 推广统计(渠道)shell脚本执行失败')
          res.json({code: '500'})
          global.channelCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 推广统计(渠道)shell脚本执行成功')
          res.json({code: '200'})
          global.channelCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 推广统计(渠道)开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  // getSelectOptions (req, res) {
  //   func.connPool1(sql.promotionManagement.promotionChannelStatistics.getSelectOptions, tableName.promotionChannelStatistics, function (err, rs) {
  //     if (err) {
  //       console.log('[query] - :' + err)
  //     }
  //     rs = packageRows(rs)
  //     res.json(rs)
  //   })
  // },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.toyGrab.market.promotionChannelStatisticsQE.selectAllExcel + queries + sql.toyGrab.market.promotionChannelStatisticsQE.order
    func.connPool1(query, [tableName.QEpromotionChannelStatistics], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        if (err.message === 'Query inactivity timeout') {
          res.json({
            code: '1024'
          })
        } else {
          res.json({
            code: '404'
          })
        }
        return
      }
      rs = formatExcelData(rs)
      let fileName = mosaicName()
      let currFilePath = path.join(process.cwd(), fileName)
      let options = {
        headers: {
          'Content-Disposition': 'attachment; filename=' + fileName
        }
      }
      let writer = new XLSXWriter(fileName, {})
      let wirteStream = fs.createWriteStream(fileName)

// After instantiation, you can grab the readstream at any time.
      writer.getReadStream().pipe(wirteStream)
      for (let i of rs) {
        writer.addRow(i)
      }
      writer.finalize()
      wirteStream.on('finish', function () {
        // finish
        res.sendFile(currFilePath, options, function () {
          if (err) {
            console.log(err)
            res.sendFile(path.join(process.cwd(), 'error.html'))
            return
          } else {
            console.log('Sent:', fileName)
            fs.unlink(currFilePath, function (err) {
              if (err) console.log(err)
              console.log('文件删除成功')
            })
          }
        })
      })
    }, 180000)
  },
  update(req, res) {
    let params = req.body
    let formData = params.formData
    let date = params.date
    let name = params.name
    let query = sql.toyGrab.market.promotionChannelStatisticsQE.update
    func.connPool1(query, [tableName.QEpromotionChannelStatistics, formData.day_consumption, formData.payuser_cost, name, date], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        if (err.message === 'Query inactivity timeout') {
          res.json({
            code: '1024'
          })
        } else {
          res.json({
            code: '404'
          })
        }
        return
      }
      if (rs.changedRows === 1) {
        res.json(200)
      } else {
        res.json(500)
      }
    })
  },
  fetOnlineStatisticsHourly(req, res) {
    let params = req.body
    let date = params.date

    let query = sql.toyGrab.market.promotionChannelStatisticsQE.getOnlineNumber
    func.connPool1(query, [tableName.QEonlineStatisticsHourly, date], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        if (err.message === 'Query inactivity timeout') {
          res.json({
            code: '1024'
          })
        } else {
          res.json({
            code: '404'
          })
        }
        return
      }
      res.json(formatProperty(rs))
    })
  },
  fetchAllSUM(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let t1 = ''
    let t2 = ''
    let t = ''
    if (params.startTime[0] || params.endTime[0]) {
      t1 = params.startTime[0] || '-'
      t2 = params.endTime[0] || '-'
      t = t1 + ' / ' + t2
    }
    let query = sql.toyGrab.market.promotionChannelStatisticsQE.selectALLSUM + queries + sql.toyGrab.market.promotionChannelStatisticsQE.groupBy + sql.toyGrab.market.promotionChannelStatisticsQE.order
    func.connPool1(query, [t, tableName.QEpromotionChannelStatistics], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        if (err.message === 'Query inactivity timeout') {
          res.json({
            code: '1024'
          })
        } else {
          res.json({
            code: '404'
          })
        }
        return
      }
      rs = formatData(rs)
      res.json(rs)
    })
  },
  getExcelSUMData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let startT = params.startTime.replace(/["]/g, '').split(',')
    let endT = params.endTime.replace(/["]/g, '').split(',')
    let t1 = ''
    let t2 = ''
    let t = ''
    if (startT[0] || endT[0]) {
      t1 = startT[0] || '-'
      t2 = endT[0] || '-'
      t = t1 + ' / ' + t2
    }
    let query = sql.toyGrab.market.promotionChannelStatisticsQE.selectALLSUMExcel + queries + sql.toyGrab.market.promotionChannelStatisticsQE.groupBy
    func.connPool1(query, [t, tableName.QEpromotionChannelStatistics], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        if (err.message === 'Query inactivity timeout') {
          res.json({
            code: '1024'
          })
        } else {
          res.json({
            code: '404'
          })
        }
        return
      }
      rs = formatExcelData(rs)
      let fileName = mosaicName()
      let currFilePath = path.join(process.cwd(), fileName)
      let options = {
        headers: {
          'Content-Disposition': 'attachment; filename=' + fileName
        }
      }
      let writer = new XLSXWriter(fileName, {})
      let wirteStream = fs.createWriteStream(fileName)

// After instantiation, you can grab the readstream at any time.
      writer.getReadStream().pipe(wirteStream)
      for (let i of rs) {
        writer.addRow(i)
      }
      writer.finalize()
      wirteStream.on('finish', function () {
        // finish
        res.sendFile(currFilePath, options, function () {
          if (err) {
            console.log(err)
            res.sendFile(path.join(process.cwd(), 'error.html'))
            return false
          } else {
            console.log('Sent:', fileName)
            fs.unlink(currFilePath, function (err) {
              if (err) console.log(err)
              console.log('文件删除成功')
            })
          }
        })
      })
    }, 180000)
  },
  getSelectOptions (req, res) {
    func.connPool1(sql.toyGrab.market.promotionChannelStatisticsQE.getSelectOptions, tableName.QEpromotionChannelStatistics, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageRows(rs)
      res.json(rs)
    })
  },
  modifyParams (req, res) {
    let query = req.body
    let inputs = query.inputs
    let itemsIndexs = query.itemsIndexs
    let itemsNames = query.itemsNames
    let itemsValues = query.itemsValues
    let select, excelSelect, sqls = [], excelSqls = []
    for(let i = 0; i < inputs.length; i++) {
      if (inputs[i]) {
        let arr = inputs[i].split('')
        let temp = []
        let length = arr.length
        for (let j = 0; j < length; j++) {
          let index = itemsIndexs.indexOf(arr[j])
          if (index > -1) {
            temp.push(itemsValues[index])
          } else {
            temp.push(arr[j])
          }
        }
        excelSqls.push(temp.join(''))
      } else {
        excelSqls.push(itemsValues[i])
      }
    }
    console.log(excelSqls)  
  } 
}