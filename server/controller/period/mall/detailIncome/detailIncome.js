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

global.detailIncomeCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD ')
    }
    if (row.buy_time) {
      row.buy_time = moment(row.buy_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.begin_time) {
      row.begin_time = moment(row.begin_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.end_time) {
      row.end_time = moment(row.end_time).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.pay_amount) {
      row.pay_amount = formatCurrency(row.pay_amount)
    }
    if (row.coupon_money) {
      row.coupon_money = formatCurrency(row.coupon_money)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD ')
    }
    if (row.大礼包购买时间) {
      row.大礼包购买时间 = moment(row.大礼包购买时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.使用开始时间) {
      row.使用开始时间 = moment(row.使用开始时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.使用截止时间) {
      row.使用截止时间 = moment(row.使用截止时间).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row['大礼包购买金额(元)']) {
      row['大礼包购买金额(元)'] = formatCurrency(row['大礼包购买金额(元)'])
    }
    if (row['优惠券金额(元)']) {
      row['优惠券金额(元)'] = formatCurrency(row['优惠券金额(元)'])
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.detailIncome.order
    let query = sql.period.detailIncome.selectAll + queries + order + sql.period.detailIncome.selectAllBack
    func.connPool1(query, [tableName.period.detailIncome, params.offset, params.limit], function (err, rs) {
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
  //每日还款金额数据总条数
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.detailIncome.getCount + queries
    func.connPool1(query, [tableName.period.detailIncome], function (err, rs) {
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
    if (global.detailIncomeCount === 0) {
      global.detailIncomeCount++
      pro.exec(shell.detailIncome, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.detailIncomeCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表shell脚本执行成功')
          res.json({code: '200'})
          global.detailIncomeCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.detailIncome.selectAllExcel + queries + sql.period.detailIncome.order
    func.connPool1(query, [tableName.period.detailIncome], function (err, rs) {
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
