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

global.couponStatisticsCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.CREATE_TIME) {
      row.CREATE_TIME = moment(row.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.allmq_amt) {
      row.allmq_amt = formatCurrency(row.allmq_amt)
    }
    if (row.xzmq_amt) {
      row.xzmq_amt = formatCurrency(row.xzmq_amt)
    }
    if (row.allpf_amt) {
      row.allpf_amt = formatCurrency(row.allpf_amt)
    }
    if (row.xzpf_amt) {
      row.xzpf_amt = formatCurrency(row.xzpf_amt)
    }
    if (row.allhk_amt) {
      row.allhk_amt = formatCurrency(row.allhk_amt)
    }
    if (row.xzhk_amt) {
      row.xzhk_amt = formatCurrency(row.xzhk_amt)
    }

    if (row.rate_1) {
      row.rate_1 = (row.rate_1 * 100).toFixed(2) + '%'
    }
    if (row.rate_2) {
      row.rate_2 = (row.rate_2 * 100).toFixed(2) + '%'
    }
    if (row.rate_3) {
      row.rate_3 = (row.rate_3 * 100).toFixed(2) + '%'
    }
    if (row.rate_4) {
      row.rate_4 = (row.rate_4 * 100).toFixed(2) + '%'
    }
    if (row.rate_5) {
      row.rate_5 = (row.rate_5 * 100).toFixed(2) + '%'
    }
    if (row.rate_6) {
      row.rate_6 = (row.rate_6 * 100).toFixed(2) + '%'
    }

    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.更新时间) {
      row.更新时间 = moment(row.更新时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.总卖券金额) {
      row.总卖券金额 = formatCurrency(row.总卖券金额)
    }
    if (row.新增卖券金额) {
      row.新增卖券金额 = formatCurrency(row.新增卖券金额)
    }
    if (row.总赔付金额) {
      row.总赔付金额 = formatCurrency(row.总赔付金额)
    }
    if (row.新增赔付金额) {
      row.新增赔付金额 = formatCurrency(row.新增赔付金额)
    }
    if (row.总累加还款金额) {
      row.总累加还款金额 = formatCurrency(row.总累加还款金额)
    }
    if (row.新增还款金额) {
      row.新增还款金额 = formatCurrency(row.新增还款金额)
    }
    if (row['总已买券人数/总可买券人数']) {
      row['总已买券人数/总可买券人数'] = (row['总已买券人数/总可买券人数'] * 100).toFixed(2) + '%'
    }
    if (row['当日已买券人数/总可买券人数']) {
      row['当日已买券人数/总可买券人数'] = (row['当日已买券人数/总可买券人数'] * 100).toFixed(2) + '%'
    }
    if (row['总还款用券人数/总已买券人数']) {
      row['总还款用券人数/总已买券人数'] = (row['总还款用券人数/总已买券人数'] * 100).toFixed(2) + '%'
    }
    if (row['当日还款用券人数/总已买券人数']) {
      row['当日还款用券人数/总已买券人数'] = (row['当日还款用券人数/总已买券人数'] * 100).toFixed(2) + '%'
    }
    if (row['总还款用券人数/总可买券人数']) {
      row['总还款用券人数/总可买券人数'] = (row['总还款用券人数/总可买券人数'] * 100).toFixed(2) + '%'
    }
    if (row['当日还款用券人数/总可买券人数']) {
      row['当日还款用券人数/总可买券人数'] = (row['当日还款用券人数/总可买券人数'] * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack
    func.connPool1(query, [tableName.couponStatistics, params.offset, params.limit], function (err, rs) {
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
    let query = sql.dataAnalysis.getCount + queries
    func.connPool1(query, [tableName.couponStatistics], function (err, rs) {
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
    if (global.couponStatisticsCount === 0) {
      global.couponStatisticsCount++
      pro.exec(shell.couponStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 必过券统计shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.couponStatisticsCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 必过券统计shell脚本执行成功')
          res.json({code: '200'})
          global.couponStatisticsCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 必过券统计开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.couponStatisticsExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.couponStatistics], function (err, rs) {
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
