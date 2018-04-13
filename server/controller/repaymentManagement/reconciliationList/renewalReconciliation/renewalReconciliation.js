/**
 * Created by Administrator on 2017/7/12.
 */
let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {analysis, mosaic, formatCurrency, formatInt} = require('../../../../utils/utils')

function formatData (rows) {
  return rows.map(row => {
    if (row.order_time) {
      row.order_time = moment(row.order_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.old_repayment_time) {
      row.old_repayment_time = moment(row.old_repayment_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_time) {
      row.repayment_time = moment(row.repayment_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_amount) {
      row.repayment_amount = formatCurrency(row.repayment_amount)
    }
    if (row.repaymented_amount) {
      row.repaymented_amount = formatCurrency(row.repaymented_amount)
    }
    if (row.repayment_interest) {
      row.repayment_interest = formatCurrency(row.repayment_interest)
    }
    if (row.reback_count) {
      row.reback_count = formatCurrency(row.reback_count)
    }
    if (row.return_money) {
      row.return_money = formatCurrency(row.return_money)
    }
    if (row.renewal_day) {
      row.renewal_day = formatInt(row.renewal_day)
    }
    row.renewal_status = '续期成功'
    row.lending_account = ''
    return row
  })
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 't.order_time', 'a')
    let add = mosaic(params, 'user_phone', 't1')
    add = ' and ' + add
    let order = params.order || ''
    let query = sql.repaymentManagement.renewalReconciliation.selectAllFront + queries + add + order + sql.repaymentManagement.renewalReconciliation.selectAllBack
    func.connPool2(query, [tableName.renewalReconciliation.t, tableName.renewalReconciliation.t1, tableName.renewalReconciliation.t2, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 't.order_time', 'a')
    let add = mosaic(params, 'user_phone', 't1')
    add = ' and ' + add
    let query = sql.repaymentManagement.renewalReconciliation.getCount + queries + add
    func.connPool2(query, [tableName.renewalReconciliation.t, tableName.renewalReconciliation.t1, tableName.renewalReconciliation.t2], function (err, rs) {
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

