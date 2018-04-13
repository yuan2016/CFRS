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

global.totalSalesCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    //日期
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD ')
    }
    // money
    if (row.product_price) {
      row.product_price = formatCurrency(row.product_price)
    }
    if (row.actual_sale_amount) {
      row.actual_sale_amount = formatCurrency(row.actual_sale_amount)
    }
    if (row.order_amount) {
      row.order_amount = formatCurrency(row.order_amount)
    }
    // int
    if (row.actual_buy_num) {
      row.actual_buy_num = formatInt(row.actual_buy_num)
    }
    if (row.actual_sale_num) {
      row.actual_sale_num = formatInt(row.actual_sale_num)
    }
    if (row.delivery_num) {
      row.delivery_num = formatInt(row.delivery_num)
    }
    if (row.receive_num) {
      row.receive_num = formatInt(row.receive_num)
    }
    if (row.order_user_num) {
      row.order_user_num = formatInt(row.order_user_num)
    }
    if (row.order_num) {
      row.order_num = formatInt(row.order_num)
    }
    //率
    if (row.payment_rate) {
      row.payment_rate = (row.payment_rate * 100).toFixed(2) + '%'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    //日期
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD ')
    }
    // money
    if (row['商品单价(元)']) {
      row['商品单价(元)'] = formatCurrency(row['商品单价(元)'])
    }
    if (row['实际销售金额(元)']) {
      row['实际销售金额(元)'] = formatCurrency(row['实际销售金额(元)'])
    }
    if (row['下单金额(元)']) {
      row['下单金额(元)'] = formatCurrency(row['下单金额(元)'])
    }
    // int
    if (row.实际购买人数) {
      row.实际购买人数 = formatInt(row.实际购买人数)
    }
    if (row.实际销售件数) {
      row.实际销售件数 = formatInt(row.实际销售件数)
    }
    if (row.已发货件数) {
      row.已发货件数 = formatInt(row.已发货件数)
    }
    if (row.已收货的件数) {
      row.已收货的件数 = formatInt(row.已收货的件数)
    }
    if (row.下单人数) {
      row.下单人数 = formatInt(row.下单人数)
    }
    if (row.下单件数) {
      row.下单件数 = formatInt(row.下单件数)
    }
    //率
    if (row.商品订单支付率) {
      row.商品订单支付率 = (row.商品订单支付率 * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.detailSales.order
    let query = sql.period.detailSales.selectAll + queries + order + sql.period.detailSales.selectAllBack
    func.connPool1(query, [tableName.period.detailSales, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.detailSales.getCount + queries
    func.connPool1(query, [tableName.period.detailSales], function (err, rs) {
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
    if (global.totalSalesCount === 0) {
      global.totalSalesCount++
      pro.exec(shell.detailSales, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期商品销售记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.totalSalesCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期商品销售记录shell脚本执行成功')
          res.json({code: '200'})
          global.totalSalesCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期商品销售记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.detailSales.selectAllExcel + queries + sql.period.detailSales.order
    func.connPool1(query, [tableName.period.detailSales], function (err, rs) {
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
