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

global.channelCount7 = 0

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
    if (row.七日新用户借款率) {
      row.七日新用户借款率 = (row.七日新用户借款率 * 100).toFixed(2) + '%'
    }
    if (row.七日新用户通过率) {
      row.七日新用户通过率 = (row.七日新用户通过率 * 100).toFixed(2) + '%'
    }
    if (row.七日老用户通过率) {
      row.七日老用户通过率 = (row.七日老用户通过率 * 100).toFixed(2) + '%'
    }
    if (row.七日坏账率) {
      row.七日坏账率 = (row.七日坏账率 * 100).toFixed(2) + '%'
    }

    if (row.单位毛利润) {
      row.单位毛利润 = formatCurrency(row.单位毛利润)
    }
    if (row.七日获客成本) {
      row.七日获客成本 = formatCurrency(row.七日获客成本)
    }
    if (row.七日消耗) {
      row.七日消耗 = formatCurrency(row.七日消耗)
    }
    if (row.七日注册量) {
      row.七日注册量 = formatInt(row.七日注册量)
    }
    if (row.七日全要素认证人数) {
      row.七日全要素认证人数 = formatInt(row.七日全要素认证人数)
    }
    if (row.七日申请借款人数) {
      row.七日申请借款人数 = formatInt(row.七日申请借款人数)
    }
    if (row.七日黑名单人数) {
      row.七日黑名单人数 = formatInt(row.七日黑名单人数)
    }
    if (row.七日进件数) {
      row.七日进件数 = formatInt(row.七日进件数)
    }
    if (row.七日新用户申请成功人数) {
      row.七日新用户申请成功人数 = formatInt(row.七日新用户申请成功人数)
    }
    if (row.七日老用户申请成功人数) {
      row.七日老用户申请成功人数 = formatInt(row.七日老用户申请成功人数)
    }
    if (row.七日新用户放款金额) {
      row.七日新用户放款金额 = formatCurrency(row.七日新用户放款金额)
    }
    if (row.七日老用户放款金额) {
      row.七日老用户放款金额 = formatCurrency(row.七日老用户放款金额)
    }
    if (row.七日逾期人数) {
      row.七日逾期人数 = formatInt(row.七日逾期人数)
    }
    if (row.七日到期金额) {
      row.七日到期金额 = formatCurrency(row.七日到期金额)
    }
    if (row.七日逾期金额) {
      row.七日逾期金额 = formatCurrency(row.七日逾期金额)
    }
    if (row.七日坏账金额) {
      row.七日坏账金额 = formatCurrency(row.七日坏账金额)
    }
    if (row.七日单位坏账金额) {
      row.七日单位坏账金额 = formatCurrency(row.七日单位坏账金额)
    }
    if (row.七日单位毛利润) {
      row.七日单位毛利润 = formatCurrency(row.七日单位毛利润)
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
    let order = params.order || sql.promotionManagement.promotionChannelStatistics7.order
    let queries = analysis(params, 'd_date', 'a')
    let query = sql.promotionManagement.promotionChannelStatistics7.selectAllFront + queries + order + sql.promotionManagement.promotionChannelStatistics7.limit
    func.connPool1(query, [tableName.promotionChannelStatistics7, params.offset, params.limit], function (err, rs) {
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
    let query = sql.promotionManagement.promotionChannelStatistics7.getCount + queries
    func.connPool1(query, [tableName.promotionChannelStatistics7, params.startTime, params.endTime], function (err, rs) {
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
    if (global.channelCount7 === 0) {
      global.channelCount7++
      pro.exec(shell.promotionChannelStatistics7, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 七日推广统计(渠道)shell脚本执行失败')
          res.json({code: '500'})
          global.channelCount7 = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 七日推广统计(渠道)shell脚本执行成功')
          res.json({code: '200'})
          global.channelCount7 = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 七日推广统计(渠道)开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getSelectOptions (req, res) {
    func.connPool1(sql.promotionManagement.promotionChannelStatistics7.getSelectOptions, tableName.promotionChannelStatistics7, function (err, rs) {
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
    let query = sql.promotionManagement.promotionChannelStatistics7.selectAllExcel + queries + sql.promotionManagement.promotionChannelStatistics7.order
    func.connPool1(query, tableName.promotionChannelStatistics7, function (err, rs) {
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
