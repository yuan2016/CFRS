let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, analysis, mosaicName, formatInt} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
global.dailyRepaymentUnitCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.overdue_num) {
      row.overdue_num = formatInt(row.overdue_num)
    }
    if (row.overdue_num_7day) {
      row.overdue_num_7day = formatInt(row.overdue_num_7day)
    }
    if (row.overdue_num_14day) {
      row.overdue_num_14day = formatInt(row.overdue_num_14day)
    }

    if (row.overdue_rate) {
      row.overdue_rate = (row.overdue_rate * 100).toFixed(2) + '%'
    }
    if (row.repayment_rate) {
      row.repayment_rate = (row.repayment_rate * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_7day) {
      row.overdue_rate_7day = (row.overdue_rate_7day * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_14day) {
      row.overdue_rate_14day = (row.overdue_rate_14day * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_ouser) {
      row.overdue_rate_ouser = (row.overdue_rate_ouser * 100).toFixed(2) + '%'
    }
    if (row.repayment_rate_ouser) {
      row.repayment_rate_ouser = (row.repayment_rate_ouser * 100).toFixed(2) + '%'
    }
    if (row.overdue_rate_nuser) {
      row.overdue_rate_nuser = (row.overdue_rate_nuser * 100).toFixed(2) + '%'
    }
    if (row.repayment_rate_nuser) {
      row.repayment_rate_nuser = (row.repayment_rate_nuser * 100).toFixed(2) + '%'
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
    row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.刷新时间) {
      row.刷新时间 = moment(row.刷新时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.逾期单数) {
      row.逾期单数 = formatInt(row.逾期单数)
    }
    if (row['7天期限逾期单数']) {
      row['7天期限逾期单数'] = formatInt(row['7天期限逾期单数'])
    }
    if (row['14天期限逾期单数']) {
      row['14天期限逾期单数'] = formatInt(row['14天期限逾期单数'])
    }

    if (row.逾期率) {
      row.逾期率 = (row.逾期率 * 100).toFixed(2) + '%'
    }
    if (row.还款率) {
      row.还款率 = (row.还款率 * 100).toFixed(2) + '%'
    }
    if (row['7天期限逾期率']) {
      row['7天期限逾期率'] = (row['7天期限逾期率'] * 100).toFixed(2) + '%'
    }
    if (row['14天期限逾期率']) {
      row['14天期限逾期率'] = (row['14天期限逾期率'] * 100).toFixed(2) + '%'
    }
    if (row.老用户逾期率) {
      row.老用户逾期率 = (row.老用户逾期率 * 100).toFixed(2) + '%'
    }
    if (row.老用户还款率) {
      row.老用户还款率 = (row.老用户还款率 * 100).toFixed(2) + '%'
    }
    if (row.新用户逾期率) {
      row.新用户逾期率 = (row.新用户逾期率 * 100).toFixed(2) + '%'
    }
    if (row.新用户还款率) {
      row.新用户还款率 = (row.新用户还款率 * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack
    func.connPool1(query, [tableName.dailyRepaymentUnitDataXJJB, params.offset, params.limit], function (err, rs) {
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
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.getCount +queries
    func.connPool1(query, [tableName.dailyRepaymentUnitDataXJJB], function (err, rs) {
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
    if (global.dailyRepaymentUnitCount === 0) {
      global.dailyRepaymentUnitCount++
      pro.exec(shell.dailyRepaymentUnitDataXJJB, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款单位数据-借呗shell脚本执行失败')
          res.json({code: '500'})
          global.dailyRepaymentUnitCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款单位数据-借呗shell脚本执行成功')
          res.json({code: '200'})
          global.dailyRepaymentUnitCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款单位数据-借呗开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.dailyRepaymentUnitDataExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.dailyRepaymentUnitDataXJJB], function (err, rs) {
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
