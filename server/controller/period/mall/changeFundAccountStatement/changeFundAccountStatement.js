let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let {exportJsonToExcel} = require('../../../../utils/excel')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.changeFundAccountStatementCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.created_time) {
      row.created_time = moment(row.created_time).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.recharge_amt) {
      row.recharge_amt = formatCurrency(row.recharge_amt)
    }
    if (row.recharge_fee) {
      row.recharge_fee = formatCurrency(row.recharge_fee)
    }
    if (row.withdraw_fee) {
      row.withdraw_fee = formatCurrency(row.withdraw_fee)
    }
    if (row.dlb_refund) {
      row.dlb_refund = formatCurrency(row.dlb_refund)
    }
    if (row.dlb_pay) {
      row.dlb_pay = formatCurrency(row.dlb_pay)
    }
    if (row.pocket_pay) {
      row.pocket_pay = formatCurrency(row.pocket_pay)
    }
    if (row.withdraw) {
      row.withdraw = formatCurrency(row.withdraw)
    }
    if (row.balance) {
      row.balance = formatCurrency(row.balance)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.创建时间) {
      row.创建时间 = moment(row.创建时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row['充值金额(元)']) {
      row['充值金额(元)'] = formatCurrency(row['充值金额(元)'])
    }
    if (row['充值手续费(元)']) {
      row['充值手续费(元)'] = formatCurrency(row['充值手续费(元)'])
    }
    if (row['提现手续费(元)']) {
      row['提现手续费(元)'] = formatCurrency(row['提现手续费(元)'])
    }
    if (row['大礼包退款(元)']) {
      row['大礼包退款(元)'] = formatCurrency(row['大礼包退款(元)'])
    }
    if (row['大礼包支付(元)']) {
      row['大礼包支付(元)'] = formatCurrency(row['大礼包支付(元)'])
    }
    if (row['商品零钱支付(元)']) {
      row['商品零钱支付(元)'] = formatCurrency(row['商品零钱支付(元)'])
    }
    if (row['提现(元)']) {
      row['提现(元)'] = formatCurrency(row['提现(元)'])
    }
    if (row['余额(元)']) {
      row['余额(元)'] = formatCurrency(row['余额(元)'])
    }
    return row
  })
}

module.exports = {
  //每日还款明细记录
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'created_time', 'w')
    let order = params.order || sql.period.changeFundAccountStatement.order
    let query = sql.period.changeFundAccountStatement.selectAll + queries + order + sql.period.changeFundAccountStatement.selectAllBack
    func.connPool1(query, [tableName.period.changeFundAccountStatement, params.offset, params.limit], function (err, rs) {
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
  //每日还款明细记录总条数
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'created_time', 'w')
    let query = sql.period.changeFundAccountStatement.getCount + queries
    func.connPool1(query, [tableName.period.changeFundAccountStatement], function (err, rs) {
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
  refreshData(req, res) {
    if (global.changeFundAccountStatementCount === 0) {
      global.changeFundAccountStatementCount++
      pro.exec(shell.changeFundAccountStatement, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.changeFundAccountStatementCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录shell脚本执行成功')
          res.json({code: '200'})
          global.changeFundAccountStatementCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'created_time', 'w')
    let query = sql.period.changeFundAccountStatement.selectAllExcel + queries + sql.period.changeFundAccountStatement.order
    func.connPool1(query, [tableName.period.changeFundAccountStatement], function (err, rs) {
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
            return false
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
