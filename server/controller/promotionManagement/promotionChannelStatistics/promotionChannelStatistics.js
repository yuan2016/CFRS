let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, formatCurrency, mosaicName, formatInt, handleProperty, handleTime, combine, handleTimeMS} = require('../../../utils/utils')
let shell = require('../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.channelCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.nuser_loan_ratio) {
      row.nuser_loan_ratio = (row.nuser_loan_ratio * 100).toFixed(2) + '%'
    }
    if (row.nuser_adoption_rate) {
      row.nuser_adoption_rate = (row.nuser_adoption_rate * 100).toFixed(2) + '%'
    }
    if (row.ouser_adoption_rate) {
      row.ouser_adoption_rate = (row.ouser_adoption_rate * 100).toFixed(2) + '%'
    }
    if (row.BADDEBT_RATE) {
      row.BADDEBT_RATE = (row.BADDEBT_RATE * 100).toFixed(2) + '%'
    }

    if (row.UNITGROSS_PROFIT) {
      row.UNITGROSS_PROFIT = formatCurrency(row.UNITGROSS_PROFIT)
    }
    if (row.effe_cust_acqu_cost) {
      row.effe_cust_acqu_cost = formatCurrency(row.effe_cust_acqu_cost)
    }
    if (row.day_consumption) {
      row.day_consumption = formatCurrency(row.day_consumption)
    }
    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.all_fact_auth_num) {
      row.all_fact_auth_num = formatInt(row.all_fact_auth_num)
    }
    if (row.apply_loan_num) {
      row.apply_loan_num = formatInt(row.apply_loan_num)
    }
    if (row.blacklist_num) {
      row.blacklist_num = formatInt(row.blacklist_num)
    }
    if (row.entries_num) {
      row.entries_num = formatInt(row.entries_num)
    }
    if (row.nuser_apply_succ_num) {
      row.nuser_apply_succ_num = formatInt(row.nuser_apply_succ_num)
    }
    if (row.ouser_apply_succ_num) {
      row.ouser_apply_succ_num = formatInt(row.ouser_apply_succ_num)
    }
    if (row.nuser_loan_amount) {
      row.nuser_loan_amount = formatCurrency(row.nuser_loan_amount)
    }
    if (row.ouser_loan_amount) {
      row.ouser_loan_amount = formatCurrency(row.ouser_loan_amount)
    }
    if (row.overdue_num) {
      row.overdue_num = formatInt(row.overdue_num)
    }
    if (row.DUE_AMOUNT) {
      row.DUE_AMOUNT = formatCurrency(row.DUE_AMOUNT)
    }
    if (row.OVERDUE_AMOUNT) {
      row.OVERDUE_AMOUNT = formatCurrency(row.OVERDUE_AMOUNT)
    }
    if (row.BADDEBT_amount) {
      row.BADDEBT_amount = formatCurrency(row.BADDEBT_amount)
    }
    if (row.baddebt_amount_unit) {
      row.baddebt_amount_unit = formatCurrency(row.baddebt_amount_unit)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.更新时间) {
      row.更新时间 = moment(row.更新时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.新用户借款率) {
      row.新用户借款率 = (row.新用户借款率 * 100).toFixed(2) + '%'
    }
    if (row.新用户通过率) {
      row.新用户通过率 = (row.新用户通过率 * 100).toFixed(2) + '%'
    }
    if (row.老用户通过率) {
      row.老用户通过率 = (row.老用户通过率 * 100).toFixed(2) + '%'
    }
    if (row.坏账率) {
      row.坏账率 = (row.坏账率 * 100).toFixed(2) + '%'
    }

    if (row['单位毛利润(元)']) {
      row['单位毛利润(元)'] = formatCurrency(row['单位毛利润(元)'])
    }
    if (row['有效获客成本(元)']) {
      row['有效获客成本(元)'] = formatCurrency(row['有效获客成本(元)'])
    }
    if (row.当日消耗) {
      row.当日消耗 = formatCurrency(row.当日消耗)
    }
    if (row.注册量) {
      row.注册量 = formatInt(row.注册量)
    }
    if (row.全要素认证人数) {
      row.全要素认证人数 = formatInt(row.全要素认证人数)
    }
    if (row.申请借款人数) {
      row.申请借款人数 = formatInt(row.申请借款人数)
    }
    if (row.黑名单人数) {
      row.黑名单人数 = formatInt(row.黑名单人数)
    }
    if (row.进件数) {
      row.进件数 = formatInt(row.进件数)
    }
    if (row.新用户申请成功人数) {
      row.新用户申请成功人数 = formatInt(row.新用户申请成功人数)
    }
    if (row.老用户申请成功人数) {
      row.老用户申请成功人数 = formatInt(row.老用户申请成功人数)
    }
    if (row['新用户放款金额(元)']) {
      row['新用户放款金额(元)'] = formatCurrency(row['新用户放款金额(元)'])
    }
    if (row['老用户放款金额(元)']) {
      row['老用户放款金额(元)'] = formatCurrency(row['老用户放款金额(元)'])
    }
    if (row.逾期人数) {
      row.逾期人数 = formatInt(row.逾期人数)
    }
    if (row['到期金额(元)']) {
      row['到期金额(元)'] = formatCurrency(row['到期金额(元)'])
    }
    if (row['逾期金额(元)']) {
      row['逾期金额(元)'] = formatCurrency(row['逾期金额(元)'])
    }
    if (row['坏账金额(元)']) {
      row['坏账金额(元)'] = formatCurrency(row['坏账金额(元)'])
    }
    if (row['单位坏账金额(元)']) {
      row['单位坏账金额(元)'] = formatCurrency(row['单位坏账金额(元)'])
    }
    return row
  })
}

function packageRows (rows) {
  let options = [{value: '', label: '不限'}]
  for (let row of rows) {
    let option = {}
    if (row.channel_trader_name && row.channel_trader_name !== '') {
      option.value = row.channel_trader_name
      option.label = row.channel_trader_name
      options.push(option)
    }
  }
  return options
}

module.exports = {
  //每日还款金额数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'a')
    let order = params.order || sql.promotionManagement.promotionChannelStatistics.order
    let query = sql.promotionManagement.promotionChannelStatistics.selectAllFront + queries + order + sql.promotionManagement.promotionChannelStatistics.selectAllBack

    func.connPool1(query, [tableName.promotionChannelStatistics, params.offset, params.limit], function (err, rs) {
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
  //每日还款金额数据总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'a')
    let query = sql.promotionManagement.promotionChannelStatistics.getCount + queries
    func.connPool1(query, [tableName.promotionChannelStatistics], function (err, rs) {
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
  refreshData (req, res) {
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
  getSelectOptions (req, res) {
    func.connPool1(sql.promotionManagement.promotionChannelStatistics.getSelectOptions, tableName.promotionChannelStatistics, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageRows(rs)
      res.json(rs)
    })
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'a')
    let query = sql.promotionManagement.promotionChannelStatistics.selectAllExcel + queries + sql.promotionManagement.promotionChannelStatistics.order
    func.connPool1(query, [tableName.promotionChannelStatistics], function (err, rs) {
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
  }
}
