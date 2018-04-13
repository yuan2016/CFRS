/**
 * Created by Administrator on 2017/7/12.
 */
let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {analysis, mosaic, formatCurrency} = require('../../../../utils/utils')

function formatData (rows) {
  return rows.map(row => {
    if (row.credit_repayment_time) {
      row.credit_repayment_time = moment(row.credit_repayment_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_time) {
      row.repayment_time = moment(row.repayment_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_real_time) {
      row.repayment_real_time = moment(row.repayment_real_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.order_time) {
      row.order_time = moment(row.order_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_principal) {
      row.repayment_principal = formatCurrency(row.repayment_principal)
    }
    if (row.repayment_interest) {
      row.repayment_interest = formatCurrency(row.repayment_interest)
    }
    if (row.repayment_amount) {
      row.repayment_amount = formatCurrency(row.repayment_amount)
    }
    if (row.repaymented_amount) {
      row.repaymented_amount = formatCurrency(row.repaymented_amount)
    }
    if (row.true_repayment_money) {
      row.true_repayment_money = formatCurrency(row.true_repayment_money)
    }
    return row
  })
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 't1.order_time', 'a')
    let add = mosaic(params, 'user_phone', 't2')
    add = ' and ' + add
    let add1 = mosaic(params, 'repayment_type', 't1')
    add1 = ' and ' + add1
    let order = params.order || ''
    let query = sql.repaymentManagement.repaymentDetails.selectAllFront + queries + add + add1 + order + sql.repaymentManagement.repaymentDetails.selectAllBack

    func.connPool2(query, [tableName.repaymentDetails.t, tableName.repaymentDetails.t1, tableName.repaymentDetails.t2, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 't1.order_time', 'w')
    let add = mosaic(params, 'user_phone', 't2')
    if (!queries) {
      add = ' where ' + add
    } else {
      add = ' and ' + add
    }
    let add1 = mosaic(params, 'repayment_type', 't1')
    add1 = ' and ' + add1
    let query = sql.repaymentManagement.repaymentDetails.getCount + queries + add + add1

    func.connPool2(query, [tableName.repaymentDetails.t, tableName.repaymentDetails.t1, tableName.repaymentDetails.t2], function (err, rs) {
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

