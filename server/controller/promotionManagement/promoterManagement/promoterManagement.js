/**
 * Created by Administrator on 2017/7/12.
 */
let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, mosaic, mosaicName} = require('../../../utils/utils')
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

function packageRows (rows) {
  let options = [{value: '', label: '不限'}]
  for (let row of rows) {
    let option = {}
    if (row.channel_name && row.channel_name !== '') {
      option.value = row.channel_name
      option.label = row.channel_name
      options.push(option)
    }
  }
  return options
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 't.created_at', 'a')
    let add = mosaic(params, 'channel_name', 't2')
    let order = params.order || ''
    let query = sql.promotionManagement.promoterManagement.selectAllFront + queries + ' and ' + add+ order + sql.promotionManagement.promoterManagement.selectAllBack
    func.connPool2(query, [tableName.promoterManagement.t, tableName.promoterManagement.t1, tableName.promoterManagement.t2, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 't.created_at', 'a')
    let add = mosaic(params, 'channel_name', 't2')
    let query = sql.promotionManagement.promoterManagement.getCount + queries + ' and ' + add
    func.connPool2(query, [tableName.promoterManagement.t, tableName.promoterManagement.t1, tableName.promoterManagement.t2], function (err, rs) {
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
  //拿到下拉框数据
  getSelectOptions (req, res) {
    func.connPool2(sql.promotionManagement.promoterManagement.getSelectOptions, tableName.promoterManagement.t2, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageRows(rs)
      res.json(rs)
    })
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 't.created_at', 'a')
    let add = mosaic(params, 'channel_name', 't2')
    let query = sql.promotionManagement.promoterManagement.selectAllExcel + queries + ' and ' + add
    func.connPool2(query, [tableName.promoterManagement.t, tableName.promoterManagement.t1, tableName.promoterManagement.t2], function (err, rs) {
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

