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
global.newChannelViewCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.start_time) {
      row.start_time = moment(row.start_time).format('YYYY-MM-DD')
    }
    if (row.end_time) {
      row.end_time = moment(row.end_time).format('YYYY-MM-DD')
    }
    if (row.settleprice) {
      row.settleprice = formatCurrency(row.settleprice)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.开始时间) {
      row.开始时间 = moment(row.开始时间).format('YYYY-MM-DD')
    }
    if (row.结束时间) {
      row.结束时间 = moment(row.结束时间).format('YYYY-MM-DD')
    }
    if (row['结算单价(元)']) {
      row['结算单价(元)'] = formatCurrency(row['结算单价(元)'])
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'w')
    let order = params.order || sql.auction.market.newChannelView.order
    let query = sql.auction.market.newChannelView.selectAll + queries + order + sql.auction.market.newChannelView.selectAllBack
    func.connPool1(query, [tableName.newChannelView, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, null, 'w')
    let query = sql.auction.market.newChannelView.getCount + queries
    func.connPool1(query, [tableName.newChannelView], function (err, rs) {
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
  refreshData (req, res) {
    if (global.newChannelViewCount === 0) {
      global.newChannelViewCount++
      pro.exec(shell.newChannelView, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 渠道信息表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.newChannelViewCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 渠道信息表shell脚本执行成功')
          res.json({code: '200'})
          global.newChannelViewCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 渠道信息表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, null, 'w')
    let query = sql.auction.market.newChannelView.selectAllExcel + queries + sql.auction.market.newChannelView.order
    func.connPool1(query, [tableName.newChannelView], function (err, rs) {
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
