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
    if (row.room_pv) {
      row.room_pv = formatInt(row.room_pv)
    }
    if (row.avg_room_times) {
      row.avg_room_times = formatInt(row.avg_room_times)
    }

    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期 && String(row.日期).indexOf('/') === -1) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.各房间点击数) {
      row.各房间点击数 = formatInt(row.各房间点击数)
    }
    if (row['各房间人均停留时间(上机&排队&观看)']) {
      row['各房间人均停留时间(上机&排队&观看)'] = formatInt(row['各房间人均停留时间(上机&排队&观看)'])
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.toyGrab.buriaPointAnalysis.roomPVUV.order
    let query = sql.toyGrab.buriaPointAnalysis.roomPVUV.selectDayFront + queries + order + sql.toyGrab.buriaPointAnalysis.roomPVUV.limit
    func.connPool1(query, [tableName.roomPVUV, params.offset, params.limit], function (err, rs) {
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
    let query
    if (params.startTime[0] === params.endTime[0] || params.startTime[0] === moment(new Date()).format('YYYY-MM-DD')  || (!params.startTime[0] && !params.endTime[0])) {
      query = sql.toyGrab.buriaPointAnalysis.roomPVUV.getCount + queries
    } else {
      query = sql.toyGrab.buriaPointAnalysis.roomPVUV.getCountD + queries
    }
    func.connPool1(query, [tableName.roomPVUV], function (err, rs) {
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
    let query = sql.toyGrab.buriaPointAnalysis.roomPVUV.selectAllExcel + queries + sql.toyGrab.buriaPointAnalysis.roomPVUV.order
    func.connPool1(query, tableName.roomPVUV, function (err, rs) {
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
    let order = params.order || sql.toyGrab.buriaPointAnalysis.roomPVUV.order
    let query = sql.toyGrab.buriaPointAnalysis.roomPVUV.selectDayFrontSUM + queries + sql.toyGrab.buriaPointAnalysis.roomPVUV.groupBy + order + sql.toyGrab.buriaPointAnalysis.roomPVUV.limit
    func.connPool1(query, [t, tableName.roomPVUV, params.offset, params.limit], function (err, rs) {
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
    let query = sql.toyGrab.buriaPointAnalysis.roomPVUV.selectAllExcelSUM + queries + sql.toyGrab.buriaPointAnalysis.roomPVUV.groupBy
    func.connPool1(query, [t, tableName.roomPVUV], function (err, rs) {
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
