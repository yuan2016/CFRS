let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt} = require('../../../../utils/utils')

function formatData (rows) {
  return rows.map(row => {
    if (row.user_cot) {
      row.user_cot = formatInt(row.user_cot)
    }
    if (row.loan_cot_avg) {
      row.loan_cot_avg = formatCurrency(row.loan_cot_avg)
    }
    if (row.loan_cot_savg) {
      row.loan_cot_savg = formatCurrency(row.loan_cot_savg)
    }
    if (row.loan_amt_savg) {
      row.loan_amt_savg = formatCurrency(row.loan_amt_savg)
    }
    if (row.time_avg) {
      row.time_avg = formatCurrency(row.time_avg)
    }
    if (row.xq_avg) {
      row.xq_avg = formatCurrency(row.xq_avg)
    }
    if (row.loan_day14_acot) {
      row.loan_day14_acot = formatCurrency(row.loan_day14_acot)
    }
    if (row.loan_stg21_acot) {
      row.loan_stg21_acot = formatCurrency(row.loan_stg21_acot)
    }
    if (row.loan_stg90_acot) {
      if (row.loan_stg90_acot < 0.01) {
        row.loan_stg90_acot = '< 0.01'
      } else {
        row.loan_stg90_acot = formatCurrency(row.loan_stg90_acot)
      }
    }

    if (row.tgl_snew) {
      row.tgl_snew = row.tgl_snew.toFixed(2) + '%'
    }
    if (row.tgl_sold) {
      row.tgl_sold = row.tgl_sold.toFixed(2) + '%'
    }
    if (row.yql_avg_old) {
      row.yql_avg_old = row.yql_avg_old.toFixed(2) + '%'
    }
    if (row.yql_avg_new) {
      row.yql_avg_new = row.yql_avg_new.toFixed(2) + '%'
    }
    if (row.hk1_avg_old) {
      row.hk1_avg_old = row.hk1_avg_old.toFixed(2) + '%'
    }
    if (row.hk1_avg_new) {
      row.hk1_avg_new = row.hk1_avg_new.toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  //借款通过率数据
  fetchAll (req, res) {
    let params = req.body
    let order = params.order || sql.RMAB.userBasePortrait.order
    let query = sql.RMAB.userBasePortrait.selectAll + order + sql.RMAB.userBasePortrait.limit
    func.connPool1(query, [tableName.userBasePortrait, params.offset, params.limit], function (err, rs) {
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
      res.json(formatData(rs))
    })
  },
  //借款通过率总条数
  getCount (req, res) {
    func.connPool1(sql.RMAB.userBasePortrait.getCount, tableName.userBasePortrait, function (err, rs) {
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
