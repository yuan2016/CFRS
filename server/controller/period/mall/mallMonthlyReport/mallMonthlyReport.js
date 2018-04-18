let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let {exportJsonToExcel} = require('../../../../utils/excel')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.mallMonthlyReportCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    // money
    if (row.pocket_recharge) {
      row.pocket_recharge = formatCurrency(row.pocket_recharge)
    }
    if (row.recharge_fee) {
      row.recharge_fee = formatCurrency(row.recharge_fee)
    }
    if (row.repaymented_amount) {
      row.repaymented_amount = formatCurrency(row.repaymented_amount)
    }
    if (row.withdraw_amount) {
      row.withdraw_amount = formatCurrency(row.withdraw_amount)
    }
    if (row.withdraw_fee) {
      row.withdraw_fee = formatCurrency(row.withdraw_fee)
    }
    if (row.dlb_income) {
      row.dlb_income = formatCurrency(row.dlb_income)
    }
    if (row.dlb_refund) {
      row.dlb_refund = formatCurrency(row.dlb_refund)
    }
    if (row.pocket_pay) {
      row.pocket_pay = formatCurrency(row.pocket_pay)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row['零钱充值(元)']) {
      row['零钱充值(元)'] = formatCurrency(row['零钱充值(元)'])
    }
    if (row['充值手续费(元)']) {
      row['充值手续费(元)'] = formatCurrency(row['充值手续费(元)'])
    }
    if (row['提现金额(元)']) {
      row['提现金额(元)'] = formatCurrency(row['提现金额(元)'])
    }
    if (row['提现手续费(元)']) {
      row['提现手续费(元)'] = formatCurrency(row['提现手续费(元)'])
    }
    if (row['大礼包收入(元)']) {
      row['大礼包收入(元)'] = formatCurrency(row['大礼包收入(元)'])
    }
    if (row['大礼包退款(元)']) {
      row['大礼包退款(元)'] = formatCurrency(row['大礼包退款(元)'])
    }
    if (row['商品零钱支付(元)']) {
      row['商品零钱支付(元)'] = formatCurrency(row['商品零钱支付(元)'])
    }
    return row
  })
}

module.exports = {
  //每日还款明细记录
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'y_year', 'w')
    let order = params.order || sql.period.mallMonthlyReport.order
    let query = sql.period.mallMonthlyReport.selectAll + queries + order + sql.period.mallMonthlyReport.selectAllBack
    func.connPool1(query, [tableName.period.mallMonthlyReport, params.offset, params.limit], function (err, rs) {
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
  //每日还款明细记录总条数
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'y_year', 'w')
    let query = sql.period.mallMonthlyReport.getCount + queries
    func.connPool1(query, [tableName.period.mallMonthlyReport], function (err, rs) {
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
    if (global.mallMonthlyReportCount === 0) {
      global.mallMonthlyReportCount++
      pro.exec(shell.mallMonthlyReport, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.mallMonthlyReportCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录shell脚本执行成功')
          res.json({code: '200'})
          global.mallMonthlyReportCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'y_year', 'w')
    let query = sql.period.mallMonthlyReport.selectAllExcel + queries + sql.period.mallMonthlyReport.order
    func.connPool1(query, [tableName.period.mallMonthlyReport], function (err, rs) {
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
  }
}
