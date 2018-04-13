let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, analysis, mosaicName} = require('../../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
let shell = require('../../../../config/shell')
let pro = require('child_process')
global.keyDataCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.due_amt) {
      row.due_amt = formatCurrency(row.due_amt)
    }
    if (row.loan_amt) {
      row.loan_amt = formatCurrency(row.loan_amt)
    }
    if (row.erepayment_amt) {
      row.erepayment_amt = formatCurrency(row.erepayment_amt)
    }
    if (row.overdue_amt) {
      row.overdue_amt = formatCurrency(row.overdue_amt)
    }
    if (row.tenover_amt) {
      row.tenover_amt = formatCurrency(row.tenover_amt)
    }
    if (row.d_repayment_amt) {
      row.d_repayment_amt = formatCurrency(row.d_repayment_amt)
    }
    if (row.d_erepayment_amt) {
      row.d_erepayment_amt = formatCurrency(row.d_erepayment_amt)
    }
    if (row.d_overrepayment_amt) {
      row.d_overrepayment_amt = formatCurrency(row.d_overrepayment_amt)
    }

    if (row.d_repaymentrate) {
      row.d_repaymentrate = (row.d_repaymentrate * 100).toFixed(2) + '%'
    }

    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row['当日到期金额(元)']) {
      row['当日到期金额(元)'] = formatCurrency(row['当日到期金额(元)'])
    }
    if (row['截止当前借款金额(元)']) {
      row['截止当前借款金额(元)'] = formatCurrency(row['截止当前借款金额(元)'])
    }
    if (row['截止当前提前还款金额(元)']) {
      row['截止当前提前还款金额(元)'] = formatCurrency(row['截止当前提前还款金额(元)'])
    }
    if (row['逾期中金额(元)']) {
      row['逾期中金额(元)'] = formatCurrency(row['逾期中金额(元)'])
    }
    if (row['逾期十天及以上金额(元)']) {
      row['逾期十天及以上金额(元)'] = formatCurrency(row['逾期十天及以上金额(元)'])
    }
    if (row['当日正常还款金额(元)']) {
      row['当日正常还款金额(元)'] = formatCurrency(row['当日正常还款金额(元)'])
    }
    if (row['当日提前还款金额(元)']) {
      row['当日提前还款金额(元)'] = formatCurrency(row['当日提前还款金额(元)'])
    }
    if (row['当日逾期还款金额(元)']) {
      row['当日逾期还款金额(元)'] = formatCurrency(row['当日逾期还款金额(元)'])
    }
    if (row.当日还款率) {
      row.当日还款率 = (row.当日还款率 * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack
    func.connPool1(query, [tableName.keyData, params.offset, params.limit], function (err, rs) {
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
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.getCount + queries
    func.connPool1(query, [tableName.keyData], function (err, rs) {
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
    if (global.keyDataCount === 0) {
      global.keyDataCount++
      pro.exec(shell.keyData, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 关键数据shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.keyDataCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 关键数据shell脚本执行成功')
          res.json({code: '200'})
          global.keyDataCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 关键数据开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.keyDataExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.keyData], function (err, rs) {
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
