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

function formatProperty3 (rs) {
  let result = {}
  result.a = []
  result.b = []
  result.c = []
  if (rs.length > 0) {
    let a = []
    let b = []
    let c = []
    let keys = Object.keys(rs[0])
    rs.map(r => {
      a.push(r[keys[0]])
      b.push(r[keys[1]])
      c.push(r[keys[2]])
    })
    result.a = a
    result.b = b
    result.c = c
  }
  return result
}

function formatPropertyMore (rs) {
  let result = {}
  result.a = []
  result.b = []
  result.c = []
  result.d = []
  result.e = []
  if (rs.length > 0) {
    let a = []
    let b = []
    let c = []
    let d = []
    let e = []
    let keys = Object.keys(rs[0])
    rs.map(r => {
      a.push(r[keys[0]])
      b.push(r[keys[1]])
      c.push(r[keys[2]])
      d.push(r[keys[3]])
      e.push(r[keys[4]])
    })
    result.a = a
    result.b = b
    result.c = c
    result.d = d
    result.e = e
  }
  return result
}

function getRecentday (n) {
  let seperator = '-'
  let day = new Date()
  day.setTime(day.getTime() - n * 24 * 60 * 60 * 1000)
  let month = day.getMonth() + 1
  let strDate = day.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return day.getFullYear() + seperator + month + seperator + strDate
}

function formatData (rows) {
  return rows.map(row => {
    if (row.dregister_num) {
      row.dregister_num = formatInt(row.dregister_num)
    }
    if (row.dactive_num) {
      row.dactive_num = formatInt(row.dactive_num)
    }
    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.drecharge_amt) {
      row.drecharge_amt = formatCurrency(row.drecharge_amt)
    }
    if (row.dfrecharge_amt) {
      row.dfrecharge_amt = formatCurrency(row.dfrecharge_amt)
    }
    if (row.dcoin1_consumption) {
      row.dcoin1_consumption = formatCurrency(row.dcoin1_consumption)
    }
    if (row.dprofit) {
      row.dprofit = formatCurrency(row.dprofit)
    }
    if (row.dreal_order7_num) {
      row.dreal_order7_num = formatInt(row.dreal_order7_num)
    }
    if (row.dreal_order_num) {
      row.dreal_order_num = formatInt(row.dreal_order_num)
    }
    if (row.dreal_order7_amt) {
      row.dreal_order7_amt = formatCurrency(row.dreal_order7_amt)
    }
    if (row.dreal_order_amt) {
      row.dreal_order_amt = formatCurrency(row.dreal_order_amt)
    }
    return row
  })
}

module.exports = {
  dailyNewUser (req, res) {
    let params = req.body
    let num = parseInt(params.start)
    let startTime = getRecentday(num)
    let query = sql.auction.operate.operateView.dailyNewUser + sql.auction.operate.operateView.orderBy
    func.connPool1(query, [tableName.operateView, startTime], function (err, rs) {
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
  incomeDetail (req, res) {
    let params = req.body
    let query
    if (params.dType === '日') {
      query = sql.auction.operate.operateView.incomeDetail + sql.auction.operate.operateView.orderBy
    } else if (params.dType === '周') {
      query = sql.auction.operate.operateView.incomeDetailByWeek + sql.auction.operate.operateView.orderByWeek
    } else if (params.dType === '月') {
      query = sql.auction.operate.operateView.incomeDetailByMonth + sql.auction.operate.operateView.orderByMonth
    }
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
      rs = formatPropertyMore(rs)
      res.json(rs)
    })
  },
  activeUser (req, res) {
    let params = req.body
    let query
    if (params.dType === '日') {
      query = sql.auction.operate.operateView.activeUser + sql.auction.operate.operateView.orderBy
    } else if (params.dType === '周') {
      query = sql.auction.operate.operateView.activeUserByWeek + sql.auction.operate.operateView.orderByWeek
    } else if (params.dType === '月') {
      query = sql.auction.operate.operateView.activeUserByMonth + sql.auction.operate.operateView.orderByMonth
    }
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
  coin1CancellationDeposit (req, res) {
    let params = req.body
    let query = sql.auction.operate.operateView.coin1CancellationDeposit + sql.auction.operate.operateView.orderBy
    func.connPool1(query, [tableName.coin1CancellationDeposit, params.startTime], function (err, rs) {
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
      rs = formatProperty3(rs)
      res.json(rs)
    })
  },
  fetchAll (req, res) {
    func.connPool1(sql.auction.operate.operateView.selectAll, [tableName.operateView], function (err, rs) {
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
