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

global.monthlySettlementDataCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.D_MONTH) {
      row.D_MONTH = row.D_MONTH + '月'
    }
    if (row.CREATE_TIME) {
      row.CREATE_TIME = moment(row.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.ADVANCE_REPAYMENT_AMT) {
      row.ADVANCE_REPAYMENT_AMT = formatCurrency(row.ADVANCE_REPAYMENT_AMT)
    }
    if (row.ADVANCE_REPAYMENT_INTEREST) {
      row.ADVANCE_REPAYMENT_INTEREST = formatCurrency(row.ADVANCE_REPAYMENT_INTEREST)
    }
    if (row.REPAYMENT_AMT) {
      row.REPAYMENT_AMT = formatCurrency(row.REPAYMENT_AMT)
    }
    if (row.REPAYMENT_INTEREST) {
      row.REPAYMENT_INTEREST = formatCurrency(row.REPAYMENT_INTEREST)
    }
    if (row.OVERDUE_REPAYMENT_AMT) {
      row.OVERDUE_REPAYMENT_AMT = formatCurrency(row.OVERDUE_REPAYMENT_AMT)
    }
    if (row.OVERDUE_REPAYMENT_INTEREST) {
      row.OVERDUE_REPAYMENT_INTEREST = formatCurrency(row.OVERDUE_REPAYMENT_INTEREST)
    }
    if (row.OVERDUE_LATE_FEE) {
      row.OVERDUE_LATE_FEE = formatCurrency(row.OVERDUE_LATE_FEE)
    }
    if (row.RENEWAL_FEE) {
      row.RENEWAL_FEE = formatCurrency(row.RENEWAL_FEE)
    }
    if (row.LQ_RECHARGE) {
      row.LQ_RECHARGE = formatCurrency(row.LQ_RECHARGE)
    }
    if (row.TOTAL_AMT) {
      row.TOTAL_AMT = formatCurrency(row.TOTAL_AMT)
    }
    if (row.YIMATONG_FEE) {
      row.YIMATONG_FEE = formatCurrency(row.YIMATONG_FEE)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row['月份']) {
      row['月份'] = row['月份'] + '月'
    }
    if (row['创建时间']) {
      row['创建时间'] = moment(row['创建时间']).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row['提前还款本金(元)']) {
      row['提前还款本金(元)'] = formatCurrency(row['提前还款本金(元)'])
    }
    if (row['提前还款利息(元)']) {
      row['提前还款利息(元)'] = formatCurrency(row['提前还款利息(元)'])
    }
    if (row['正常还款本金(元)']) {
      row['正常还款本金(元)'] = formatCurrency(row['正常还款本金(元)'])
    }
    if (row['正常还款利息(元)']) {
      row['正常还款利息(元)'] = formatCurrency(row['正常还款利息(元)'])
    }
    if (row['逾期还款本金(元)']) {
      row['逾期还款本金(元)'] = formatCurrency(row['逾期还款本金(元)'])
    }
    if (row['逾期还款利息(元)']) {
      row['逾期还款利息(元)'] = formatCurrency(row['逾期还款利息(元)'])
    }
    if (row['逾期滞纳金(元)']) {
      row['逾期滞纳金(元)'] = formatCurrency(row['逾期滞纳金(元)'])
    }
    if (row['续期费(元)']) {
      row['续期费(元)'] = formatCurrency(row['续期费(元)'])
    }
    if (row['零钱充值(元)']) {
      row['零钱充值(元)'] = formatCurrency(row['零钱充值(元)'])
    }
    if (row['合计(元)']) {
      row['合计(元)'] = formatCurrency(row['合计(元)'])
    }
    if (row['益码通手续费(元)']) {
      row['益码通手续费(元)'] = formatCurrency(row['益码通手续费(元)'])
    }
    return row
  })
}

module.exports = {
  //每月债权表
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_month', 'w')
    let order = params.order || sql.period.monthlySettlementData.order
    let query = sql.period.monthlySettlementData.selectSum + queries + ' UNION ALL ' + '(' + sql.period.monthlySettlementData.selectAll + queries + order + sql.period.monthlySettlementData.selectAllBack + ')'
    func.connPool1(query, [tableName.period.monthlySettlementData, tableName.period.monthlySettlementData, params.offset, params.limit], function (err, rs) {
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
  //每月债权表总条数
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_month', 'w')
    let query = sql.period.monthlySettlementData.getCount + queries
    func.connPool1(query, [tableName.period.monthlySettlementData], function (err, rs) {
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
    if (global.monthlySettlementDataCount === 0) {
      global.monthlySettlementDataCount++
      pro.exec(shell.monthlySettlementData, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '  每月结算表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.monthlySettlementDataCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每月结算表shell脚本执行成功')
          res.json({code: '200'})
          global.monthlySettlementDataCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '  每月结算表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_month', 'w')
    let query = sql.period.monthlySettlementData.selectSumExcel + queries + ' UNION ALL ' + '(' + sql.period.monthlySettlementData.selectAllExcel + queries + sql.period.monthlySettlementData.order + ')'
    func.connPool1(query, [tableName.period.monthlySettlementData, tableName.period.monthlySettlementData], function (err, rs) {
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
