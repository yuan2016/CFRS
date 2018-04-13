/**
 * Created by Administrator on 2017/7/12.
 */
let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, handleProperty, handleTime, combine, handleTimeMS, mosaicName} = require('../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

function formatData (rows) {
  return rows.map(row => {
    if (row.created_at) {
      row.created_at = moment(row.created_at).format('YYYY-MM-DD HH:mm:ss')
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.创建时间) {
    row.创建时间 = moment(row.创建时间).format('YYYY-MM-DD HH:mm:ss')
  }
  return row
})
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 't.created_at', 'a')
    let order = params.order || ''
    let query = sql.promotionManagement.promotionChannel.selectAllFront + queries + order + sql.promotionManagement.promotionChannel.selectAllBack

    func.connPool2(query, [tableName.promotionChannel.t, tableName.promotionChannel.t1, params.offset, params.limit], function (err, rs) {
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
  //用户通讯录总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 't.created_at', 'a')
    let query = sql.promotionManagement.promotionChannel.getCount + queries
    func.connPool2(query, [tableName.promotionChannel.t, tableName.promotionChannel.t1], function (err, rs) {
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
    let queries = analysis(params, 't.created_at', 'a')
    let query = sql.promotionManagement.promotionChannel.selectAllExcel + queries
    func.connPool2(query, [tableName.promotionChannel.t, tableName.promotionChannel.t1], function (err, rs) {
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
/**
 * Created by Administrator on 2017/7/10.
 */

