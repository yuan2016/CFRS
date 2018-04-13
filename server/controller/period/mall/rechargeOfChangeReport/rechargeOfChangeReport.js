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

global.rechargeOfChangeReportCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD ')
    }
    // money
    if (row.xn_ll) {
      row.xn_ll = formatCurrency(row.xn_ll)
    }
    if (row.xn_ymt) {
      row.xn_ymt = formatCurrency(row.xn_ymt)
    }
    if (row.pocket_amount) {
      row.pocket_amount = formatCurrency(row.pocket_amount)
    }
    if (row.dlb_income) {
      row.dlb_income = formatCurrency(row.dlb_income)
    }
    if (row.pocket_buy) {
      row.pocket_buy = formatCurrency(row.pocket_buy)
    }
    if (row.withdraw) {
      row.withdraw = formatCurrency(row.withdraw)
    }
    if (row.withdraw_fee) {
      row.withdraw_fee = formatCurrency(row.withdraw_fee)
    }
    if (row.dlb_refund) {
      row.dlb_refund = formatCurrency(row.dlb_refund)
    }
    if (row.pocket_recharge_tatol) {
      row.pocket_recharge_tatol = formatCurrency(row.pocket_recharge_tatol)
    }
    if (row.balance_day) {
      row.balance_day = formatCurrency(row.balance_day)
    }
    if (row.balance) {
      row.balance = formatCurrency(row.balance)
    }
    if (row.diff) {
      row.diff = formatCurrency(row.diff)
    }
    if (row.alipay_recharge_fee) {
      row.alipay_recharge_fee = formatCurrency(row.alipay_recharge_fee)
    }

    if (row.m_month) {
      row.m_month = row.m_month + '月'
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
    if (row['XN连连(元)']) {
      row['XN连连(元)'] = formatCurrency(row['XN连连(元)'])
    }
    if (row['XN益码通(元)']) {
      row['XN益码通(元)'] = formatCurrency(row['XN益码通(元)'])
    }
    if (row['零钱合计(元)']) {
      row['零钱合计(元)'] = formatCurrency(row['零钱合计(元)'])
    }
    if (row['礼包购买(元)']) {
      row['礼包购买(元)'] = formatCurrency(row['礼包购买(元)'])
    }
    if (row['商品零钱购买(元)']) {
      row['商品零钱购买(元)'] = formatCurrency(row['商品零钱购买(元)'])
    }
    if (row['提现(元)']) {
      row['提现(元)'] = formatCurrency(row['提现(元)'])
    }
    if (row['提现手续费(元)']) {
      row['提现手续费(元)'] = formatCurrency(row['提现手续费(元)'])
    }
    if (row['退款(元)']) {
      row['退款(元)'] = formatCurrency(row['退款(元)'])
    }
    if (row['合计(元)']) {
      row['合计(元)'] = formatCurrency(row['合计(元)'])
    }
    if (row['当日余额(元)']) {
      row['当日余额(元)'] = formatCurrency(row['当日余额(元)'])
    }
    if (row['后台当日余额(元)']) {
      row['后台当日余额(元)'] = formatCurrency(row['后台当日余额(元)'])
    }
    if (row['验证差异(元)']) {
      row['验证差异(元)'] = formatCurrency(row['验证差异(元)'])
    }
    if (row['支付宝充值手续费收入(元)']) {
      row['支付宝充值手续费收入(元)'] = formatCurrency(row['支付宝充值手续费收入(元)'])
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
    let order = params.order || sql.period.rechargeOfChangeReport.order
    let query = sql.period.rechargeOfChangeReport.selectAll + queries + order + sql.period.rechargeOfChangeReport.selectAllBack
    func.connPool1(query, [tableName.period.rechargeOfChangeReport, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.rechargeOfChangeReport.getCount + queries
    func.connPool1(query, [tableName.period.rechargeOfChangeReport], function (err, rs) {
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
    if (global.rechargeOfChangeReportCount === 0) {
      global.rechargeOfChangeReportCount++
      pro.exec(shell.detailIncome, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.rechargeOfChangeReportCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表shell脚本执行成功')
          res.json({code: '200'})
          global.rechargeOfChangeReportCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期收入结算明细表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.rechargeOfChangeReport.selectAllExcel + queries + sql.period.rechargeOfChangeReport.order
    func.connPool1(query, [tableName.period.rechargeOfChangeReport], function (err, rs) {
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
    let query = sql.period.rechargeOfChangeReport.update
    func.connPool1(query, [tableName.period.rechargeOfChangeReport, changeItem(params.xn_ll), changeItem(params.xn_ymt), changeItem(params.pocket_amount), changeItem(params.balance_day), req.body.date], function (err, rs) {
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
