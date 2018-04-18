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

global.repaymentReconciliationZFBCount = 0

function formatData(rows) {
  return rows.map(row => {
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD ')
    }
    if (row.CREATE_TIME) {
      row.CREATE_TIME = moment(row.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.ADVANCE_REPAYMENT_AMT) {
      row.ADVANCE_REPAYMENT_AMT = formatCurrency(row.ADVANCE_REPAYMENT_AMT)
    }
    if (row.ADVANCE_REPAYMENT_INTEREST) {
      row.ADVANCE_REPAYMENT_INTEREST = formatCurrency(row.ADVANCE_REPAYMENT_INTEREST)
    }
    if (row.REPAYMENT_AMT) {
      row.REPAYMENT_AMT = formatCurrency(row.REPAYMENT_AMT)
    }
    if (row.REPAYMENT_INTEREST) {
      row.REPAYMENT_INTEREST = formatCurrency(row.REPAYMENT_INTEREST)
    }
    if (row.OVERDUE_REPAYMENT_AMT) {
      row.OVERDUE_REPAYMENT_AMT = formatCurrency(row.OVERDUE_REPAYMENT_AMT)
    }
    if (row.OVERDUE_REPAYMENT_INTEREST) {
      row.OVERDUE_REPAYMENT_INTEREST = formatCurrency(row.OVERDUE_REPAYMENT_INTEREST)
    }
    if (row.OVERDUE_LATE_FEE) {
      row.OVERDUE_LATE_FEE = formatCurrency(row.OVERDUE_LATE_FEE)
    }
    if (row.RENEWAL_FEE) {
      row.RENEWAL_FEE = formatCurrency(row.RENEWAL_FEE)
    }
    if (row.TOTAL_AMT) {
      row.TOTAL_AMT = formatCurrency(row.TOTAL_AMT)
    }
    if (row.ZFB_ZCM) {
      row.ZFB_ZCM = formatCurrency(row.ZFB_ZCM)
    }
    if (row.ZFB_XW) {
      row.ZFB_XW = formatCurrency(row.ZFB_XW)
    }
    if (row.EW_AMT) {
      row.EW_AMT = formatCurrency(row.EW_AMT)
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
    if (row.创建时间) {
      row.创建时间 = moment(row.创建时间).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row['提前还款本金(元)']) {
      row['提前还款本金(元)'] = formatCurrency(row['提前还款本金(元)'])
    }
    if (row['提前还款利息(元)']) {
      row['提前还款利息(元)'] = formatCurrency(row['提前还款利息(元)'])
    }
    if (row['正常还款本金(元)']) {
      row['正常还款本金(元)'] = formatCurrency(row['正常还款本金(元)'])
    }
    if (row['正常还款利息(元)']) {
      row['正常还款利息(元)'] = formatCurrency(row['正常还款利息(元)'])
    }
    if (row['逾期还款本金(元)']) {
      row['逾期还款本金(元)'] = formatCurrency(row['逾期还款本金(元)'])
    }
    if (row['逾期还款利息(元)']) {
      row['逾期还款利息(元)'] = formatCurrency(row['逾期还款利息(元)'])
    }
    if (row['逾期滞纳金(元)']) {
      row['逾期滞纳金(元)'] = formatCurrency(row['逾期滞纳金(元)'])
    }
    if (row['续期费(元)']) {
      row['续期费(元)'] = formatCurrency(row['续期费(元)'])
    }
    if (row['合计(元)']) {
      row['合计(元)'] = formatCurrency(row['合计(元)'])
    }
    if (row['招财猫支付宝(元)']) {
      row['招财猫支付宝(元)'] = formatCurrency(row['招财猫支付宝(元)'])
    }
    if (row['新网支付宝(元)']) {
      row['新网支付宝(元)'] = formatCurrency(row['新网支付宝(元)'])
    }
    if (row['额外收入(元)']) {
      row['额外收入(元)'] = formatCurrency(row['额外收入(元)'])
    }
    if (row['差异值(元)']) {
      row['差异值(元)'] = formatCurrency(row['差异值(元)'])
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
    let order = params.order || sql.period.repaymentReconciliationZFB.order
    let query = sql.period.repaymentReconciliationZFB.selectSum + queries + ' UNION ALL ' + '(' + sql.period.repaymentReconciliationZFB.selectAll + queries + order + sql.period.repaymentReconciliationZFB.selectAllBack + ')'
    func.connPool1(query, [tableName.period.repaymentReconciliationZFB, tableName.period.repaymentReconciliationZFB, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.repaymentReconciliationZFB.getCount + queries
    func.connPool1(query, [tableName.period.repaymentReconciliationZFB], function (err, rs) {
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
    if (global.repaymentReconciliationZFBCount === 0) {
      global.repaymentReconciliationZFBCount++
      pro.exec(shell.repaymentReconciliationZFB, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期支付宝还款对账shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.repaymentReconciliationZFBCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期支付宝还款对账shell脚本执行成功')
          res.json({code: '200'})
          global.repaymentReconciliationZFBCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期支付宝还款对账开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.repaymentReconciliationZFB.order
    let query = sql.period.repaymentReconciliationZFB.selectSumExcel + queries + ' UNION ALL ' + '(' + sql.period.repaymentReconciliationZFB.selectAllExcel + queries + order + ')'
    func.connPool1(query, [tableName.period.repaymentReconciliationZFB, tableName.period.repaymentReconciliationZFB], function (err, rs) {
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
  },
  //数据变更
  modify (req, res) {
    let params = req.body.formData
    let query = sql.period.repaymentReconciliationZFB.update
    func.connPool1(query, [tableName.period.repaymentReconciliationZFB, changeItem(params.xn_ll), changeItem(params.xn_ymt), changeItem(params.pocket_amount), changeItem(params.balance_day), req.body.date], function (err, rs) {
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
      if (rs.changedRows === 1) {
        res.json(200)
      } else {
        res.json(500)
      }
    })
  }
}
