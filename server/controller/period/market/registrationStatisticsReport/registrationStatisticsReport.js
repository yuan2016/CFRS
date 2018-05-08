let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

function formatData(rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.loans_total) {
      row.loans_total = formatCurrency(row.loans_total)
    }
    if (row.loans_total_ouser) {
      row.loans_total_ouser = formatCurrency(row.loans_total_ouser)
    }
    if (row.loans_total_nuser) {
      row.loans_total_nuser = formatCurrency(row.loans_total_nuser)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.修改时间) {
      row.修改时间 = moment(row.修改时间).format('YYYY-MM-DD HH:mm:ss')
    }
    /*if (row.注册人数) {
      row.注册人数 = formatInt(row.注册人数)
    }
    if (row['放款总额(元)']) {
      row['放款总额(元)'] = formatCurrency(row['放款总额(元)'])
    }
    if (row['老用户放款总额(元)']) {
      row['老用户放款总额(元)'] = formatCurrency(row['老用户放款总额(元)'])
    }
    if (row['新用户放款总额(元)']) {
      row['新用户放款总额(元)'] = formatCurrency(row['新用户放款总额(元)'])
    }*/
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.registrationStatisticsReport.orderBy
    let query = sql.period.registrationStatisticsReport.selectAll + queries + order + sql.period.registrationStatisticsReport.selectAllBack
    func.connPool1(query, [tableName.period.registrationStatisticsReport, params.offset, params.limit], function (err, rs) {
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
  //每日还款金额数据总条数
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.registrationStatisticsReport.getCount + queries
    func.connPool1(query, [tableName.period.registrationStatisticsReport], function (err, rs) {
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
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.registrationStatisticsReport.selectAllExcel + queries
    func.connPool1(query, [tableName.period.registrationStatisticsReport], function (err, rs) {
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
            return false
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
