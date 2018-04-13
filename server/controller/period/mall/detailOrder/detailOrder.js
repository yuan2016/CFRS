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

global.detailOrderCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    //日期
    if (row.order_time) {
      row.order_time = moment(row.order_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.paid_time) {
      row.paid_time = moment(row.paid_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.dispatch_time) {
      row.dispatch_time = moment(row.dispatch_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.delivery_time) {
      row.delivery_time = moment(row.delivery_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.receive_time) {
      row.receive_time = moment(row.receive_time).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.product_price) {
      row.product_price = formatCurrency(row.product_price)
    }
    if (row.order_amount) {
      row.order_amount = formatCurrency(row.order_amount)
    }
    if (row.debt_money) {
      row.debt_money = formatCurrency(row.debt_money)
    }
    if (row.paid_money) {
      row.paid_money = formatCurrency(row.paid_money)
    }
    if (row.free_money) {
      row.free_money = formatCurrency(row.free_money)
    }
    // int
    if (row.product_num) {
      row.product_num = formatInt(row.product_num)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    //日期
    if (row['下单时间']) {
      row['下单时间'] = moment(row['下单时间']).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row['支付时间']) {
      row['支付时间'] = moment(row['支付时间']).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row['派单时间']) {
      row['派单时间'] = moment(row['派单时间']).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row['发货时间']) {
      row['发货时间'] = moment(row['发货时间']).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row['收货时间']) {
      row['收货时间'] = moment(row['收货时间']).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row['商品金额(元)']) {
      row['商品金额(元)'] = formatCurrency(row['商品金额(元)'])
    }
    if (row['订单总金额(元)']) {
      row['订单总金额(元)'] = formatCurrency(row['订单总金额(元)'])
    }
    if (row['白条支付金额(元)']) {
      row['白条支付金额(元)'] = formatCurrency(row['白条支付金额(元)'])
    }
    if (row['实付款(元)']) {
      row['实付款(元)'] = formatCurrency(row['实付款(元)'])
    }
    if (row['优惠金额(元)']) {
      row['优惠金额(元)'] = formatCurrency(row['优惠金额(元)'])
    }
    // int
    if (row['商品数量']) {
      row['商品数量'] = formatInt(row['商品数量'])
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'paid_time', 'w')
    let order = params.order || sql.period.detailOrder.order
    let query = sql.period.detailOrder.selectAll + queries + order + sql.period.detailOrder.selectAllBack
    func.connPool1(query, [tableName.period.detailOrder, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'paid_time', 'w')
    let query = sql.period.detailOrder.getCount + queries
    func.connPool1(query, [tableName.period.detailOrder], function (err, rs) {
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
    if (global.detailOrderCount === 0) {
      global.detailOrderCount++
      pro.exec(shell.detailOrder, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期订单详情记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.detailOrderCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期订单详情记录shell脚本执行成功')
          res.json({code: '200'})
          global.detailOrderCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期订单详情记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'paid_time', 'w')
    let query = sql.period.detailOrder.selectAllExcel + queries + sql.period.detailOrder.order
    func.connPool1(query, [tableName.period.detailOrder], function (err, rs) {
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
