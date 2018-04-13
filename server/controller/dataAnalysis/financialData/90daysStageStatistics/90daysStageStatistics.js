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
global.daysCount90 = 0

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
    if (row.loan_date_f4) {
      row.loan_date_f4 = moment(row.loan_date_f4).format('YYYY-MM-DD')
    }
    if (row.loan_date_f5) {
      row.loan_date_f5 = moment(row.loan_date_f5).format('YYYY-MM-DD')
    }
    if (row.loan_date_f6) {
      row.loan_date_f6 = moment(row.loan_date_f6).format('YYYY-MM-DD')
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
    if (row.due_amount_f4) {
      row.due_amount_f4 = formatCurrency(row.due_amount_f4)
    }
    if (row.repayment_amount_f4) {
      row.repayment_amount_f4 = formatCurrency(row.repayment_amount_f4)
    }
    if (row.due_amount_f5) {
      row.due_amount_f5 = formatCurrency(row.due_amount_f5)
    }
    if (row.repayment_amount_f5) {
      row.repayment_amount_f5 = formatCurrency(row.repayment_amount_f5)
    }
    if (row.due_amount_f6) {
      row.due_amount_f6 = formatCurrency(row.due_amount_f6)
    }
    if (row.repayment_amount_f6) {
      row.repayment_amount_f6 = formatCurrency(row.repayment_amount_f6)
    }
    if (row.TOTAL_LOAN_AMOUNT) {
      row.TOTAL_LOAN_AMOUNT = formatCurrency(row.TOTAL_LOAN_AMOUNT)
    }
    if (row.LOANING_AMOUNT) {
      row.LOANING_AMOUNT = formatCurrency(row.LOANING_AMOUNT)
    }
    if (row.REPAYMENTED_AMOUNT) {
      row.REPAYMENTED_AMOUNT = formatCurrency(row.REPAYMENTED_AMOUNT)
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
    if (row.repayment_rate_f4) {
      row.repayment_rate_f4 = (row.repayment_rate_f4 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_f4) {
      row.overdue_rate_f4 = (row.overdue_rate_f4 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_ouser_f4) {
      row.overdue_rate_ouser_f4 = (row.overdue_rate_ouser_f4 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_nuser_f4) {
      row.overdue_rate_nuser_f4 = (row.overdue_rate_nuser_f4 * 100).toFixed(2) + '%'
    }
    if (row.repayment_rate_f5) {
      row.repayment_rate_f5 = (row.repayment_rate_f5 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_f5) {
      row.overdue_rate_f5 = (row.overdue_rate_f5 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_ouser_f5) {
      row.overdue_rate_ouser_f5 = (row.overdue_rate_ouser_f5 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_nuser_f5) {
      row.overdue_rate_nuser_f5 = (row.overdue_rate_nuser_f5 * 100).toFixed(2) + '%'
    }
    if (row.repayment_rate_f6) {
      row.repayment_rate_f6 = (row.repayment_rate_f6 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_f6) {
      row.overdue_rate_f6 = (row.overdue_rate_f6 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_ouser_f6) {
      row.overdue_rate_ouser_f6 = (row.overdue_rate_ouser_f6 * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_nuser_f6) {
      row.overdue_rate_nuser_f6 = (row.overdue_rate_nuser_f6 * 100).toFixed(2) + '%'
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
  if (row.F4放款日) {
    row.F4放款日 = moment(row.F4放款日).format('YYYY-MM-DD')
  }
  if (row.F5放款日) {
    row.F5放款日 = moment(row.F5放款日).format('YYYY-MM-DD')
  }
  if (row.F6放款日) {
    row.F6放款日 = moment(row.F6放款日).format('YYYY-MM-DD')
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
  if (row['F4到期金额(元)']) {
    row['F4到期金额(元)'] = formatCurrency(row['F4到期金额(元)'])
  }
  if (row['F4还款金额(元)']) {
    row['F4还款金额(元)'] = formatCurrency(row['F4还款金额(元)'])
  }
  if (row['F5到期金额(元)']) {
    row['F5到期金额(元)'] = formatCurrency(row['F5到期金额(元)'])
  }
  if (row['F5还款金额(元)']) {
    row['F5还款金额(元)'] = formatCurrency(row['F5还款金额(元)'])
  }
  if (row['F6到期金额(元)']) {
    row['F6到期金额(元)'] = formatCurrency(row['F6到期金额(元)'])
  }
  if (row['F6还款金额(元)']) {
    row['F6还款金额(元)'] = formatCurrency(row['F6还款金额(元)'])
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
  if (row.F4还款率) {
    row.F4还款率 = (row.F4还款率 * 100).toFixed(2) + '%'
  }
  if (row.F4逾期率) {
    row.F4逾期率 = (row.F4逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F4老用户逾期率) {
    row.F4老用户逾期率 = (row.F4老用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F4新用户逾期率) {
    row.F4新用户逾期率 = (row.F4新用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F5还款率) {
    row.F5还款率 = (row.F5还款率 * 100).toFixed(2) + '%'
  }
  if (row.F5逾期率) {
    row.F5逾期率 = (row.F5逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F5老用户逾期率) {
    row.F5老用户逾期率 = (row.F5老用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F5新用户逾期率) {
    row.F5新用户逾期率 = (row.F5新用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F6还款率) {
    row.F6还款率 = (row.F6还款率 * 100).toFixed(2) + '%'
  }
  if (row.F6逾期率) {
    row.F6逾期率 = (row.F6逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F6老用户逾期率) {
    row.F6老用户逾期率 = (row.F6老用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row.F6新用户逾期率) {
    row.F6新用户逾期率 = (row.F6新用户逾期率 * 100).toFixed(2) + '%'
  }
  if (row['累计借款总额(元)']) {
    row['累计借款总额(元)'] = formatCurrency(row['累计借款总额(元)'])
  }
  if (row['未到期未还款总额(元)']) {
    row['未到期未还款总额(元)'] = formatCurrency(row['未到期未还款总额(元)'])
  }
  if (row['已还总额(元)']) {
    row['已还总额(元)'] = formatCurrency(row['已还总额(元)'])
  }
  return row
})
}

module.exports = {
  //90天分期统计数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack
    func.connPool1(query, [tableName.daysStageStatistics90, params.offset, params.limit], function (err, rs) {
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
  //90天分期统计总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.getCount + queries
    func.connPool1(query, [tableName.daysStageStatistics90], function (err, rs) {
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
    if (global.daysCount90 === 0) {
      global.daysCount90++
      pro.exec(shell.daysStageStatistics90, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 90天分期统计shell脚本执行失败')
          res.json({code: '500'})
          global.daysCount90 = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 90天分期统计shell脚本执行成功')
          res.json({code: '200'})
          global.daysCount90 = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 90天分期统计开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.daysStageStatistics90Excel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.daysStageStatistics90], function (err, rs) {
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
