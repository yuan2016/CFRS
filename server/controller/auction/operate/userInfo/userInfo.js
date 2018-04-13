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
    if (row.first_recharge_time) {
      row.first_recharge_time = moment(row.first_recharge_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.add_time) {
      row.add_time = moment(row.add_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.last_login_time) {
      row.last_login_time = moment(row.last_login_time).format('YYYY-MM-DD HH:mm:ss')
    }

    if (row.first_recharge_money) {
      row.first_recharge_money = formatCurrency(row.first_recharge_money)
    }
    if (row.recharge_money) {
      row.recharge_money = formatCurrency(row.recharge_money)
    }
    if (row.win_money) {
      row.win_money = formatCurrency(row.win_money)
    }
    if (row.win_product_price) {
      row.win_product_price = formatCurrency(row.win_product_price)
    }
    if (row.win_npay_money) {
      row.win_npay_money = formatCurrency(row.win_npay_money)
    }
    //num
    if (row.recharge_count) {
      row.recharge_count = formatInt(row.recharge_count)
    }
    if (row.coin1) {
      row.coin1 = formatInt(row.coin1)
    }
    if (row.coin2) {
      row.coin2 = formatInt(row.coin2)
    }
    if (row.coin3) {
      row.coin3 = formatInt(row.coin3)
    }
    if (row.coin4) {
      row.coin4 = formatInt(row.coin4)
    }
    if (row.collect_count) {
      row.collect_count = formatInt(row.collect_count)
    }
    if (row.auction_count) {
      row.auction_count = formatInt(row.auction_count)
    }
    if (row.bid_count) {
      row.bid_count = formatInt(row.bid_count)
    }
    if (row.win_count) {
      row.win_count = formatInt(row.win_count)
    }
    if (row.win_npay_count) {
      row.win_npay_count = formatInt(row.win_npay_count)
    }
    /*if (row.last_recharge_times) {
      row.last_recharge_times = formatInt(row.last_recharge_times)
    }*/
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.首充时间) {
      row.首充时间 = moment(row.首充时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.注册时间) {
      row.注册时间 = moment(row.注册时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.最后登录时间) {
      row.最后登录时间 = moment(row.最后登录时间).format('YYYY-MM-DD HH:mm:ss')
    }

    if (row['首充金额(元)']) {
      row['首充金额(元)'] = formatCurrency(row['首充金额(元)'])
    }
    if (row['充值总额(元)']) {
      row['充值总额(元)'] = formatCurrency(row['充值总额(元)'])
    }
    if (row['拍中应支付金额(元)']) {
      row['拍中应支付金额(元)'] = formatCurrency(row['拍中应支付金额(元)'])
    }
    if (row['拍中商品价值金额(元)']) {
      row['拍中商品价值金额(元)'] = formatCurrency(row['拍中商品价值金额(元)'])
    }
    if (row['拍中未付单金额(元)']) {
      row['拍中未付单金额(元)'] = formatCurrency(row['拍中未付单金额(元)'])
    }
    //num
    if (row.充值次数) {
      row.充值次数 = formatInt(row.充值次数)
    }
    if (row['拍币余额(个)']) {
      row['拍币余额(个)'] = formatInt(row['拍币余额(个)'])
    }
    if (row['赠币余额(个)']) {
      row['赠币余额(个)'] = formatInt(row['赠币余额(个)'])
    }
    if (row['开心币余额(个)']) {
      row['开心币余额(个)'] = formatInt(row['开心币余额(个)'])
    }
    if (row['积分余额(个)']) {
      row['积分余额(个)'] = formatInt(row['积分余额(个)'])
    }
    if (row.收藏商品数) {
      row.收藏商品数 = formatInt(row.收藏商品数)
    }
    if (row.竞拍次数) {
      row.竞拍次数 = formatInt(row.竞拍次数)
    }
    if (row.出价次数) {
      row.出价次数 = formatInt(row.出价次数)
    }
    if (row.中拍次数) {
      row.中拍次数 = formatInt(row.中拍次数)
    }
    if (row.拍中未付单数量) {
      row.拍中未付单数量 = formatInt(row.拍中未付单数量)
    }
    /*if (row.末次充值间隔) {
      row.末次充值间隔 = formatInt(row.末次充值间隔)
    }*/
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'add_time', 'w')
    let order = params.order || sql.auction.operate.userInfo.orderBy
    let query = sql.auction.operate.userInfo.selectAll + queries + order + sql.auction.operate.userInfo.selectAllBack
    func.connPool1(query, [tableName.userInfo, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'add_time', 'w')
    let query = sql.auction.operate.userInfo.getCount + queries
    func.connPool1(query, [tableName.userInfo], function (err, rs) {
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
    let queries = analysis(params, 'add_time', 'w')
    let query = sql.auction.operate.userInfo.selectAllExcel + queries + sql.auction.operate.userInfo.orderBy
    func.connPool1(query, [tableName.userInfo], function (err, rs) {
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
    let query = sql.auction.operate.userInfo.registrationStatisticsReportExcel + queries + sql.auction.operate.userInfo.order
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
