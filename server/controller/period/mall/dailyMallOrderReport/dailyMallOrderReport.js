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

global.dailyPackageIncomeStatementCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD ')
    }
    // money
    if (row.free_amount) {
      row.free_amount = formatCurrency(row.free_amount)
    }
    if (row.buy_amount) {
      row.buy_amount = formatCurrency(row.buy_amount)
    }
    if (row.debt_amount) {
      row.debt_amount = formatCurrency(row.debt_amount)
    }
    if (row.amount) {
      row.amount = formatCurrency(row.amount)
    }
    if (row.product_amount) {
      row.product_amount = formatCurrency(row.product_amount)
    }
    if (row.diff) {
      row.diff = formatCurrency(row.diff)
    }
    if (row.m_month) {
      row.m_month = row.m_month + '月'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD ')
    }
    // money
    if (row['优惠券使用金额(元)']) {
      row['优惠券使用金额(元)'] = formatCurrency(row['优惠券使用金额(元)'])
    }
    if (row['零钱购买金额(元)']) {
      row['零钱购买金额(元)'] = formatCurrency(row['零钱购买金额(元)'])
    }
    if (row['白条使用金额(元)']) {
      row['白条使用金额(元)'] = formatCurrency(row['白条使用金额(元)'])
    }
    if (row['数据合计(元)']) {
      row['数据合计(元)'] = formatCurrency(row['数据合计(元)'])
    }
    if (row['商品总额(元)']) {
      row['商品总额(元)'] = formatCurrency(row['商品总额(元)'])
    }
    if (row['差异(元)']) {
      row['差异(元)'] = formatCurrency(row['差异(元)'])
    }

    if (row.月份) {
      row.月份 = row.月份 + '月'
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.dailyMallOrderReport.order
    let query = sql.period.dailyMallOrderReport.selectAll + queries + order + sql.period.dailyMallOrderReport.selectAllBack
    func.connPool1(query, [tableName.period.dailyMallOrderReport, params.offset, params.limit], function (err, rs) {
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
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.dailyMallOrderReport.getCount + queries
    func.connPool1(query, [tableName.period.dailyMallOrderReport], function (err, rs) {
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
    if (global.dailyPackageIncomeStatementCount === 0) {
      global.dailyPackageIncomeStatementCount++
      pro.exec(shell.detailIncome, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.dailyPackageIncomeStatementCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表shell脚本执行成功')
          res.json({code: '200'})
          global.dailyPackageIncomeStatementCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.dailyMallOrderReport.selectAllExcel + queries + sql.period.dailyMallOrderReport.order
    func.connPool1(query, [tableName.period.dailyMallOrderReport], function (err, rs) {
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
