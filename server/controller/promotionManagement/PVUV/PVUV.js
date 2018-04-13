let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, formatInt, handleProperty, handleTime, combine, handleTimeMS, mosaicName} = require('../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.pv) {
      row.pv = formatInt(row.pv)
    }
    if (row.uv) {
      row.uv = formatInt(row.uv)
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
    row.日期 = moment(row.日期).format('YYYY-MM-DD')
  }
  if (row.用户点击量pv) {
    row.用户点击量pv = formatInt(row.用户点击量pv)
  }
  if (row.线上用户量统计) {
    row.线上用户量统计 = formatInt(row.线上用户量统计)
  }
  return row
})
}

function packageRows (rows) {
  let options = [{value: '', label: '不限'}]
  for (let row of rows) {
    let option = {}
    if (row.title && row.title !== '') {
      option.value = row.title
      option.label = row.title
      options.push(option)
    }
  }
  return options
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.promotionManagement.PVUV.order
    let query = sql.promotionManagement.PVUV.selectDayFront + queries + order + sql.promotionManagement.PVUV.limit
    func.connPool1(query, [tableName.PVUV, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.promotionManagement.PVUV.getCount + queries
    func.connPool1(query, [tableName.PVUV], function (err, rs) {
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
  getSelectOptions (req, res) {
    func.connPool1(sql.promotionManagement.PVUV.getSelectOptions, tableName.PVUV, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageRows(rs)
      res.json(rs)
    })
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'a')
    let query = sql.promotionManagement.PVUV.selectAllExcel + queries + sql.promotionManagement.PVUV.order
    func.connPool1(query, tableName.PVUV, function (err, rs) {
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
