let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let tableName = require('../../../config/tableName')
let moment = require('moment')
let {formatInt} = require('../../../utils/utils')

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

function packageRows (rows) {
  let options = [{value: '', label: '不限'}]
  for (let row of rows) {
    let option = {}
    if (row.channel_trader_name && row.channel_trader_name !== '') {
      option.value = row.channel_trader_name
      option.label = row.channel_trader_name
      options.push(option)
    }
  }
  return options
}

function packageDailyRows (rows) {
  let options = []
  for (let row of rows) {
    let option = {}
    if (row.bjyy && row.bjyy !== '') {
      option.value = row.bjyy
      option.label = row.bjyy
      options.push(option)
    }
  }
  return options
}

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }

    if (row.sqzrs) {
      row.sqzrs = formatInt(row.sqzrs)
    }
    if (row.sqtgrs) {
      row.sqtgrs = formatInt(row.sqtgrs)
    }
    if (row.sq_dqrs) {
      row.sq_dqrs = formatInt(row.sq_dqrs)
    }
    if (row.sq_yqrs) {
      row.sq_yqrs = formatInt(row.sq_yqrs)
    }

    if (row.tgl) {
      row.tgl = row.tgl + '%'
    }
    if (row.sq_yql) {
      row.sq_yql = row.sq_yql + '%'
    }
    return row
  })
}

module.exports = {
  getRejectedResons (req, res) {
    let channelName = req.body.channelName
    let times = req.body.period
    if (times === '日') {
      times = sql.RMAB.newUserPassRateRatio.tab3.rejectedResons20.daily
    } else if (times === '周') {
      times = sql.RMAB.newUserPassRateRatio.tab3.rejectedResons20.weekly
    } else {
      times = sql.RMAB.newUserPassRateRatio.tab3.rejectedResons20.monthly
    }
    let period = ' and zbmc="' + req.body.period + '"'
    if (channelName) {
      channelName = ' and qdmc ="' + channelName + '"'
    } else {
      channelName = ' and qdmc = "汇总"'
    }
    let query = sql.RMAB.newUserPassRateRatio.tab3.rejectedResons20.selectAllFront + times + channelName + period + sql.RMAB.newUserPassRateRatio.tab3.rejectedResons20.selectAllLimit
    func.connPool1(query, tableName.newUserPassRateRatioTab3, function (err, rs) {
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
      res.json(formatProperty(rs))
    })
  },
  getDailyRejectedNumTrends (req, res) {
    let reason = req.body.reason
    let query = sql.RMAB.newUserPassRateRatio.tab3.dailyRejectedNumTrends.select
    func.connPool1(query, [tableName.newUserPassRateRatioTab3, reason], function (err, rs) {
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
      res.json(formatProperty(rs))
    })
  },
  getChannelRejectedReason (req, res) {
    let period = req.body.period
    let query
    if (period === '日') {
      query = sql.RMAB.newUserPassRateRatio.tab3.channelRejectedReason.selectDaily
    } else if (period === '周') {
      query = sql.RMAB.newUserPassRateRatio.tab3.channelRejectedReason.selectWeekly
    } else {
      query = sql.RMAB.newUserPassRateRatio.tab3.channelRejectedReason.selectMonthly
    }
    func.connPool1(query, tableName.newUserPassRateRatioTab3, function (err, rs) {
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
      res.json(formatProperty(rs))
    })
  },
  getSelectOptions (req, res) {
    func.connPool1(sql.promotionManagement.promotionChannelStatistics.getSelectOptions, tableName.promotionChannelStatistics, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageRows(rs)
      res.json(rs)
    })
  },
  getDailyOptions (req, res) {
    func.connPool1(sql.RMAB.newUserPassRateRatio.tab3.dailyRejectedNumTrends.dailyOptions, tableName.newUserPassRateRatioTab3, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageDailyRows(rs)
      res.json(rs)
    })
  }
}
