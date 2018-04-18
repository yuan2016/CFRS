let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let {exportJsonToExcel} = require('../../../../utils/excel')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.dataCheckXNCount = 0

function formatData(rows) {
  return rows.map(row => {
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD ')
    }
    if (row.CREATE_TIME) {
      row.CREATE_TIME = moment(row.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.XQ_AMT) {
      row.XQ_AMT = formatCurrency(row.XQ_AMT)
    }
    if (row.XQINT_TQ) {
      row.XQINT_TQ = formatCurrency(row.XQINT_TQ)
    }
    if (row.XQINT_DQ) {
      row.XQINT_DQ = formatCurrency(row.XQINT_DQ)
    }
    if (row.XQINT_YQ) {
      row.XQINT_YQ = formatCurrency(row.XQINT_YQ)
    }
    if (row.LQCZ_AMT) {
      row.LQCZ_AMT = formatCurrency(row.LQCZ_AMT)
    }
    if (row.TOTAL_AMT) {
      row.TOTAL_AMT = formatCurrency(row.TOTAL_AMT)
    }
    if (row.LL_XN) {
      row.LL_XN = formatCurrency(row.LL_XN)
    }
    if (row.YMT_XN) {
      row.YMT_XN = formatCurrency(row.YMT_XN)
    }
    if (row.TOTAL_AMT_D) {
      row.TOTAL_AMT_D = formatCurrency(row.TOTAL_AMT_D)
    }

    if (row.D_MONTH) {
      row.D_MONTH = row.D_MONTH + '月'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD ')
    }
    // money
    if (row["续期费用(元)"]) {
      row["续期费用(元)"] = formatCurrency(row["续期费用(元)"])
    }
    if (row["提前续期利息(元)"]) {
      row["提前续期利息(元)"] = formatCurrency(row["提前续期利息(元)"])
    }
    if (row["到期续期利息(元)"]) {
      row["到期续期利息(元)"] = formatCurrency(row["到期续期利息(元)"])
    }
    if (row["逾期续期利息(元)"]) {
      row["逾期续期利息(元)"] = formatCurrency(row["逾期续期利息(元)"])
    }
    if (row["零钱充值(元)"]) {
      row["零钱充值(元)"] = formatCurrency(row["零钱充值(元)"])
    }
    if (row["合计(元)"]) {
      row["合计(元)"] = formatCurrency(row["合计(元)"])
    }
    if (row["XN连连(元)"]) {
      row["XN连连(元)"] = formatCurrency(row["XN连连(元)"])
    }
    if (row["XN益码通(元)"]) {
      row["XN益码通(元)"] = formatCurrency(row["XN益码通(元)"])
    }
    if (row["差异值(元)"]) {
      row["差异值(元)"] = formatCurrency(row["差异值(元)"])
    }

    if (row.月份) {
      row.月份 = row.月份 + '月'
    }
    return row
  })
}

function changeItem (a) {
  if (a) {
    if (typeof a === 'number') {
      return a
    }
    return parseFloat(a.split(',').join(''))
  }
  return a
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.dataCheckXN.order
    let query = sql.period.dataCheckXN.selectSum + queries + ' UNION ALL ' + '(' + sql.period.dataCheckXN.selectAll + queries + order + sql.period.dataCheckXN.selectAllBack + ')'
    func.connPool1(query, [tableName.period.dataCheckXN, tableName.period.dataCheckXN, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.dataCheckXN.getCount + queries
    func.connPool1(query, [tableName.period.dataCheckXN], function (err, rs) {
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
  refreshData(req, res) {
    if (global.dataCheckXNCount === 0) {
      global.dataCheckXNCount++
      pro.exec(shell.dataCheckXN, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期XN还款数据核对shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.dataCheckXNCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期XN还款数据核对shell脚本执行成功')
          res.json({code: '200'})
          global.dataCheckXNCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期XN还款数据核对开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.dataCheckXN.selectSumExcel + queries + ' UNION ALL ' + '(' + sql.period.dataCheckXN.selectAllExcel + queries + sql.period.dataCheckXN.order + ')'
    func.connPool1(query, [tableName.period.dataCheckXN, tableName.period.dataCheckXN], function (err, rs) {
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
