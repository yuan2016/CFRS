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
    if (row.return_time) {
      row.return_time = moment(row.return_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_return_money) {
      row.repayment_return_money = formatCurrency(row.repayment_return_money)
    }
    return row
  })
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 't.return_time', 'w')
    let add = mosaic(params, 'user_phone', 't1')
    if (queries) {
      add = ' and ' + add
    } else {
      add = ' where ' + add
    }
    let order = params.order || ''
    let query = sql.repaymentManagement.rebackedList.selectAllFront + queries + add + order + sql.repaymentManagement.rebackedList.selectAllBack

    func.connPool2(query, [tableName.rebackedList.t, tableName.rebackedList.t1, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 't.return_time', 'w')
    let add = mosaic(params, 'user_phone', 't1')
    if (queries) {
      add = ' and ' + add
    } else {
      add = ' where ' + add
    }
    let query = sql.repaymentManagement.rebackedList.getCount + queries + add
    func.connPool2(query, [tableName.rebackedList.t, tableName.rebackedList.t1], function (err, rs) {
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

