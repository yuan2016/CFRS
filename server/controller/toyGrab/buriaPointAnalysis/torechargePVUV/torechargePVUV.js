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
    if (row.residencetime) {
      row.residencetime = formatInt(row.residencetime)
    }
    if (row.clickelement) {
      row.clickelement = row.clickelement.replace(/\s/g,'')
      switch (row.clickelement)
      {
        case 'e_roomSelect_toRecharge':
          row.clickelement = '首页充值'
          break
        case 'e_room_toRecharge':
          row.clickelement = '房间页充值'
          break
        case 'e_my_gameCurrency_recharge':
          row.clickelement = '我的充值'
          break
        case 'p_recharge_alipay':
          row.clickelement = '支付宝支付'
          break
        case 'p_recharge_wechatpay':
          row.clickelement = '微信支付'
          break
        case 'p_recharge_success':
          row.clickelement = '支付成功'
          break
      }
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
    if (row.停留时间) {
      row.停留时间 = formatInt(row.停留时间)
    }
    if (row.充值操作) {
      row.充值操作 = row.充值操作.replace(/\s/g,'')
      switch (row.充值操作)
      {
        case 'e_roomSelect_toRecharge':
          row.充值操作 = '首页充值'
          break
        case 'e_room_toRecharge':
          row.充值操作 = '房间页充值'
          break
        case 'e_my_gameCurrency_recharge':
          row.充值操作 = '我的充值'
          break
        case 'p_recharge_alipay':
          row.充值操作 = '支付宝支付'
          break
        case 'p_recharge_wechatpay':
          row.充值操作 = '微信支付'
          break
        case 'p_recharge_success':
          row.充值操作 = '支付成功'
          break
      }
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.toyGrab.buriaPointAnalysis.torechargePVUV.order
    let query = sql.toyGrab.buriaPointAnalysis.torechargePVUV.selectDayFront + queries + order + sql.toyGrab.buriaPointAnalysis.torechargePVUV.limit
    func.connPool1(query, [tableName.torechargePVUV, params.offset, params.limit], function (err, rs) {
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
    let query = sql.toyGrab.buriaPointAnalysis.torechargePVUV.getCount + queries
    func.connPool1(query, [tableName.torechargePVUV], function (err, rs) {
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
    let query = sql.toyGrab.buriaPointAnalysis.torechargePVUV.selectAllExcel + queries + sql.toyGrab.buriaPointAnalysis.torechargePVUV.order
    func.connPool1(query, tableName.torechargePVUV, function (err, rs) {
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
    let order = params.order || sql.toyGrab.buriaPointAnalysis.torechargePVUV.order
    let query = sql.toyGrab.buriaPointAnalysis.torechargePVUV.selectDayFrontSUM + queries + sql.toyGrab.buriaPointAnalysis.torechargePVUV.groupBy + order
    func.connPool1(query, [t, tableName.torechargePVUV], function (err, rs) {
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
    let query = sql.toyGrab.buriaPointAnalysis.torechargePVUV.selectAllExcelSUM + queries + sql.toyGrab.buriaPointAnalysis.torechargePVUV.groupBy
    func.connPool1(query, [t, tableName.torechargePVUV], function (err, rs) {
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
