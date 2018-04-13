let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, mosaicName, analysis} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.fundCount = 0

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.更新时间) {
      row.更新时间 = moment(row.更新时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.还款比例) {
      row.还款比例 = (row.还款比例 * 100).toFixed(2) + '%'
    }
    if (row.续期比例) {
      row.续期比例 = (row.续期比例 * 100).toFixed(2) + '%'
    }
    if (row.逾期比例) {
      row.逾期比例 = (row.逾期比例 * 100).toFixed(2) + '%'
    }

    if (row['当日应还总额(元)']) {
      row['当日应还总额(元)'] = formatCurrency(row['当日应还总额(元)'])
    }
    if (row['实际还款金额(元)']) {
      row['实际还款金额(元)'] = formatCurrency(row['实际还款金额(元)'])
    }
    if (row['续期金额(元)']) {
      row['续期金额(元)'] = formatCurrency(row['续期金额(元)'])
    }
    if (row['续期手续费收入(元)']) {
      row['续期手续费收入(元)'] = formatCurrency(row['续期手续费收入(元)'])
    }
    if (row['逾期金额(元)']) {
      row['逾期金额(元)'] = formatCurrency(row['逾期金额(元)'])
    }
    if (row['逾期还款金额(元)']) {
      row['逾期还款金额(元)'] = formatCurrency(row['逾期还款金额(元)'])
    }
    if (row['滞纳金收入(元)']) {
      row['滞纳金收入(元)'] = formatCurrency(row['滞纳金收入(元)'])
    }
    if (row['综合服务费收入(元)']) {
      row['综合服务费收入(元)'] = formatCurrency(row['综合服务费收入(元)'])
    }
    if (row['实收服务费(元)']) {
      row['实收服务费(元)'] = formatCurrency(row['实收服务费(元)'])
    }
    if (row['同等金额收益(元)']) {
      row['同等金额收益(元)'] = formatCurrency(row['同等金额收益(元)'])
    }
    if (row['当日资金盈余(元)']) {
      row['当日资金盈余(元)'] = formatCurrency(row['当日资金盈余(元)'])
    }
    return row
  })
}

function formatData (rows) {
  return rows.map(row => {
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.repayment_ratio) {
      row.repayment_ratio = (row.repayment_ratio * 100).toFixed(2) + '%'
    }
    if (row.renewal_ratio) {
      row.renewal_ratio = (row.renewal_ratio * 100).toFixed(2) + '%'
    }
    if (row.overdue_proportion) {
      row.overdue_proportion = (row.overdue_proportion * 100).toFixed(2) + '%'
    }

    if (row.total_amount) {
      row.total_amount = formatCurrency(row.total_amount)
    }
    if (row.actual_repayment_amount) {
      row.actual_repayment_amount = formatCurrency(row.actual_repayment_amount)
    }
    if (row.renewal_amount) {
      row.renewal_amount = formatCurrency(row.renewal_amount)
    }
    if (row.renewal_commission) {
      row.renewal_commission = formatCurrency(row.renewal_commission)
    }
    if (row.overdue_amount) {
      row.overdue_amount = formatCurrency(row.overdue_amount)
    }
    if (row.overdue_payment_amount) {
      row.overdue_payment_amount = formatCurrency(row.overdue_payment_amount)
    }
    if (row.late_fees_income) {
      row.late_fees_income = formatCurrency(row.late_fees_income)
    }
    if (row.comp_service_income) {
      row.comp_service_income = formatCurrency(row.comp_service_income)
    }
    if (row.service_charge) {
      row.service_charge = formatCurrency(row.service_charge)
    }
    if (row.equal_amount_income) {
      row.equal_amount_income = formatCurrency(row.equal_amount_income)
    }
    if (row.capital_surplus) {
      row.capital_surplus = formatCurrency(row.capital_surplus)
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
    func.connPool1(query, [tableName.fundAnalysis, params.offset, params.limit], function (err, rs) {
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
    let query = sql.dataAnalysis.getCount + queries
    func.connPool1(query, [tableName.fundAnalysis], function (err, rs) {
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
    if (global.fundCount === 0) {
      global.fundCount++
      pro.exec(shell.fundAnalysis, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 资金分析shell脚本执行失败')
          res.json({code: '500'})
          global.fundCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 资金分析shell脚本执行成功')
          res.json({code: '200'})
          global.fundCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 资金分析开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.fundAnalysisExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.fundAnalysis], function (err, rs) {
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
