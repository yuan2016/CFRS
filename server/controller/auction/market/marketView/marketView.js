let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt} = require('../../../../utils/utils')

function formatPropertyArr (rs) {
  let result = {}
  result.a = []
  result.b = []
  if (rs.length > 0) {
    let a = []
    let b = []
    let keys = Object.keys(rs[0])
    rs.map(r => {
      // r[keys[0]] = r[keys[0]].trim() || '未知'
      a.push({name: r[keys[0]], value: (r[keys[1]] * 100).toFixed(2)})
      b.push(r[keys[0]])
    })
    result.a = a
    result.b = b
  }
  return result
}

function formatPropertyArrF (rs) {
  let result = {}
  result.a = []
  result.b = []
  if (rs.length > 0) {
    let a = []
    let b = []
    let keys = Object.keys(rs[0])
    rs.map(r => {
      // r[keys[0]] = r[keys[0]].trim() || '未知'
      a.push({name: r[keys[0]], value: r[keys[1]]})
      b.push(r[keys[0]])
    })
    result.a = a
    result.b = b
  }
  return result
}

function formatData (rows) {
  return rows.map(row => {
    if (row.regist_num_hb) {
      row.regist_num_hb = (row.regist_num_hb * 100).toFixed(2) + '%'
    }
    if (row.nuser_num_hb) {
      row.nuser_num_hb = (row.nuser_num_hb * 100).toFixed(2) + '%'
    }
    if (row.nuser_amt_hb) {
      row.nuser_amt_hb = (row.nuser_amt_hb * 100).toFixed(2) + '%'
    }
    if (row.user_num_hb) {
      row.user_num_hb = (row.user_num_hb * 100).toFixed(2) + '%'
    }
    if (row.user_amt_hb) {
      row.user_amt_hb = (row.user_amt_hb * 100).toFixed(2) + '%'
    }
    if (row.user_num_lj) {
      row.user_num_lj = formatInt(row.user_num_lj)
    }
    if (row.user_amt_lj) {
      row.user_amt_lj = formatCurrency(row.user_amt_lj)
    }
    return row
  })
}

module.exports = {
  userAreaRatio (req, res) {
    let query = sql.auction.market.marketView.userAreaRatio
    func.connPool1(query, [tableName.marketView.userAreaRatio], function (err, rs) {
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
      rs = formatPropertyArr(rs)
      res.json(rs)
    })
  },
  userAreaRecharge (req, res) {
    let query = sql.auction.market.marketView.userAreaRecharge
    func.connPool1(query, [tableName.marketView.userAreaRecharge], function (err, rs) {
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
      rs = formatPropertyArrF(rs)
      res.json(rs)
    })
  },
  fetchAll (req, res) {
    let query = sql.auction.market.marketView.selectAll
    func.connPool1(query, [tableName.marketView.marketView], function (err, rs) {
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
  }
}
