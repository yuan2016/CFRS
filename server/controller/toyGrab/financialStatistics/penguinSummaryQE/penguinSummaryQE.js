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


function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    //num
    if (row.games_num) {
      row.games_num = formatInt(row.games_num)
    }
    if (row.nograsp_num) {
      row.nograsp_num = formatInt(row.nograsp_num)
    }
    if (row.grasp_num) {
      row.grasp_num = formatInt(row.grasp_num)
    }
    if (row.send_num) {
      row.send_num = formatInt(row.send_num)
    }
    if (row.sign_num) {
      row.sign_num = formatInt(row.sign_num)
    }
    if (row.combine_num) {
      row.combine_num = formatInt(row.combine_num)
    }

    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    //num
    if (row.总抓取次数) {
      row.总抓取次数 = formatInt(row.总抓取次数)
    }
    if (row.未抓中次数) {
      row.未抓中次数 = formatInt(row.未抓中次数)
    }
    if (row.抓中次数) {
      row.抓中次数 = formatInt(row.抓中次数)
    }
    if (row.发货个数) {
      row.发货个数 = formatInt(row.发货个数)
    }
    if (row.签收次数) {
      row.签收次数 = formatInt(row.签收次数)
    }
    if (row.合成次数) {
      row.合成次数 = formatInt(row.合成次数)
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.financeAnalysis.penguinSummaryQE.order
    let query = sql.financeAnalysis.penguinSummaryQE.selectAll + queries + order + sql.financeAnalysis.penguinSummaryQE.selectAllBack
    func.connPool1(query, [tableName.penguinSummaryQE, params.offset, params.limit], function (err, rs) {
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
    let query = sql.financeAnalysis.penguinSummaryQE.getCount + queries
    func.connPool1(query, [tableName.penguinSummaryQE], function (err, rs) {
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
    let query = sql.financeAnalysis.penguinSummaryQE.selectAllExcel + queries + sql.financeAnalysis.penguinSummaryQE.order
    func.connPool1(query, [tableName.penguinSummaryQE], function (err, rs) {
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
