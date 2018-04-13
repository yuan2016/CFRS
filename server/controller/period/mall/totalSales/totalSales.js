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
    if (row.order_amount) {
      row.order_amount = formatCurrency(row.order_amount)
    }
    if (row.paid_amount) {
      row.paid_amount = formatCurrency(row.paid_amount)
    }
    if (row.discount_amount) {
      row.discount_amount = formatCurrency(row.discount_amount)
    }
    if (row.mcoupon_amount) {
      row.mcoupon_amount = formatCurrency(row.mcoupon_amount)
    }
    if (row.zcoupon_amount) {
      row.zcoupon_amount = formatCurrency(row.zcoupon_amount)
    }
    if (row.money_amount) {
      row.money_amount = formatCurrency(row.money_amount)
    }
    if (row.debt_amount) {
      row.debt_amount = formatCurrency(row.debt_amount)
    }
    // int
    if (row.order_total) {
      row.order_total = formatInt(row.order_total)
    }
    if (row.paid_order) {
      row.paid_order = formatInt(row.paid_order)
    }
    if (row.order_people) {
      row.order_people = formatInt(row.order_people)
    }
    if (row.paid_people) {
      row.paid_people = formatInt(row.paid_people)
    }
    if (row.order_goods_num) {
      row.order_goods_num = formatInt(row.order_goods_num)
    }
    if (row.paid_goods_num) {
      row.paid_goods_num = formatInt(row.paid_goods_num)
    }
    if (row.mcoupon_num) {
      row.mcoupon_num = formatInt(row.mcoupon_num)
    }
    if (row.zcoupon_num) {
      row.zcoupon_num = formatInt(row.zcoupon_num)
    }
    if (row.delivery_order_num) {
      row.delivery_order_num = formatInt(row.delivery_order_num)
    }
    if (row.receive_order_num) {
      row.receive_order_num = formatInt(row.receive_order_num)
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
    if (row['总订单金额(元)']) {
      row['总订单金额(元)'] = formatCurrency(row['总订单金额(元)'])
    }
    if (row['已支付订单金额(元)']) {
      row['已支付订单金额(元)'] = formatCurrency(row['已支付订单金额(元)'])
    }
    if (row['总优惠金额(元)']) {
      row['总优惠金额(元)'] = formatCurrency(row['总优惠金额(元)'])
    }
    if (row['使用满减优惠券金额(元)']) {
      row['使用满减优惠券金额(元)'] = formatCurrency(row['使用满减优惠券金额(元)'])
    }
    if (row['使用折扣优惠券金额(元)']) {
      row['使用折扣优惠券金额(元)'] = formatCurrency(row['使用折扣优惠券金额(元)'])
    }
    if (row['总实收金额(元)']) {
      row['总实收金额(元)'] = formatCurrency(row['总实收金额(元)'])
    }
    if (row['黑卡支付金额(元)']) {
      row['黑卡支付金额(元)'] = formatCurrency(row['黑卡支付金额(元)'])
    }
    // int
    if (row.总订单量) {
      row.总订单量 = formatInt(row.总订单量)
    }
    if (row.已支付订单量) {
      row.已支付订单量 = formatInt(row.已支付订单量)
    }
    if (row.总下订单人数) {
      row.总下订单人数 = formatInt(row.总下订单人数)
    }
    if (row.已支付订单人数) {
      row.已支付订单人数 = formatInt(row.已支付订单人数)
    }
    if (row.订单总商品件数) {
      row.订单总商品件数 = formatInt(row.订单总商品件数)
    }
    if (row.已支付总商品件数) {
      row.已支付总商品件数 = formatInt(row.已支付总商品件数)
    }
    if (row.使用满减优惠券数量) {
      row.使用满减优惠券数量 = formatInt(row.使用满减优惠券数量)
    }
    if (row.使用折扣优惠券数量) {
      row.使用折扣优惠券数量 = formatInt(row.使用折扣优惠券数量)
    }
    if (row.总发货订单数) {
      row.总发货订单数 = formatInt(row.总发货订单数)
    }
    if (row.总收货订单数) {
      row.总收货订单数 = formatInt(row.总收货订单数)
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.totalSales.order
    let query = sql.period.totalSales.selectAll + queries + order + sql.period.totalSales.selectAllBack
    func.connPool1(query, [tableName.period.totalSales, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.totalSales.getCount + queries
    func.connPool1(query, [tableName.period.totalSales], function (err, rs) {
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
      pro.exec(shell.totalSales, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期总销售额统计表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.totalSalesCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期总销售额统计表shell脚本执行成功')
          res.json({code: '200'})
          global.totalSalesCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期总销售额统计表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.totalSales.selectAllExcel + queries + sql.period.totalSales.order
    func.connPool1(query, [tableName.period.totalSales], function (err, rs) {
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
