let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, analysis, mosaicName} = require('../../../../utils/utils')
let pro = require('child_process')
let shell = require('../../../../config/shell')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
global.installmentPromotionCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.loan_date_f1) {
      row.loan_date_f1 = moment(row.loan_date_f1).format('YYYY-MM-DD')
    }
    if (row.loan_date_f2) {
      row.loan_date_f2 = moment(row.loan_date_f2).format('YYYY-MM-DD')
    }
    if (row.loan_date_f3) {
      row.loan_date_f3 = moment(row.loan_date_f3).format('YYYY-MM-DD')
    }

    if (row.due_amount_f1) {
      row.due_amount_f1 = formatCurrency(row.due_amount_f1)
    }
    if (row.repayment_amount_f1) {
      row.repayment_amount_f1 = formatCurrency(row.repayment_amount_f1)
    }
    if (row.due_amount_f2) {
      row.due_amount_f2 = formatCurrency(row.due_amount_f2)
    }
    if (row.repayment_amount_f2) {
      row.repayment_amount_f2 = formatCurrency(row.repayment_amount_f2)
    }
    if (row.due_amount_f3) {
      row.due_amount_f3 = formatCurrency(row.due_amount_f3)
    }
    if (row.repayment_amount_f3) {
      row.repayment_amount_f3 = formatCurrency(row.repayment_amount_f3)
    }

    if (row.repayment_rate_f1) {
      row.repayment_rate_f1 = (row.repayment_rate_f1 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_f1) {
      row.overdue_rate_f1 = (row.overdue_rate_f1 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_ouser_f1) {
      row.overdue_rate_ouser_f1 = (row.overdue_rate_ouser_f1 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_nuser_f1) {
      row.overdue_rate_nuser_f1 = (row.overdue_rate_nuser_f1 * 100).toFixed(2) + '%'
    }
    if (row.repayment_rate_f2) {
      row.repayment_rate_f2 = (row.repayment_rate_f2 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_f2) {
      row.overdue_rate_f2 = (row.overdue_rate_f2 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_ouser_f2) {
      row.overdue_rate_ouser_f2 = (row.overdue_rate_ouser_f2 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_nuser_f2) {
      row.overdue_rate_nuser_f2 = (row.overdue_rate_nuser_f2 * 100).toFixed(2) + '%'
    }
    if (row.repayment_rate_f3) {
      row.repayment_rate_f3 = (row.repayment_rate_f3 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_f3) {
      row.overdue_rate_f3 = (row.overdue_rate_f3 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_ouser_f3) {
      row.overdue_rate_ouser_f3 = (row.overdue_rate_ouser_f3 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_nuser_f3) {
      row.overdue_rate_nuser_f3 = (row.overdue_rate_nuser_f3 * 100).toFixed(2) + '%'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.到期日) {
    row.到期日 = moment(row.到期日).format('YYYY-MM-DD')
  }
  if (row.F1放款日) {
    row.F1放款日 = moment(row.F1放款日).format('YYYY-MM-DD')
  }
  if (row.F2放款日) {
    row.F2放款日 = moment(row.F2放款日).format('YYYY-MM-DD')
  }
  if (row.F3放款日) {
    row.F3放款日 = moment(row.F3放款日).format('YYYY-MM-DD')
  }

  if (row['F1到期金额(元)']) {
    row['F1到期金额(元)'] = formatCurrency(row['F1到期金额(元)'])
  }
  if (row['F1还款金额(元)']) {
    row['F1还款金额(元)'] = formatCurrency(row['F1还款金额(元)'])
  }
  if (row['F2到期金额(元)']) {
    row['F2到期金额(元)'] = formatCurrency(row['F2到期金额(元)'])
  }
  if (row['F2还款金额(元)']) {
    row['F2还款金额(元)'] = formatCurrency(row['F2还款金额(元)'])
  }
  if (row['F3到期金额(元)']) {
    row['F3到期金额(元)'] = formatCurrency(row['F3到期金额(元)'])
  }
  if (row['F3还款金额(元)']) {
    row['F3还款金额(元)'] = formatCurrency(row['F3还款金额(元)'])
  }

  if (row.F1还款率) {
    row.F1还款率 = (row.F1还款率 * 100).toFixed(2) + '%'
  }
  if (row.F1逾期率) {
    row.F1逾期率 = (row.F1逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F1老用户逾期率) {
    row.F1老用户逾期率 = (row.F1老用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F1新用户逾期率) {
    row.F1新用户逾期率 = (row.F1新用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F2还款率) {
    row.F2还款率 = (row.F2还款率 * 100).toFixed(2) + '%'
  }
  if (row.F2逾期率) {
    row.F2逾期率 = (row.F2逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F2老用户逾期率) {
    row.F2老用户逾期率 = (row.F2老用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F2新用户逾期率) {
    row.F2新用户逾期率 = (row.F2新用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F3还款率) {
    row.F3还款率 = (row.F3还款率 * 100).toFixed(2) + '%'
  }
  if (row.F3逾期率) {
    row.F3逾期率 = (row.F3逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F3老用户逾期率) {
    row.F3老用户逾期率 = (row.F3老用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F3新用户逾期率) {
    row.F3新用户逾期率 = (row.F3新用户逾期率 * 100).toFixed(2) + '%'
  }
  return row
})
}

module.exports = {
  //21天分期统计数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack
    func.connPool1(query, [tableName.installmentPromotionStatistics21, params.offset, params.limit], function (err, rs) {
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
  //21天分期统计总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.getCount + queries
    func.connPool1(query, [tableName.installmentPromotionStatistics21], function (err, rs) {
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
    if (global.installmentPromotionCount === 0) {
      global.installmentPromotionCount++
      pro.exec(shell.installmentPromotionStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 21天分期提额统计shell脚本执行失败')
          res.json({code: '500'})
          global.installmentPromotionCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 21天分期提额统计shell脚本执行成功')
          res.json({code: '200'})
          global.installmentPromotionCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 21天分期提额统计开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.installmentPromotionStatistics21Excel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.installmentPromotionStatistics21], function (err, rs) {
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

