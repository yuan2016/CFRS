let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, formatCurrency,formatInt} = require('../../../utils/utils')

function formatData (rows) {
  return rows.map(row => {
    if (row.last_apply_at) {
      row.last_apply_at = moment(row.last_apply_at).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.create_at) {
      row.create_at = moment(row.create_at).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.updated_at) {
      row.updated_at = moment(row.updated_at).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.add_amount) {
      row.add_amount = formatCurrency(row.add_amount)
    }
    if (row.new_amount_max) {
      row.new_amount_max = formatCurrency(row.new_amount_max)
    }
    if (row.repayment_norm_amount) {
      row.repayment_norm_amount = formatCurrency(row.repayment_norm_amount)
    }
    if (row.repayment_succ_amount) {
      row.repayment_succ_amount = formatCurrency(row.repayment_succ_amount)
    }
    if (row.repayment_succ_count) {
      row.repayment_succ_count = formatInt(row.repayment_succ_count)
    }
    if (row.repayment_norm_count) {
      row.repayment_norm_count = formatInt(row.repayment_norm_count)
    }
    return row
  })
}

module.exports = {
  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'w')
    let order = params.order || ''
    let query = sql.loanManagement.raiseQuotaRecord.selectAllFront + queries + order + sql.loanManagement.raiseQuotaRecord.selectAllBack
    func.connPool2(query, [tableName.raiseQuotaRecord, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, null, 'w')
    let query = sql.loanManagement.raiseQuotaRecord.getCount + queries
    func.connPool2(query, tableName.raiseQuotaRecord, function (err, rs) {
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
