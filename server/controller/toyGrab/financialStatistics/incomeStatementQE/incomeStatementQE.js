let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')


function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.recharge_amt) {
      row.recharge_amt = formatCurrency(row.recharge_amt)
    }

    //num
    if (row.recharge_cny) {
      row.recharge_cny = formatInt(row.recharge_cny)
    }
    if (row.consume_cny) {
      row.consume_cny = formatInt(row.consume_cny)
    }
    if (row.exchange_cny) {
      row.exchange_cny = formatInt(row.exchange_cny)
    }
    if (row.login_award) {
      row.login_award = formatInt(row.login_award)
    }
    if (row.inviting_friend) {
      row.inviting_friend = formatInt(row.inviting_friend)
    }
    if (row.freight_deduction) {
      row.freight_deduction = formatInt(row.freight_deduction)
    }
    if (row.day_award) {
      row.day_award = formatInt(row.day_award)
    }
    if (row.week_award) {
      row.week_award = formatInt(row.week_award)
    }
    if (row.month_award) {
      row.month_award = formatInt(row.month_award)
    }
    if (row.coin_return) {
      row.coin_return = formatInt(row.coin_return)
    }
    if (row.overplus_cny) {
      row.overplus_cny = formatInt(row.overplus_cny)
    }
    if (row.capture_dolls) {
      row.capture_dolls = formatInt(row.capture_dolls)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.更新时间) {
      row.更新时间 = moment(row.更新时间).format('YYYY-MM-DD HH:mm:ss')
    }

    // money
    if (row.充值金额) {
      row.充值金额 = formatCurrency(row.充值金额)
    }

    //num
    if (row['充值产生币(个)']) {
      row['充值产生币(个)'] = formatInt(row['充值产生币(个)'])
    }
    if (row['游戏消耗币(个)']) {
      row['游戏消耗币(个)'] = formatInt(row['游戏消耗币(个)'])
    }
    if (row['兑换游戏币(个)']) {
      row['兑换游戏币(个)'] = formatInt(row['兑换游戏币(个)'])
    }
    if (row['登录奖励(个)']) {
      row['登录奖励(个)'] = formatInt(row['登录奖励(个)'])
    }
    if (row['邀请好友(个)']) {
      row['邀请好友(个)'] = formatInt(row['邀请好友(个)'])
    }
    if (row['运费扣除(个)']) {
      row['运费扣除(个)'] = formatInt(row['运费扣除(个)'])
    }
    if (row['日榜奖励(个)']) {
      row['日榜奖励(个)'] = formatInt(row['日榜奖励(个)'])
    }
    if (row['周卡赠送奖励(个)']) {
      row['周卡赠送奖励(个)'] = formatInt(row['周卡赠送奖励(个)'])
    }
    if (row['月卡赠送奖励(个)']) {
      row['月卡赠送奖励(个)'] = formatInt(row['月卡赠送奖励(个)'])
    }
    if (row['申诉成功退币(个)']) {
      row['申诉成功退币(个)'] = formatInt(row['申诉成功退币(个)'])
    }
    if (row['剩余币(个)']) {
      row['剩余币(个)'] = formatInt(row['剩余币(个)'])
    }
    if (row['抓中娃娃(个)']) {
      row['抓中娃娃(个)'] = formatInt(row['抓中娃娃(个)'])
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.financeAnalysis.incomeStatementQE.order
    let query = sql.financeAnalysis.incomeStatementQE.selectAll + queries + order + sql.financeAnalysis.incomeStatementQE.selectAllBack
    func.connPool1(query, [tableName.incomeStatementQE, params.offset, params.limit], function (err, rs) {
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
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.financeAnalysis.incomeStatementQE.getCount + queries
    func.connPool1(query, [tableName.incomeStatementQE], function (err, rs) {
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
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.financeAnalysis.incomeStatementQE.selectAllExcel + queries + sql.financeAnalysis.incomeStatementQE.order
    func.connPool1(query, [tableName.incomeStatementQE], function (err, rs) {
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
      rs = formatExcelData(rs)
      let fileName = mosaicName()
      let currFilePath = path.join(process.cwd(), fileName)
      let options = {
        headers: {
          'Content-Disposition': 'attachment; filename=' + fileName
        }
      }
      let writer = new XLSXWriter(fileName, {})
      let wirteStream = fs.createWriteStream(fileName)

// After instantiation, you can grab the readstream at any time.
      writer.getReadStream().pipe(wirteStream)
      for (let i of rs) {
        writer.addRow(i)
      }
      writer.finalize()
      wirteStream.on('finish', function () {
        // finish
        res.sendFile(currFilePath, options, function () {
          if (err) {
            console.log(err)
            res.sendFile(path.join(process.cwd(), 'error.html'))
            return
          } else {
            console.log('Sent:', fileName)
            fs.unlink(currFilePath, function (err) {
              if (err) console.log(err)
              console.log('文件删除成功')
            })
          }
        })
      })
    }, 180000)
  }
}
