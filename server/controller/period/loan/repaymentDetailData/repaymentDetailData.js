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

global.repaymentDetailDataCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD')
    }
    if (row.CREATE_TIME) {
      row.CREATE_TIME = moment(row.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_time) {
      row.repayment_time = moment(row.repayment_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_real_time) {
      row.repayment_real_time = moment(row.repayment_real_time).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.loan_money) {
      row.loan_money = formatCurrency(row.loan_money)
    }
    if (row.repayment_amount) {
      row.repayment_amount = formatCurrency(row.repayment_amount)
    }
    if (row.repaymented_amount) {
      row.repaymented_amount = formatCurrency(row.repaymented_amount)
    }
    if (row.PACKAGE_MONEY) {
      row.PACKAGE_MONEY = formatCurrency(row.PACKAGE_MONEY)
    }
    if (row.Principal_amount) {
      row.Principal_amount = formatCurrency(row.Principal_amount)
    }
    if (row.loan_accrual) {
      row.loan_accrual = formatCurrency(row.loan_accrual)
    }
    if (row.Overdue_fine) {
      row.Overdue_fine = formatCurrency(row.Overdue_fine)
    }
    if (row.renewal_fee) {
      row.renewal_fee = formatCurrency(row.renewal_fee)
    }
    if (row.repayment_real_money) {
      row.repayment_real_money = formatCurrency(row.repayment_real_money)
    }
    if (row.return_money) {
      row.return_money = formatCurrency(row.return_money)
    }
    if (row.coupon_money) {
      row.coupon_money = formatCurrency(row.coupon_money)
    }
    if (row.Reduction_money) {
      row.Reduction_money = formatCurrency(row.Reduction_money)
    }
    //率
    if (row.year_rate) {
      row.year_rate = (row.year_rate * 100).toFixed(2) + '%'
    }
    if (row.Renewal_rate) {
      row.Renewal_rate = (row.Renewal_rate * 100).toFixed(2) + '%'
    }
    if (row.Overdue_rate) {
      row.Overdue_rate = (row.Overdue_rate * 100).toFixed(2) + '%'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row['日期']) {
      row['日期'] = moment(row['日期']).format('YYYY-MM-DD')
    }
    if (row['应还款时间']) {
      row['应还款时间'] = moment(row['应还款时间']).format('YYYY-MM-DD')
    }
    if (row['实际还款时间']) {
      row['实际还款时间'] = moment(row['实际还款时间']).format('YYYY-MM-DD')
    }
    if (row['创建时间']) {
      row['创建时间'] = moment(row['创建时间']).format('YYYY-MM-DD')
    }
    if (row['修改时间']) {
      row['修改时间'] = moment(row['修改时间']).format('YYYY-MM-DD')
    }
    // money
    if (row['借款金额(元)']) {
      row['借款金额(元)'] = formatCurrency(row['借款金额(元)'])
    }
    if (row['总还款金额(元)']) {
      row['总还款金额(元)'] = formatCurrency(row['总还款金额(元)'])
    }
    if (row['已还金额(元)']) {
      row['已还金额(元)'] = formatCurrency(row['已还金额(元)'])
    }
    if (row['礼包购买(元)']) {
      row['礼包购买(元)'] = formatCurrency(row['礼包购买(元)'])
    }
    if (row['还款本金(元)']) {
      row['还款本金(元)'] = formatCurrency(row['还款本金(元)'])
    }
    if (row['还款利息(元)']) {
      row['还款利息(元)'] = formatCurrency(row['还款利息(元)'])
    }
    if (row['逾期滞纳金(元)']) {
      row['逾期滞纳金(元)'] = formatCurrency(row['逾期滞纳金(元)'])
    }
    if (row['续期手续费(元)']) {
      row['续期手续费(元)'] = formatCurrency(row['续期手续费(元)'])
    }
    if (row['实还金额(元)']) {
      row['实还金额(元)'] = formatCurrency(row['实还金额(元)'])
    }
    if (row['退款金额(元)']) {
      row['退款金额(元)'] = formatCurrency(row['退款金额(元)'])
    }
    if (row['优惠券金额(元)']) {
      row['优惠券金额(元)'] = formatCurrency(row['优惠券金额(元)'])
    }
    if (row['减免金额(元)']) {
      row['减免金额(元)'] = formatCurrency(row['减免金额(元)'])
    }
    //率
    if (row['年利率']) {
      row['年利率'] = (row['年利率'] * 100).toFixed(2) + '%'
    }
    if (row['续期费率']) {
      row['续期费率'] = (row['续期费率'] * 100).toFixed(2) + '%'
    }
    if (row['逾期费率']) {
      row['逾期费率'] = (row['逾期费率'] * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  //每日还款明细记录
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.repaymentDetailData.order
    let query = sql.period.repaymentDetailData.selectAll + queries + order + sql.period.repaymentDetailData.selectAllBack
    func.connPool1(query, [tableName.period.repaymentDetailData, params.offset, params.limit], function (err, rs) {
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
  //每日还款明细记录总条数
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.repaymentDetailData.getCount + queries
    func.connPool1(query, [tableName.period.repaymentDetailData], function (err, rs) {
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
    if (global.repaymentDetailDataCount === 0) {
      global.repaymentDetailDataCount++
      pro.exec(shell.repaymentDetailData, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.repaymentDetailDataCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录shell脚本执行成功')
          res.json({code: '200'})
          global.repaymentDetailDataCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日还款明细记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.repaymentDetailData.selectAllExcel + queries + sql.period.repaymentDetailData.order
    func.connPool1(query, [tableName.period.repaymentDetailData], function (err, rs) {
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
