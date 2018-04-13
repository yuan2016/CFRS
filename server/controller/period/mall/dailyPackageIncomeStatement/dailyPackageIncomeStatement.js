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
    if (row.dlb_quota) {
      row.dlb_quota = formatCurrency(row.dlb_quota)
    }
    if (row.dlb_income) {
      row.dlb_income = formatCurrency(row.dlb_income)
    }
    if (row.dlb_refund) {
      row.dlb_refund = formatCurrency(row.dlb_refund)
    }
    if (row.dlb_income_balance) {
      row.dlb_income_balance = formatCurrency(row.dlb_income_balance)
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
    if (row['大礼包额度(元)']) {
      row['大礼包额度(元)'] = formatCurrency(row['大礼包额度(元)'])
    }
    if (row['礼包收入(元)']) {
      row['礼包收入(元)'] = formatCurrency(row['礼包收入(元)'])
    }
    if (row['礼包退款(元)']) {
      row['礼包退款(元)'] = formatCurrency(row['礼包退款(元)'])
    }
    if (row['礼包收入余额(元)']) {
      row['礼包收入余额(元)'] = formatCurrency(row['礼包收入余额(元)'])
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
    let order = params.order || sql.period.dailyPackageIncomeStatement.order
    let query = sql.period.dailyPackageIncomeStatement.selectAll + queries + order + sql.period.dailyPackageIncomeStatement.selectAllBack
    func.connPool1(query, [tableName.period.dailyPackageIncomeStatement, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.dailyPackageIncomeStatement.getCount + queries
    func.connPool1(query, [tableName.period.dailyPackageIncomeStatement], function (err, rs) {
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
    let query = sql.period.dailyPackageIncomeStatement.selectAllExcel + queries + sql.period.dailyPackageIncomeStatement.order
    func.connPool1(query, [tableName.period.dailyPackageIncomeStatement], function (err, rs) {
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
