let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {analysis, formatInt, mosaicName} = require('../../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
function formatData (rows) {
  return rows.map(row => {
    if (row.d_date && String(row.d_date).indexOf('/') === -1) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.modified_time) {
      row.modified_time = moment(row.modified_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.pv) {
      row.pv = formatInt(row.pv)
    }
    if (row.uv) {
      row.uv = formatInt(row.uv)
    }
    if (row.discount_amount) {
      row.discount_amount = formatInt(row.discount_amount)
    }
    if (row.discount_using) {
      row.discount_using = formatInt(row.discount_using)
    }

    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期 && String(row.日期).indexOf('/') === -1) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.点击量) {
      row.点击量 = formatInt(row.点击量)
    }
    if (row.用户数) {
      row.用户数 = formatInt(row.用户数)
    }
    if (row['折扣次数(5折/免费)赠送量']) {
      row['折扣次数(5折/免费)赠送量'] = formatInt(row['折扣次数(5折/免费)赠送量'])
    }
    if (row['折扣次数(5折/免费)使用量']) {
      row['折扣次数(5折/免费)使用量'] = formatInt(row['折扣次数(5折/免费)使用量'])
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.toyGrab.buriaPointAnalysis.arbitraryGatePVUV.order
    let query = sql.toyGrab.buriaPointAnalysis.arbitraryGatePVUV.selectDayFront + queries + order + sql.toyGrab.buriaPointAnalysis.arbitraryGatePVUV.limit
    func.connPool1(query, [tableName.arbitraryGatePVUV, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.toyGrab.buriaPointAnalysis.arbitraryGatePVUV.getCount + queries
    func.connPool1(query, [tableName.arbitraryGatePVUV], function (err, rs) {
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
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.toyGrab.buriaPointAnalysis.arbitraryGatePVUV.selectAllExcel + queries
    func.connPool1(query, tableName.arbitraryGatePVUV, function (err, rs) {
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
  fetchAllSUM (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let t1 = ''
    let t2 = ''
    let t = ''
    if (params.startTime[0] || params.endTime[0]) {
      t1 = params.startTime[0] || '-'
      t2 = params.endTime[0] || '-'
      t = t1 + ' / ' + t2
    }
    let order = params.order || sql.toyGrab.buriaPointAnalysis.arbitraryGatePVUV.order
    let query = sql.toyGrab.buriaPointAnalysis.arbitraryGatePVUV.selectDayFrontSUM + queries + order
    func.connPool1(query, [t, tableName.arbitraryGatePVUV], function (err, rs) {
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
  getExcelDataSUM (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let startT = params.startTime.replace(/["]/g, '').split(',')
    let endT = params.endTime.replace(/["]/g, '').split(',')
    let t1 = ''
    let t2 = ''
    let t = ''
    if (startT[0] || endT[0]) {
      t1 = startT[0] || '-'
      t2 = endT[0] || '-'
      t = t1 + ' / ' + t2
    }
    let query = sql.toyGrab.buriaPointAnalysis.arbitraryGatePVUV.selectAllExcelSUM + queries
    func.connPool1(query, [t, tableName.arbitraryGatePVUV], function (err, rs) {
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
