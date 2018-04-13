let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {analysis, formatCurrency, formatInt} = require('../../../../utils/utils')
let pro = require('child_process')
let shell = require('../../../../config/shell')

global.dataOverviewAllCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.modified_time) {
      row.modified_time = moment(row.modified_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.once_price) {
      row.once_price = formatInt(row.once_price)
    }
    if (row.game_factincome) {
      row.game_factincome = formatInt(row.game_factincome)
    }
    if (row.game_theoryincome) {
      row.game_theoryincome = formatInt(row.game_theoryincome)
    }
    if (row.games_num) {
      row.games_num = formatInt(row.games_num)
    }
    if (row.success_num) {
      row.success_num = formatInt(row.success_num)
    }
    if (row.appeal_num) {
      row.appeal_num = formatInt(row.appeal_num)
    }
    if (row.fact_income) {
      row.fact_income = formatInt(row.fact_income)
    }
    if (row.the_income) {
      row.the_income = formatInt(row.the_income)
    }
    if (row.diff_income) {
      row.diff_income = formatInt(row.diff_income)
    }
    if (row.总用户数) {
      row.总用户数 = formatInt(row.总用户数)
    }
    if (row.新用户数量) {
      row.新用户数量 = formatInt(row.新用户数量)
    }
    if (row.总游戏次数) {
      row.总游戏次数 = formatInt(row.总游戏次数)
    }
    if (row.总消耗游戏币) {
      row.总消耗游戏币 = formatInt(row.总消耗游戏币)
    }
    if (row.充值订单数) {
      row.充值订单数 = formatInt(row.充值订单数)
    }
    if (row.充值总金额) {
      row.充值总金额 = formatCurrency(row.充值总金额)
    }
    if (row.充值人数) {
      row.充值人数 = formatInt(row.充值人数)
    }
    if (row.单次平均充值) {
      row.单次平均充值 = formatCurrency(row.单次平均充值)
    }
    if (row.复充人数) {
      row.复充人数 = formatInt(row.复充人数)
    }
    return row
  })
}

module.exports = {
  fetchAllRoom (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'w')
    let order = params.order || sql.toyGrab.market.dataOverviewAll.orderBy
    let query = sql.toyGrab.market.dataOverviewAll.selectAllRoom + queries + order + sql.toyGrab.market.dataOverviewAll.limitRoom
    func.connPool1(query, [tableName.dataOverviewAll.room, params.offset, params.limit], function (err, rs) {
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
  getCountRoom (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'w')
    let query = sql.toyGrab.market.dataOverviewAll.getCount + queries
    func.connPool1(query, [tableName.dataOverviewAll.room], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        console.log(err.message)
        console.log(err.message === 'Query inactivity timeout')
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
  refreshData (req, res) {
  if (global.dataOverviewAllCount === 0) {
    global.dataOverviewAllCount++
    pro.exec(shell.dataOverviewAll, function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error)
        console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '房间历史数据shell脚本执行失败')
        res.json({code: '500'})
        console.log("failed")
        global.dataOverviewAllCount = 0
      } else {
        console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '房间历史数据shell脚本执行成功')
        res.json({code: '200'})
        global.dataOverviewAllCount = 0
      }
    })
    console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '房间历史数据开始执行shell脚本')
  } else {
    res.json({code: '400'})
  }
},
  fetchAllDay (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'w')
    let query = sql.toyGrab.market.dataOverviewAll.selectAllDay + queries + sql.toyGrab.market.dataOverviewAll.limitDay
    func.connPool1(query, [tableName.dataOverviewAll.day, params.offset, params.limit], function (err, rs) {
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
}

