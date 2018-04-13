let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt} = require('../../../../utils/utils')

function formatProperty (rs) {
  let result = {}
  result.a = []
  result.b = []
  if (rs.length > 0) {
    let a = []
    let b = []
    let keys = Object.keys(rs[0])
    rs.map(r => {
      a.push(r[keys[0]])
      b.push(r[keys[1]])
    })
    result.a = a
    result.b = b
  }
  return result
}

function formatProperty4 (rs) {
  let result = {}
  result.a = []
  result.b = []
  result.c = []
  result.d = []
  if (rs.length > 0) {
    let a = []
    let b = []
    let c = []
    let d = []
    let keys = Object.keys(rs[0])
    rs.map(r => {
      a.push(r[keys[0]])
      b.push(r[keys[1]])
      c.push(r[keys[2]])
      d.push(r[keys[3]])
    })
    result.a = a
    result.b = b
    result.c = c
    result.d = d
  }
  return result
}

function formatData (rows) {
  return rows.map(row => {
    if (row.recharge_amt) {
      row.recharge_amt = formatCurrency(row.recharge_amt)
    }
    if (row.coin_consumption) {
      row.coin_consumption = formatCurrency(row.coin_consumption)
    }
    if (row.order_amt) {
      row.order_amt = formatCurrency(row.order_amt)
    }
    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.recharge_num) {
      row.recharge_num = formatInt(row.recharge_num)
    }
    if (row.drecharge_num) {
      row.drecharge_num = formatInt(row.drecharge_num)
    }
    return row
  })
}

module.exports = {
  activeUserTrends (req, res) {
    let query = sql.auction.operate.operatingSituation.activeUserTrends + sql.auction.operate.operateView.orderBy
    func.connPool1(query, [tableName.operateView], function (err, rs) {
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
      rs = formatProperty(rs)
      res.json(rs)
    })
  },
  newRegisteredUser (req, res) {
    let query = sql.auction.operate.operatingSituation.newRegisteredUser + sql.auction.operate.operateView.orderBy
    func.connPool1(query, [tableName.operateView], function (err, rs) {
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
      rs = formatProperty(rs)
      res.json(rs)
    })
  },
  rechargeConsumption (req, res) {
    let query = sql.auction.operate.operatingSituation.rechargeConsumption + sql.auction.operate.operateView.orderBy
    func.connPool1(query, [tableName.operateView], function (err, rs) {
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
      rs = formatProperty4(rs)
      res.json(rs)
    })
  },
  fetchAll (req, res) {
    func.connPool1(sql.auction.operate.operatingSituation.selectAll, [tableName.operateView], function (err, rs) {
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
  conversionFunnel (req, res) {
    let query = sql.auction.operate.operatingSituation.conversionFunnel
    func.connPool1(query, [tableName.operateView], function (err, rs) {
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
      rs = formatProperty4(rs)
      res.json(rs)
    })
  }
}
