let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')


function formatData (rows) {
  return rows.map(row => {
    if (row.order_create_time) {
      row.order_create_time = moment(row.order_create_time).format('YYYY-MM-DD HH:mm:ss')
    }

    if (row.order_amount) {
      row.order_amount = formatCurrency(row.order_amount)
    }
    if (row.final_price) {
      row.final_price = formatCurrency(row.final_price)
    }
    //num
    if (row.total_bid_count) {
      row.total_bid_count = formatInt(row.total_bid_count)
    }
    if (row.person_count) {
      row.person_count = formatInt(row.person_count)
    }
    if (row.valid_bid_count) {
      row.valid_bid_count = formatInt(row.valid_bid_count)
    }
    if (row.valid_person_count) {
      row.valid_person_count = formatInt(row.valid_person_count)
    }
    /*if (row.avg_bid_count) {
      row.avg_bid_count = formatCurrency(row.avg_bid_count)
    }
    if (row.avg_valid_bid_count) {
      row.avg_valid_bid_count = formatCurrency(row.avg_valid_bid_count)
    }*/
    if (row.user_type) {
      switch (row.user_type)
      {
        case 1:
          row.user_type = '普通用户'
          break
        case 2:
          row.user_type = '特权用户'
          break
      }
    }
    if (row.order_status >= 0) {
      switch (row.order_status)
      {
        case 0:
          row.order_status = '正在拍'
          break
        case 1:
          row.order_status = '待支付尾款'
          break
        case 2:
          row.order_status = '已支付尾款'
          break
        case 3:
          row.order_status = '已流拍(内部拍回)'
          break
        case 4:
          row.order_status = '待配货'
          break
        case 5:
          row.order_status = '已发货'
          break
        case 6:
          row.order_status = '确认收货'
          break
        case 7:
          row.order_status = '已完成'
          break
        case 8:
          row.order_status = '已关闭'
          break
      }
    }
    if (row.order_type) {
      switch (row.order_type)
      {
        case 1:
          row.order_type = '拍卖'
          break
        case 2:
          row.order_type = '差价购'
          break
      }
    }
    if (row.varchar1 === '1') {
      row.varchar1 = '是'
    } else if (row.varchar1 === '2') {
      row.varchar1 = '否'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.订单时间) {
      row.订单时间 = moment(row.订单时间).format('YYYY-MM-DD HH:mm:ss')
    }

    if (row['订单成交金额(元)']) {
      row['订单成交金额(元)'] = formatCurrency(row['订单成交金额(元)'])
    }
    if (row['订单成交真实金额(元)']) {
      row['订单成交真实金额(元)'] = formatCurrency(row['订单成交真实金额(元)'])
    }
    //num
    if (row.订单出价总次数) {
      row.订单出价总次数 = formatInt(row.订单出价总次数)
    }
    if (row.订单出价总人数) {
      row.订单出价总人数 = formatInt(row.订单出价总人数)
    }
    if (row.订单出价真实次数) {
      row.订单出价真实次数 = formatInt(row.订单出价真实次数)
    }
    if (row.订单出价真实人数) {
      row.订单出价真实人数 = formatInt(row.订单出价真实人数)
    }
   /* if (row.总人均出价次数) {
      row.总人均出价次数 = formatCurrency(row.总人均出价次数)
    }
    if (row.真实人均出价次数) {
      row.真实人均出价次数 = formatCurrency(row.真实人均出价次数)
    }*/
    if (row.是否特权用户订单) {
      switch (row.是否特权用户订单)
      {
        case 1:
          row.是否特权用户订单 = '普通用户'
          break
        case 2:
          row.是否特权用户订单 = '特权用户'
          break
      }
    }
    if (row.支付状态 >= 0) {
      switch (row.支付状态)
      {
        case 0:
          row.支付状态 = '正在拍'
          break
        case 1:
          row.支付状态 = '待支付尾款'
          break
        case 2:
          row.支付状态 = '已支付尾款'
          break
        case 3:
          row.支付状态 = '已流拍(内部拍回)'
          break
        case 4:
          row.支付状态 = '待配货'
          break
        case 5:
          row.支付状态 = '已发货'
          break
        case 6:
          row.支付状态 = '确认收货'
          break
        case 7:
          row.支付状态 = '已完成'
          break
        case 8:
          row.支付状态 = '已关闭'
          break
      }
    }
    if (row.订单类型) {
      switch (row.订单类型)
      {
        case 1:
          row.订单类型 = '拍卖'
          break
        case 2:
          row.订单类型 = '差价购'
          break
      }
    }
    if (row.是否晒单 === '1') {
      row.是否晒单 = '是'
    } else if (row.是否晒单 === '2') {
      row.是否晒单 = '否'
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'order_create_time', 'w')
    let order = params.order || sql.auction.operate.orderInfo.orderBy
    let query = sql.auction.operate.orderInfo.selectAll + queries + order + sql.auction.operate.orderInfo.selectAllBack
    func.connPool1(query, [tableName.orderInfo, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'order_create_time', 'w')
    let query = sql.auction.operate.orderInfo.getCount + queries
    func.connPool1(query, [tableName.orderInfo], function (err, rs) {
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
    let queries = analysis(params, 'order_create_time', 'w')
    let query = sql.auction.operate.orderInfo.selectAllExcel + queries + sql.auction.operate.orderInfo.orderBy
    func.connPool1(query, [tableName.orderInfo], function (err, rs) {
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
  },
  getExcelDataRSP (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.auction.operate.orderInfo.registrationStatisticsReportExcel + queries + sql.auction.operate.orderInfo.order
    func.connPool1(query, [tableName.dailyLendingData], function (err, rs) {
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
      rs = formatData(formatExcelDataRSP(rs))
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
