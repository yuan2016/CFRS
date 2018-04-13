let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, mosaic, formatCurrency, formatInt} = require('../../../utils/utils')

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
    if (row.credit_lv && (row.credit_lv !== '未知')) {
      row.credit_lv = row.credit_lv + '类'
    }
    if (row.money_amount) {
      row.money_amount = formatCurrency(row.money_amount)
    }
    if (row.apr) {
      row.apr = formatCurrency(row.apr)
    }
    if (row.loan_interests) {
      row.loan_interests = formatCurrency(row.loan_interests)
    }
    if (row.loan_term) {
      row.loan_term = formatInt(row.loan_term)
    }
    row.assets_owned = '招财猫'
    return row
  })
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 't.loan_time', 'w', 't')
 /*   let querySpecial = mosaic(params, 'credit_lv', 't1')
    if (combined === '') {
      querySpecial = ' where ' + querySpecial.slice(4)
    }*/
    let order = params.order || ''
    let query = sql.loanManagement.assetInformation.selectAllFront + queries + order + sql.loanManagement.assetInformation.selectAllBack
    
    func.connPool2(query, [tableName.assetInformation.t, tableName.assetInformation.t1, params.offset, params.limit], function (err, rs) {
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
    let query = sql.loanManagement.assetInformation.getCount + queries
    func.connPool2(query, [tableName.assetInformation.t, tableName.assetInformation.t1], function (err, rs) {
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

