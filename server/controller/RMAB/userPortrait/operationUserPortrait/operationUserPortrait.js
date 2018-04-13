let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let tableName = require('../../../../config/tableName')
let {formatInt} = require('../../../../utils/utils')

function formatData (rows) {
  return rows.map(row => {
    if (row.zcl) {
      row.zcl = formatInt(row.zcl)
    }

    if (row.zcl_zb) {
      row.zcl_zb = (row.zcl_zb * 100).toFixed(2) + '%'
    }
    if (row.yxzcl) {
      row.yxzcl = (row.yxzcl * 100).toFixed(2) + '%'
    }
    if (row.qysrz) {
      row.qysrz = (row.qysrz * 100).toFixed(2) + '%'
    }
    if (row.hmd) {
      row.hmd = (row.hmd * 100).toFixed(2) + '%'
    }
    if (row.jjs) {
      row.jjs = (row.jjs * 100).toFixed(2) + '%'
    }
    if (row.loan) {
      row.loan = (row.loan * 100).toFixed(2) + '%'
    }
    if (row.new_loan) {
      row.new_loan = (row.new_loan * 100).toFixed(2) + '%'
    }
    if (row.old_loan) {
      row.old_loan = (row.old_loan * 100).toFixed(2) + '%'
    }
    if (row.loan_suss) {
      row.loan_suss = (row.loan_suss * 100).toFixed(2) + '%'
    }
    if (row.new_loan_suss) {
      row.new_loan_suss = (row.new_loan_suss * 100).toFixed(2) + '%'
    }
    if (row.old_loan_suss) {
      row.old_loan_suss = (row.old_loan_suss * 100).toFixed(2) + '%'
    }
    if (row.zdq) {
      row.zdq = (row.zdq * 100).toFixed(2) + '%'
    }
    if (row.new_zdq) {
      row.new_zdq = (row.new_zdq * 100).toFixed(2) + '%'
    }
    if (row.old_zdq) {
      row.old_zdq = (row.old_zdq * 100).toFixed(2) + '%'
    }
    if (row.dq) {
      row.dq = (row.dq * 100).toFixed(2) + '%'
    }
    if (row.new_dq) {
      row.new_dq = (row.new_dq * 100).toFixed(2) + '%'
    }
    if (row.old_dq) {
      row.old_dq = (row.old_dq * 100).toFixed(2) + '%'
    }
    if (row.yq) {
      row.yq = (row.yq * 100).toFixed(2) + '%'
    }
    if (row.new_yq) {
      row.new_yq = (row.new_yq * 100).toFixed(2) + '%'
    }
    if (row.old_yq) {
      row.old_yq = (row.old_yq * 100).toFixed(2) + '%'
    }
    if (row.syyq) {
      row.syyq = (row.syyq * 100).toFixed(2) + '%'
    }
    if (row.new_syyq) {
      row.new_syyq = (row.new_syyq * 100).toFixed(2) + '%'
    }
    if (row.old_syyq) {
      row.old_syyq = (row.old_syyq * 100).toFixed(2) + '%'
    }
    if (row.loan_day14) {
      row.loan_day14 = (row.loan_day14 * 100).toFixed(2) + '%'
    }
    if (row.loan_stages21) {
      row.loan_stages21 = (row.loan_stages21 * 100).toFixed(2) + '%'
    }

    return row
  })
}

module.exports = {
  //借款通过率数据
  fetchAll (req, res) {
    let params = req.body
    let order = params.order || sql.RMAB.operationUserPortrait.order
    let query = sql.RMAB.operationUserPortrait.select + order + sql.RMAB.operationUserPortrait.limit
    func.connPool1(query, [tableName.operationUserPortrait, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(sql.RMAB.operationUserPortrait.getCount, tableName.operationUserPortrait, function (err, rs) {
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
