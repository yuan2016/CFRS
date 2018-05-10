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

const tHeader = [['', '', '提前还款本金(元)', '提前还款利息(元)', '正常还款本金(元)', '正常还款利息(元)', '逾期还款本金(元)', '逾期还款利息(元)', '逾期滞纳金(元)', '续期费(元)', 'ZB益码通手续费(元)', '合计(元)', 'ZB连连(元)', 'ZB益码通(元)', '差异值(元)', ''], ['日期', '月份', '', '', '', '', '结算分析', '', '三方账户', '', '差异值(元)', '创建时间']]
const filterVal = ['D_DATE', 'd_month', 'ADVANCE_REPAYMENT_AMT', 'ADVANCE_REPAYMENT_INTEREST', 'REPAYMENT_AMT', 'REPAYMENT_INTEREST', 'OVERDUE_REPAYMENT_AMT', 'OVERDUE_REPAYMENT_INTEREST', 'OVERDUE_LATE_FEE', 'RENEWAL_FEE', 'TOTAL_AMT', 'ZB_LL', 'ZB_YMT', 'DIFF_VALUE', 'CREATE_TIME']
//横坐标纵坐标
const merge = [[0, 0, 0, 1], [1, 0, 1, 1], [2, 0, 11, 0], [12, 0, 13, 0], [14, 0, 14, 1], [15, 0, 15, 1]]
const change = [['A1', '    日期'], ['B1', '  月份'], ['C1', '                                                                结算分析'], ['M1', '       三方账户'], ['O1', '  差异值'], ['P1', '  创建时间']]

global.ZBrepaymentDataCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD')
    }
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.d_month) {
      row.d_month = row.d_month + '月'
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
    if (row.TOTAL_AMT) {
      row.TOTAL_AMT = formatCurrency(row.TOTAL_AMT)
    }
    if (row.ZB_LL) {
      row.ZB_LL = formatCurrency(row.ZB_LL)
    }
    if (row.ZB_YMT) {
      row.ZB_YMT = formatCurrency(row.ZB_YMT)
    }
    if (row.DIFF_VALUE) {
      row.DIFF_VALUE = formatCurrency(row.DIFF_VALUE)
    }
    if (row.YIMATONG_FEE) {
      row.YIMATONG_FEE = formatCurrency(row.YIMATONG_FEE)
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.order
    let query = sql.period.ZBrepaymentData.selectSum + queries + ' UNION ALL ' + '(' + sql.period.ZBrepaymentData.selectAll + queries + order + sql.period.ZBrepaymentData.selectAllBack + ')'
    func.connPool1(query, [tableName.period.ZBrepaymentData, tableName.period.ZBrepaymentData, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.getCount + queries
    func.connPool1(query, [tableName.period.ZBrepaymentData], function (err, rs) {
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
    if (global.ZBrepaymentDataCount === 0) {
      global.ZBrepaymentDataCount++
      pro.exec(shell.periodDailyLending, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日放款记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.ZBrepaymentDataCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日放款记录shell脚本执行成功')
          res.json({code: '200'})
          global.ZBrepaymentDataCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日放款记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.ZBrepaymentData.selectSum + queries + ' UNION ALL ' + '(' + sql.period.ZBrepaymentData.selectAll + queries + sql.period.ZBrepaymentData.order + ')'
    func.connPool1(query, [tableName.period.ZBrepaymentData, tableName.period.ZBrepaymentData], function (err, rs) {
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
      const data = formatJson(filterVal, rs)

      let fileName = mosaicName()
      try {
        exportJsonToExcel(tHeader, data, fileName, merge, change)
      } catch (e) {
        console.log(e)
        res.sendFile(path.join(process.cwd(), 'error.html'))
        return
      }

      let currFilePath = path.join(process.cwd(), fileName)
      let options = {
        headers: {
          'Content-Disposition': 'attachment; filename=' + fileName
        }
      }
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
    }, 180000)
  }
}
