/**
 * Created by Administrator on 2017/7/12.
 */
let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {formatCurrency, formatInt, mosaic, analysis} = require('../../../utils/utils')

function formatData (rows) {
  return rows.map(row => {
    if (row.order_time) {
      row.order_time = moment(row.order_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.loan_time) {
      row.loan_time = moment(row.loan_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.updated_at) {
      row.updated_at = moment(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.money_amount) {
      row.money_amount = formatCurrency(row.money_amount)
    }
    if (row.into_money) {
      row.into_money = formatCurrency(row.into_money)
    }
    if (row.loan_interests) {
      row.loan_interests = formatCurrency(row.loan_interests)
    }
    if (row.sjloan_urgent_fee) {
      row.sjloan_urgent_fee = formatCurrency(row.sjloan_urgent_fee)
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

function handleQuery (params) {
  let queries = []
  for (let param in params) {
    let query
    if (params[param] === '') {
      query = '(t.' + param + ' IS NULL OR t.' + param + ' LIKE "%%")'
    } else {
      query = 't.' + param + '="' + params[param] + '"'
    }
    queries.push(query)
  }
  return queries
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 't.loan_time', 'w', 't')
    /*let add = mosaic(params, 'customer_type__S', 't', '0')
    if (queries) {
      add = ' and ' + add
    } else {
      add = ' where ' + add
    }*/
    let order = params.order || ''
    let query = sql.loanManagement.reconciliationFunction.selectAllFront + queries + order + sql.loanManagement.reconciliationFunction.selectAllBack
    
    func.connPool2(query, [tableName.reconciliationFunction.t1, tableName.reconciliationFunction.t, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 't.loan_time', 'w', 't')
   /* let add = mosaic(params, 'customer_type__S', 't', '0')
    if (queries) {
      add = ' and ' + add
    } else {
      add = ' where ' + add
    }*/
    let query = sql.loanManagement.reconciliationFunction.getCount + queries
    func.connPool2(query, [tableName.reconciliationFunction.t1, tableName.reconciliationFunction.t], function (err, rs) {
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

