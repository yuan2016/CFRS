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

global.totalIncomeCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    // money
    if (row.income_amount) {
      row.income_amount = formatCurrency(row.income_amount)
    }
    if (row.return_amount) {
      row.return_amount = formatCurrency(row.return_amount)
    }
    if (row.coupon_amount) {
      row.coupon_amount = formatCurrency(row.coupon_amount)
    }
    if (row.dused_coupon_amount) {
      row.dused_coupon_amount = formatCurrency(row.dused_coupon_amount)
    }
    if (row.used_coupon_amount) {
      row.used_coupon_amount = formatCurrency(row.used_coupon_amount)
    }
    if (row.unuse_unexpired_amount) {
      row.unuse_unexpired_amount = formatCurrency(row.unuse_unexpired_amount)
    }
    if (row.expired_coupon_amount) {
      row.expired_coupon_amount = formatCurrency(row.expired_coupon_amount)
    }
    //num
    if (row.coupon_number) {
      row.coupon_number = formatInt(row.coupon_number)
    }
    if (row.unuse_unexpired_number) {
      row.unuse_unexpired_number = formatInt(row.unuse_unexpired_number)
    }
    if (row.expired_coupon_number) {
      row.expired_coupon_number = formatInt(row.expired_coupon_number)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    // money
    if (row['收入金额(元)']) {
      row['收入金额(元)'] = formatCurrency(row['收入金额(元)'])
    }
    if (row['退回金额(元)']) {
      row['退回金额(元)'] = formatCurrency(row['退回金额(元)'])
    }
    if (row['优惠满减金额(元)']) {
      row['优惠满减金额(元)'] = formatCurrency(row['优惠满减金额(元)'])
    }
    if (row['当日已使用优惠金额(元)']) {
      row['当日已使用优惠金额(元)'] = formatCurrency(row['当日已使用优惠金额(元)'])
    }
    if (row['累计已使用优惠金额(元)']) {
      row['累计已使用优惠金额(元)'] = formatCurrency(row['累计已使用优惠金额(元)'])
    }
    if (row['未使用未到期满减金额(元)']) {
      row['未使用未到期满减金额(元)'] = formatCurrency(row['未使用未到期满减金额(元)'])
    }
    if (row['累计已失效的优惠券金额(元)']) {
      row['累计已失效的优惠券金额(元)'] = formatCurrency(row['累计已失效的优惠券金额(元)'])
    }
    //num
    if (row.优惠折扣券数量) {
      row.优惠折扣券数量 = formatInt(row.优惠折扣券数量)
    }
    if (row.未使用未到期满减折扣券数量) {
      row.未使用未到期满减折扣券数量 = formatInt(row.未使用未到期满减折扣券数量)
    }
    if (row.累计已失效的折扣券数量) {
      row.累计已失效的折扣券数量 = formatInt(row.累计已失效的折扣券数量)
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.totalIncome.order
    let query = sql.period.totalIncome.selectAll + queries + order + sql.period.totalIncome.selectAllBack
    func.connPool1(query, [tableName.period.totalIncome, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.totalIncome.getCount + queries
    func.connPool1(query, [tableName.period.totalIncome], function (err, rs) {
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
    if (global.totalIncomeCount === 0) {
      global.totalIncomeCount++
      pro.exec(shell.totalIncome, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算总表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.totalIncomeCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算总表shell脚本执行成功')
          res.json({code: '200'})
          global.totalIncomeCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算总表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.totalIncome.selectAllExcel + queries + sql.period.totalIncome.order
    func.connPool1(query, [tableName.period.totalIncome], function (err, rs) {
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
