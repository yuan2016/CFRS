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
    if (row.recharge_time) {
      row.recharge_time = moment(row.recharge_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.recharge_coin) {
      row.recharge_coin = formatInt(row.recharge_coin)
    }
    if (row.recharge_money) {
      row.recharge_money = formatCurrency(row.recharge_money)
    }
    if (row.recharge_status) {
      switch (row.recharge_status) {
        case 1:
          row.recharge_status = '充值中'
          break
        case 2:
          row.recharge_status = '充值成功'
          break
        case 3:
          row.recharge_status = '充值失败'
          break
      }
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.充值时间) {
      row.充值时间 = moment(row.充值时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.充值拍币数) {
      row.充值拍币数 = formatInt(row.充值拍币数)
    }
    if (row['充值金额(元)']) {
      row['充值金额(元)'] = formatCurrency(row['充值金额(元)'])
    }
    if (row.充值状态) {
      switch (row.充值状态) {
        case 1:
          row.充值状态 = '充值中'
          break
        case 2:
          row.充值状态 = '充值成功'
          break
        case 3:
          row.充值状态 = '充值失败'
          break
      }
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'recharge_time', 'w')
    let order = params.order || sql.auction.operate.rechargeRecord.orderBy
    let query = sql.auction.operate.rechargeRecord.selectAll + queries + order + sql.auction.operate.rechargeRecord.selectAllBack
    console.log(query)
    func.connPool1(query, [tableName.rechargeRecord, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'recharge_time', 'w')
    let query = sql.auction.operate.rechargeRecord.getCount + queries
    func.connPool1(query, [tableName.rechargeRecord], function (err, rs) {
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
    let queries = analysis(params, 'recharge_time', 'w')
    let query = sql.auction.operate.rechargeRecord.selectAllExcel + queries + sql.auction.operate.rechargeRecord.orderBy
    func.connPool1(query, [tableName.rechargeRecord], function (err, rs) {
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
