let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, mosaicName, analysis} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.overdueCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.loan_amount_total) {
      row.loan_amount_total = formatInt(row.loan_amount_total)
    }
    if (row.loan_money_total) {
      row.loan_money_total = formatCurrency(row.loan_money_total)
    }
    if (row.repayment_amount_total) {
      row.repayment_amount_total = formatInt(row.repayment_amount_total)
    }
    if (row.repayment_money_total) {
      row.repayment_money_total = formatCurrency(row.repayment_money_total)
    }
    if (row.quantity_overdue) {
      row.quantity_overdue = formatInt(row.quantity_overdue)
    }
    if (row.total_overdue) {
      row.total_overdue = formatCurrency(row.total_overdue)
    }
    if (row.OVERDUE_AMT_10_A) {
      row.OVERDUE_AMT_10_A = formatCurrency(row.OVERDUE_AMT_10_A)
    }
    if (row.OVERDUE_AMT_10_14) {
      row.OVERDUE_AMT_10_14 = formatCurrency(row.OVERDUE_AMT_10_14)
    }
    if (row.OVERDUE_AMT_10_F21) {
      row.OVERDUE_AMT_10_F21 = formatCurrency(row.OVERDUE_AMT_10_F21)
    }

    if (row.m_overdue_rate_s1) {
      row.m_overdue_rate_s1 = (row.m_overdue_rate_s1 * 100).toFixed(2) + '%'
    }
    if (row.m_overdue_rate_s2) {
      row.m_overdue_rate_s2 = (row.m_overdue_rate_s2 * 100).toFixed(2) + '%'
    }
    if (row.m_overdue_rate_s3) {
      row.m_overdue_rate_s3 = (row.m_overdue_rate_s3 * 100).toFixed(2) + '%'
    }
    if (row.m_overdue_rate_m3) {
      row.m_overdue_rate_m3 = (row.m_overdue_rate_m3 * 100).toFixed(2) + '%'
    }
    if (row.n_overdue_rate_s1) {
      row.n_overdue_rate_s1 = (row.n_overdue_rate_s1 * 100).toFixed(2) + '%'
    }
    if (row.n_overdue_rate_s2) {
      row.n_overdue_rate_s2 = (row.n_overdue_rate_s2 * 100).toFixed(2) + '%'
    }
    if (row.n_overdue_rate_s3) {
      row.n_overdue_rate_s3 = (row.n_overdue_rate_s3 * 100).toFixed(2) + '%'
    }
    if (row.n_overdue_rate_m3) {
      row.n_overdue_rate_m3 = (row.n_overdue_rate_m3 * 100).toFixed(2) + '%'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.刷新时间) {
      row.刷新时间 = moment(row.刷新时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.当前借款总数量) {
      row.当前借款总数量 = formatInt(row.当前借款总数量)
    }
    if (row['当前借款总额(元)']) {
      row['当前借款总额(元)'] = formatCurrency(row['当前借款总额(元)'])
    }
    if (row.已经还款总数量) {
      row.已经还款总数量 = formatInt(row.已经还款总数量)
    }
    if (row['已经还款总额(元)']) {
      row['已经还款总额(元)'] = formatCurrency(row['已经还款总额(元)'])
    }
    if (row.逾期中数量) {
      row.逾期中数量 = formatInt(row.逾期中数量)
    }
    if (row['逾期中总额(元)']) {
      row['逾期中总额(元)'] = formatCurrency(row['逾期中总额(元)'])
    }
    if (row['逾期十天及以上总金额(元)']) {
      row['逾期十天及以上总金额(元)'] = formatCurrency(row['逾期十天及以上总金额(元)'])
    }
    if (row['逾期十天及以上14天金额(元)']) {
      row['逾期十天及以上14天金额(元)'] = formatCurrency(row['逾期十天及以上14天金额(元)'])
    }
    if (row['逾期十天及以上21天分期金额(元)']) {
      row['逾期十天及以上21天分期金额(元)'] = formatCurrency(row['逾期十天及以上21天分期金额(元)'])
    }

    if (row['S1级逾期率(按金额)']) {
      row['S1级逾期率(按金额)'] = (row['S1级逾期率(按金额)'] * 100).toFixed(2) + '%'
    }
    if (row['S2级逾期率(按金额)']) {
      row['S2级逾期率(按金额)'] = (row['S2级逾期率(按金额)'] * 100).toFixed(2) + '%'
    }
    if (row['S3级逾期率(按金额)']) {
      row['S3级逾期率(按金额)'] = (row['S3级逾期率(按金额)'] * 100).toFixed(2) + '%'
    }
    if (row['M3级逾期率(按金额)']) {
      row['M3级逾期率(按金额)'] = (row['M3级逾期率(按金额)'] * 100).toFixed(2) + '%'
    }
    if (row['S1级逾期率(按单数)']) {
      row['S1级逾期率(按单数)'] = (row['S1级逾期率(按单数)'] * 100).toFixed(2) + '%'
    }
    if (row['S2级逾期率(按单数)']) {
      row['S2级逾期率(按单数)'] = (row['S2级逾期率(按单数)'] * 100).toFixed(2) + '%'
    }
    if (row['S3级逾期率(按单数)']) {
      row['S3级逾期率(按单数)'] = (row['S3级逾期率(按单数)'] * 100).toFixed(2) + '%'
    }
    if (row['M3级逾期率(按单数)']) {
      row['M3级逾期率(按单数)'] = (row['M3级逾期率(按单数)'] * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack
    func.connPool1(query, [tableName.overdueRepaymentStatistics, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.getCount + queries
    func.connPool1(query, [tableName.overdueRepaymentStatistics], function (err, rs) {
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
    if (global.overdueCount === 0) {
      global.overdueCount++
      pro.exec(shell.overdueRepaymentStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 还款逾期统计shell脚本执行失败')
          res.json({code: '500'})
          global.overdueCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 还款逾期统计shell脚本执行成功')
          res.json({code: '200'})
          global.overdueCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 还款逾期统计开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.overdueRepaymentStatisticsExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.overdueRepaymentStatistics], function (err, rs) {
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
