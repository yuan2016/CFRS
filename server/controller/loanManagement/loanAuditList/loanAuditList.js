/**
 * Created by Administrator on 2017/7/12.
 */
let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, formatCurrency, formatInt} = require('../../../utils/utils')

function formatData (rows) {
  return rows.map(row => {
    if (row.order_time) {
      row.order_time = moment(row.order_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.loan_time) {
      row.loan_time = moment(row.loan_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.loan_end_time) {
      row.loan_end_time = moment(row.loan_end_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.updated_at) {
      row.updated_at = moment(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.money_amount) {
      row.money_amount = formatCurrency(row.money_amount / 100)
    }
    if (row.into_money) {
      row.into_money = formatCurrency(row.into_money / 100)
    }
    if (row.loan_interests) {
      row.loan_interests = formatCurrency(row.loan_interests / 100)
    }
    if (row.apr) {
      row.apr = formatCurrency(row.apr)
    }
    if (row.loan_term) {
      row.loan_term = formatInt(row.loan_term)
    }
    row.child_type = '现金快贷'
    return row
  })
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'loan_time', 'a')
    let order = params.order || ''
    let query = sql.loanManagement.loanAuditList.selectAllFront + queries +  order + sql.loanManagement.loanAuditList.selectAllBack
    func.connPool2(query, [tableName.loanAuditList, params.offset, params.limit], function (err, rs) {
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
  //用户通讯录总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'loan_time', 'a')
    let query = sql.loanManagement.loanAuditList.getCount + queries
    func.connPool2(query, [tableName.loanAuditList], function (err, rs) {
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
  }
}
/**
 * Created by Administrator on 2017/7/10.
 */

