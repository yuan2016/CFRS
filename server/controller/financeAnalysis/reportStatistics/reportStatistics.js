let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {formatCurrency, mosaicName, analysis} = require('../../../utils/utils')
let {exportJsonToExcel} = require('../../../utils/excel')
let path = require('path')
let fs = require('fs')

const tHeader = ['日期', '基础服务费(元)', '加急费(元)', '正常本金(元)', ' 逾期本金(元)', '利息(元)', '分期费(元)', '续期服务费(元)', '续期手续费(元)', '逾期滞纳金(元)', '催收减免金额(元)', '合计(元)']
const filterVal = ['d_date', 'service_charge', 'loan_urgent_fee', 'repaymented_amount', 'Overdue_amount', 'loan_accrual', 'stages_fee', 'renewal_service_fee', 'renewal_fee', 'Overdue_fine', 'reduction_amount', 'sum_amount']

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
//基础服务费
    if (row.service_charge) {
      row.service_charge = formatCurrency(row.service_charge)
    }
    if (row.loan_urgent_fee) {
      row.loan_urgent_fee = formatCurrency(row.loan_urgent_fee)
    }
    if (row.repaymented_amount) {
      row.repaymented_amount = formatCurrency(row.repaymented_amount)
    }
    if (row.Overdue_amount) {
      row.Overdue_amount = formatCurrency(row.Overdue_amount)
    }
    if (row.loan_accrual) {
      row.loan_accrual = formatCurrency(row.loan_accrual)
    }
    if (row.stages_fee) {
      row.stages_fee = formatCurrency(row.stages_fee)
    }
    if (row.renewal_service_fee) {
      row.renewal_service_fee = formatCurrency(row.renewal_service_fee)
    }
    if (row.renewal_fee) {
      row.renewal_fee = formatCurrency(row.renewal_fee)
    }
    if (row.Overdue_fine) {
      row.Overdue_fine = formatCurrency(row.Overdue_fine)
    }
    if (row.reduction_amount) {
      row.reduction_amount = formatCurrency(row.reduction_amount)
    }
    if (row.sum_amount) {
      row.sum_amount = formatCurrency(row.sum_amount)
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.financeAnalysis.reportStatistics.orderBy
    let query = sql.financeAnalysis.reportStatistics.selectAllFront + queries + order + sql.financeAnalysis.reportStatistics.selectAllBack
    func.connPool1(query, [tableName.reportStatistics, params.offset, params.limit], function (err, rs) {
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
    let query = sql.financeAnalysis.reportStatistics.getCount + queries
    func.connPool1(query, [tableName.reportStatistics], function (err, rs) {
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
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.financeAnalysis.reportStatistics.selectAllFront + queries + sql.financeAnalysis.reportStatistics.orderBy
    func.connPool1(query, [tableName.reportStatistics], function (err, rs) {
      if (err) {
        res.sendFile(path.join(process.cwd(), 'error.html'))
        return
      }
      rs = formatData(rs)
      const data = formatJson(filterVal, rs)

      let fileName = mosaicName()
      exportJsonToExcel(tHeader, data, fileName)
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
