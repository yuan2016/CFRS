let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let tableName = require('../../../config/tableName')
let moment = require('moment')
let {formatInt, formatCurrency} = require('../../../utils/utils')

function formatProperty (rs) {
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
  if (row.sq_yql >= 0) {
    row.sq_yql = row.sq_yql + '%'
  } else {
    row.sq_yql = '--'
  }
  if (row.sq_fkamt >= 0) {
    row.sq_fkamt = formatCurrency(row.sq_fkamt)
  } else {
    row.sq_fkamt = '--'
  }
  if (row.sq_dqamt >= 0) {
    row.sq_dqamt = formatCurrency(row.sq_dqamt)
  } else {
    row.sq_dqamt = '--'
  }
  if (row.sq_yqamt >= 0) {
    row.sq_yqamt = formatCurrency(row.sq_yqamt)
  } else {
    row.sq_yqamt = '--'
  }
  return row
})
}

module.exports = {
  getDaily (req, res) {
    let query = sql.RMAB.newUserPassRateRatio.tab2.dailySelect
    let channelName = req.body.channelName
    func.connPool1(query, [tableName.newUserPassRateRatioTab2, channelName], function (err, rs) {
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
  getWeekly (req, res) {
    let query = sql.RMAB.newUserPassRateRatio.tab2.weeklySelect
    let channelName = req.body.channelName
    func.connPool1(query, [tableName.newUserPassRateRatioTab2, channelName], function (err, rs) {
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
  getChannelInfo (req, res) {
    let channelName = req.body.channelName
    let date = req.body.date
    if (channelName) {
      channelName = 'qdmc = "' + channelName + '" '
    } else {
      channelName = 'qdmc <> "汇总" '
    }
    if (date) {
      date = 'and d_date = "' + date + '" '
    } else {
      date = ''
    }
    let order = req.body.order || sql.RMAB.newUserPassRateRatio.tab2.channelInfo.order

    let query = sql.RMAB.newUserPassRateRatio.tab2.channelInfo.selectAllFront + channelName + date + order +  sql.RMAB.newUserPassRateRatio.tab2.channelInfo.limit
    func.connPool1(query, [tableName.newUserPassRateRatioTab2Table, req.body.offset, req.body.limit], function (err, rs) {
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
  getChannelInfoCount (req, res) {
    let channelName = req.body.channelName
    let date = req.body.date
    if (channelName) {
      channelName = 'qdmc = "' + channelName + '" '
    } else {
      channelName = 'qdmc <> "汇总" '
    }
    if (date) {
      date = 'and d_date = "' + date + '" '
    } else {
      date = ''
    }
    let query = sql.RMAB.newUserPassRateRatio.tab2.channelInfo.getCount + channelName + date
    func.connPool1(query, tableName.newUserPassRateRatioTab2Table, function (err, rs) {
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
  },
  getSelectOptions (req, res) {
    func.connPool1(sql.promotionManagement.promotionChannelStatistics.getSelectOptions, tableName.promotionChannelStatistics, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageRows(rs)
      res.json(rs)
    })
  }
}
