let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let {exportJsonToExcel} = require('../../../../utils/excel')

global.fundProductCount = 0

const tHeader = [['', '14天', '21天', '90天', '14天', '21天', '90天', '14天', '21天', '90天', '', '', '', '14天', '21天', '90天', '14天', '21天', '90天', '14天', '21天', '90天', '14天', '21天', '90天', '14天', '21天', '90天', '14天', '21天', '90天', '14天', '21天', '90天', '14天', '21天', '90天', ''], ['日期', '当日应还总额(元)', '实际还款金额(元)', '还款比例', '续期金额-14天(元)', '续期手续费收入-14天(元)', '续期比例-14天', '逾期金额(元)', '逾期比例', '逾期还款金额(元)', '滞纳金收入(元)', '综合服务费收入(元)', '实收服务费(元)', '同等金额收益(元)', '当日资金盈余(元)', '更新时间']]
const filterVal = ['D_DATE', 'TOTAL_AMOUNT_14', 'TOTAL_AMOUNT_21F', 'TOTAL_AMOUNT_90F', 'ACTUAL_REPAYMENT_AMOUNT_14', 'ACTUAL_REPAYMENT_AMOUNT_21F', 'ACTUAL_REPAYMENT_AMOUNT_90F', 'REPAYMENT_RATIO_14', 'REPAYMENT_RATIO_21F', 'REPAYMENT_RATIO_90F', 'RENEWAL_AMOUNT_14', 'RENEWAL_COMMISSION_14', 'RENEWAL_RATIO_14', 'OVERDUE_AMOUNT_14', 'OVERDUE_AMOUNT_21F', 'OVERDUE_AMOUNT_90F', 'OVERDUE_PROPORTION_14', 'OVERDUE_PROPORTION_21F', 'OVERDUE_PROPORTION_90F', 'OVERDUE_PAYMENT_AMOUNT_14', 'OVERDUE_PAYMENT_AMOUNT_21F', 'OVERDUE_PAYMENT_AMOUNT_90F', 'LATE_FEES_INCOME_14', 'LATE_FEES_INCOME_21F', 'LATE_FEES_INCOME_90F', 'COMP_SERVICE_INCOME_14', 'COMP_SERVICE_INCOME_21F', 'COMP_SERVICE_INCOME_90F', 'SERVICE_CHARGE_14', 'SERVICE_CHARGE_21F', 'SERVICE_CHARGE_90F', 'EQUAL_AMOUNT_INCOME_14', 'EQUAL_AMOUNT_INCOME_21F','EQUAL_AMOUNT_INCOME_90F','CAPITAL_SURPLUS_14','CAPITAL_SURPLUS_21F','CAPITAL_SURPLUS_90F','UPDATE_TIME']
const merge = [[0, 0, 0, 1], [1, 0, 3, 0], [4, 0, 6, 0], [7, 0, 9, 0], [10, 0, 10, 1], [11, 0, 11, 1], [12, 0, 12, 1], [13, 0, 15, 0], [16, 0, 18, 0],[19, 0, 21, 0],[22, 0, 24, 0],[25, 0, 27, 0],[28, 0, 30, 0],[31, 0, 33, 0],[34, 0, 36, 0],[37, 0, 37, 1]]
const change = [['A1', '  日期'], ['B1', '     当日应还总额(元)'],['E1', '     实际还款金额(元)'],['H1', '      还款比例'], ['K1', '续期金额-14天(元)'], ['L1', '续期手续费收入-14天(元)'], ['M1', '续期比例-14天'], ['N1', '     逾期金额(元)'], ['Q1', '      逾期比例'], ['T1', '     逾期还款金额(元)'], ['W1', '     滞纳金收入(元)'], ['Z1', '     综合服务费收入(元)'], ['AC1', '     实收服务费(元)'], ['AF1', '     同等金额收益(元)'], ['AI1', '     当日资金盈余(元)'], ['AL1', '更新时间']]

function changeItem (a) {
  if (a) {
    if (typeof a === 'number') {
      return a
    }
    return parseFloat(a.split(',').join(''))
  }
  return a
}

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData (rows) {
  return rows.map(row => {
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD')
    }
    if (row.REPAYMENT_RATIO_14) {
      row.REPAYMENT_RATIO_14 = (row.REPAYMENT_RATIO_14 * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATIO_21F) {
      row.REPAYMENT_RATIO_21F = (row.REPAYMENT_RATIO_21F * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATIO_90F) {
      row.REPAYMENT_RATIO_90F = (row.REPAYMENT_RATIO_90F * 100).toFixed(2) + '%'
    }
    if (row.RENEWAL_RATIO_14) {
      row.RENEWAL_RATIO_14 = (row.RENEWAL_RATIO_14 * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_PROPORTION_14) {
      row.OVERDUE_PROPORTION_14 = (row.OVERDUE_PROPORTION_14 * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_PROPORTION_21F) {
      row.OVERDUE_PROPORTION_21F = (row.OVERDUE_PROPORTION_21F * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_PROPORTION_90F) {
      row.OVERDUE_PROPORTION_90F = (row.OVERDUE_PROPORTION_90F * 100).toFixed(2) + '%'
    }

    if (row.TOTAL_AMOUNT_14) {
      row.TOTAL_AMOUNT_14 = formatCurrency(row.TOTAL_AMOUNT_14)
    }
    if (row.TOTAL_AMOUNT_21F) {
      row.TOTAL_AMOUNT_21F = formatCurrency(row.TOTAL_AMOUNT_21F)
    }
    if (row.TOTAL_AMOUNT_90F) {
      row.TOTAL_AMOUNT_90F = formatCurrency(row.TOTAL_AMOUNT_90F)
    }
    if (row.ACTUAL_REPAYMENT_AMOUNT_14) {
      row.ACTUAL_REPAYMENT_AMOUNT_14 = formatCurrency(row.ACTUAL_REPAYMENT_AMOUNT_14)
    }
    if (row.ACTUAL_REPAYMENT_AMOUNT_21F) {
      row.ACTUAL_REPAYMENT_AMOUNT_21F = formatCurrency(row.ACTUAL_REPAYMENT_AMOUNT_21F)
    }
    if (row.ACTUAL_REPAYMENT_AMOUNT_90F) {
      row.ACTUAL_REPAYMENT_AMOUNT_90F = formatCurrency(row.ACTUAL_REPAYMENT_AMOUNT_90F)
    }
    if (row.RENEWAL_AMOUNT_14) {
      row.RENEWAL_AMOUNT_14 = formatCurrency(row.RENEWAL_AMOUNT_14)
    }
    if (row.RENEWAL_COMMISSION_14) {
      row.RENEWAL_COMMISSION_14 = formatCurrency(row.RENEWAL_COMMISSION_14)
    }
    if (row.OVERDUE_AMOUNT_14) {
      row.OVERDUE_AMOUNT_14 = formatCurrency(row.OVERDUE_AMOUNT_14)
    }
    if (row.OVERDUE_AMOUNT_21F) {
      row.OVERDUE_AMOUNT_21F = formatCurrency(row.OVERDUE_AMOUNT_21F)
    }
    if (row.OVERDUE_AMOUNT_90F) {
      row.OVERDUE_AMOUNT_90F = formatCurrency(row.OVERDUE_AMOUNT_90F)
    }
    if (row.OVERDUE_PAYMENT_AMOUNT_14) {
      row.OVERDUE_PAYMENT_AMOUNT_14 = formatCurrency(row.OVERDUE_PAYMENT_AMOUNT_14)
    }
    if (row.OVERDUE_PAYMENT_AMOUNT_21F) {
      row.OVERDUE_PAYMENT_AMOUNT_21F = formatCurrency(row.OVERDUE_PAYMENT_AMOUNT_21F)
    }
    if (row.OVERDUE_PAYMENT_AMOUNT_90F) {
      row.OVERDUE_PAYMENT_AMOUNT_90F = formatCurrency(row.OVERDUE_PAYMENT_AMOUNT_90F)
    }
    if (row.LATE_FEES_INCOME_14) {
      row.LATE_FEES_INCOME_14 = formatCurrency(row.LATE_FEES_INCOME_14)
    }
    if (row.LATE_FEES_INCOME_21F) {
      row.LATE_FEES_INCOME_21F = formatCurrency(row.LATE_FEES_INCOME_21F)
    }
    if (row.LATE_FEES_INCOME_90F) {
      row.LATE_FEES_INCOME_90F = formatCurrency(row.LATE_FEES_INCOME_90F)
    }
    if (row.COMP_SERVICE_INCOME_14) {
      row.COMP_SERVICE_INCOME_14 = formatCurrency(row.COMP_SERVICE_INCOME_14)
    }
    if (row.COMP_SERVICE_INCOME_21F) {
      row.COMP_SERVICE_INCOME_21F = formatCurrency(row.COMP_SERVICE_INCOME_21F)
    }
    if (row.COMP_SERVICE_INCOME_90F) {
      row.COMP_SERVICE_INCOME_90F = formatCurrency(row.COMP_SERVICE_INCOME_90F)
    }
    if (row.SERVICE_CHARGE_14) {
      row.SERVICE_CHARGE_14 = formatCurrency(row.SERVICE_CHARGE_14)
    }
    if (row.SERVICE_CHARGE_21F) {
      row.SERVICE_CHARGE_21F = formatCurrency(row.SERVICE_CHARGE_21F)
    }

    if (row.SERVICE_CHARGE_90F) {
      row.SERVICE_CHARGE_90F = formatCurrency(row.SERVICE_CHARGE_90F)
    }
    if (row.EQUAL_AMOUNT_INCOME_14) {
      row.EQUAL_AMOUNT_INCOME_14 = formatCurrency(row.EQUAL_AMOUNT_INCOME_14)
    }
    if (row.EQUAL_AMOUNT_INCOME_21F) {
      row.EQUAL_AMOUNT_INCOME_21F = formatCurrency(row.EQUAL_AMOUNT_INCOME_21F)
    }
    if (row.EQUAL_AMOUNT_INCOME_90F) {
      row.EQUAL_AMOUNT_INCOME_90F = formatCurrency(row.EQUAL_AMOUNT_INCOME_90F)
    }
    if (row.CAPITAL_SURPLUS_14) {
      row.CAPITAL_SURPLUS_14 = formatCurrency(row.CAPITAL_SURPLUS_14)
    }
    if (row.CAPITAL_SURPLUS_21F) {
      row.CAPITAL_SURPLUS_21F = formatCurrency(row.CAPITAL_SURPLUS_21F)
    }
    if (row.CAPITAL_SURPLUS_90F) {
      row.CAPITAL_SURPLUS_90F = formatCurrency(row.CAPITAL_SURPLUS_90F)
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
    func.connPool1(query, [tableName.fundAnalysisProduct, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.fundAnalysisProduct], function (err, rs) {
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
    if (global.fundProductCount === 0) {
      global.fundProductCount++
      pro.exec(shell.fundAnalysisProduct, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 资金分析(分产品)shell脚本执行失败')
          res.json({code: '500'})
          global.fundProductCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 资金分析(分产品)shell脚本执行成功')
          res.json({code: '200'})
          global.fundProductCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 资金分析(分产品)开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.selectAll + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.fundAnalysisProduct], function (err, rs) {
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
          return
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
