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

const tHeader = [['', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计'], ['日期', '到期金额(元)', '', '', '逾期金额(元)', '', '', '逾期率', '', '', '还款率', '', '', '7天期限逾期单数', '', '', '14天期限逾期单数', '', '', '7天期限逾期金额(元)', '', '14天期限逾期金额(元)', '', '', '7天期限逾期率', '', '', '14天期限逾期率', '', '', '老用户逾期率', '', '', '新用户逾期率', '', '', '老用户还款率', '', '', '新用户还款率', '', '', '老用户到期金额(元)', '', '', '新用户到期金额(元)', '', '', '老用户逾期金额(元)', '', '', '新用户逾期金额(元)', '', '', '续期率']]
const filterVal = ['D_DATE', 'MATURE_MONEY_Z', 'MATURE_MONEY_X', 'MATURE_MONEY', 'OVERDUE_MONEY_Z', 'OVERDUE_MONEY_X', 'OVERDUE_MONEY', 'OVERDUE_RATE_Z', 'OVERDUE_RATE_X', 'OVERDUE_RATE', 'REPAYMENT_RATE_Z', 'REPAYMENT_RATE_X', 'REPAYMENT_RATE',
  'OVERDUE_NUM_7DAY_Z', 'OVERDUE_NUM_7DAY_X', 'OVERDUE_NUM_7DAY',
  'OVERDUE_NUM_14DAY_Z', 'OVERDUE_NUM_14DAY_X', 'OVERDUE_NUM_14DAY',
  'OVERDUE_MONEY_7DAY_Z', 'OVERDUE_MONEY_7DAY_X', 'OVERDUE_MONEY_7DAY',
  'OVERDUE_MONEY_14DAY_Z', 'OVERDUE_MONEY_14DAY_X', 'OVERDUE_MONEY_14DAY',
  'OVERDUE_RATE_7DAY_Z', 'OVERDUE_RATE_7DAY_X', 'OVERDUE_RATE_7DAY',
  'OVERDUE_RATE_14DAY_Z', 'OVERDUE_RATE_14DAY_X', 'OVERDUE_RATE_14DAY',
  'OVERDUE_RATE_OUSER_Z', 'OVERDUE_RATE_OUSER_X', 'OVERDUE_RATE_OUSER', 'OVERDUE_RATE_NUSER_Z', 'OVERDUE_RATE_NUSER_X', 'OVERDUE_RATE_NUSER', 'REPAYMENT_RATE_OUSER_Z', 'REPAYMENT_RATE_OUSER_X', 'REPAYMENT_RATE_OUSER', 'REPAYMENT_RATE_NUSER_Z', 'REPAYMENT_RATE_NUSER_X', 'REPAYMENT_RATE_NUSER', 'MATURE_MONEY_OUSER_Z', 'MATURE_MONEY_OUSER_X', 'MATURE_MONEY_OUSER', 'MATURE_MONEY_NUSER_Z', 'MATURE_MONEY_NUSER_X', 'MATURE_MONEY_NUSER', 'OVERDUE_MONEY_OUSER_Z', 'OVERDUE_MONEY_OUSER_X', 'OVERDUE_MONEY_OUSER', 'OVERDUE_MONEY_NUSER_Z', 'OVERDUE_MONEY_NUSER_X', 'OVERDUE_MONEY_NUSER', 'RENEWAL_RATE_Z', 'RENEWAL_RATE_X', 'RENEWAL_RATE']
//横坐标纵坐标
const merge = [[0, 0, 0, 1], [1, 0, 3, 0], [4, 0, 6, 0], [7, 0, 9, 0], [10, 0, 12, 0], [13, 0, 15, 0], [16, 0, 18, 0], [19, 0, 21, 0], [22, 0, 24, 0], [25, 0, 27, 0], [28, 0, 30, 0], [31, 0, 33, 0], [34, 0, 36, 0], [37, 0, 39, 0], [40, 0, 42, 0], [43, 0, 45, 0], [46, 0, 48, 0], [49, 0, 51, 0], [52, 0, 54, 0]]
const change = [['A1', '    日期'], ['B1', '  到期金额(元)'], ['E1', '  逾期金额(元)'], ['H1', '  逾期率'], ['K1', '  还款率'], ['N1', ' 7天期限逾期单数'], ['Q1', ' 14天期限逾期单数'], ['T1', ' 7天期限逾期金额(元)'], ['W1', ' 14天期限逾期金额(元)'], ['Z1', ' 7天期限逾期率'], ['AC1', ' 14天期限逾期率'], ['AF1', ' 老用户逾期率'], ['AI1', ' 新用户逾期率'], ['AL1', ' 老用户还款率'], ['AO1', ' 新用户还款率'], ['AR1', ' 老用户到期金额(元)'], ['AU1', ' 新用户到期金额(元)'], ['AX1', ' 老用户逾期金额(元)'], ['BA1', ' 新用户逾期金额(元)'], ['BD1', ' 续期率']]

global.periodDailyRepaymentAmountDataCount = 0

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
    // money
    if (row.MATURE_MONEY_Z) {
      row.MATURE_MONEY_Z = formatCurrency(row.MATURE_MONEY_Z)
    }
    if (row.MATURE_MONEY_X) {
      row.MATURE_MONEY_X = formatCurrency(row.MATURE_MONEY_X)
    }
    if (row.MATURE_MONEY) {
      row.MATURE_MONEY = formatCurrency(row.MATURE_MONEY)
    }
    if (row.OVERDUE_MONEY_Z) {
      row.OVERDUE_MONEY_Z = formatCurrency(row.OVERDUE_MONEY_Z)
    }
    if (row.OVERDUE_MONEY_X) {
      row.OVERDUE_MONEY_X = formatCurrency(row.OVERDUE_MONEY_X)
    }
    if (row.OVERDUE_MONEY) {
      row.OVERDUE_MONEY = formatCurrency(row.OVERDUE_MONEY)
    }
    if (row.OVERDUE_MONEY_7DAY_Z) {
      row.OVERDUE_MONEY_7DAY_Z = formatCurrency(row.OVERDUE_MONEY_7DAY_Z)
    }
    if (row.OVERDUE_MONEY_7DAY_X) {
      row.OVERDUE_MONEY_7DAY_X = formatCurrency(row.OVERDUE_MONEY_7DAY_X)
    }
    if (row.OVERDUE_MONEY_7DAY) {
      row.OVERDUE_MONEY_7DAY = formatCurrency(row.OVERDUE_MONEY_7DAY)
    }
    if (row.OVERDUE_MONEY_14DAY_Z) {
      row.OVERDUE_MONEY_14DAY_Z = formatCurrency(row.OVERDUE_MONEY_14DAY_Z)
    }
    if (row.OVERDUE_MONEY_14DAY_X) {
      row.OVERDUE_MONEY_14DAY_X = formatCurrency(row.OVERDUE_MONEY_14DAY_X)
    }
    if (row.OVERDUE_MONEY_14DAY) {
      row.OVERDUE_MONEY_14DAY = formatCurrency(row.OVERDUE_MONEY_14DAY)
    }
    if (row.MATURE_MONEY_OUSER_Z) {
      row.MATURE_MONEY_OUSER_Z = formatCurrency(row.MATURE_MONEY_OUSER_Z)
    }
    if (row.MATURE_MONEY_OUSER_X) {
      row.MATURE_MONEY_OUSER_X = formatCurrency(row.MATURE_MONEY_OUSER_X)
    }
    if (row.MATURE_MONEY_OUSER) {
      row.MATURE_MONEY_OUSER = formatCurrency(row.MATURE_MONEY_OUSER)
    }
    if (row.MATURE_MONEY_NUSER_Z) {
      row.MATURE_MONEY_NUSER_Z = formatCurrency(row.MATURE_MONEY_NUSER_Z)
    }
    if (row.MATURE_MONEY_NUSER_X) {
      row.MATURE_MONEY_NUSER_X = formatCurrency(row.MATURE_MONEY_NUSER_X)
    }
    if (row.MATURE_MONEY_NUSER) {
      row.MATURE_MONEY_NUSER = formatCurrency(row.MATURE_MONEY_NUSER)
    }
    if (row.OVERDUE_MONEY_OUSER_Z) {
      row.OVERDUE_MONEY_OUSER_Z = formatCurrency(row.OVERDUE_MONEY_OUSER_Z)
    }
    if (row.OVERDUE_MONEY_OUSER_X) {
      row.OVERDUE_MONEY_OUSER_X = formatCurrency(row.OVERDUE_MONEY_OUSER_X)
    }
    if (row.OVERDUE_MONEY_OUSER) {
      row.OVERDUE_MONEY_OUSER = formatCurrency(row.OVERDUE_MONEY_OUSER)
    }
    if (row.OVERDUE_MONEY_NUSER_Z) {
      row.OVERDUE_MONEY_NUSER_Z = formatCurrency(row.OVERDUE_MONEY_NUSER_Z)
    }
    if (row.OVERDUE_MONEY_NUSER_X) {
      row.OVERDUE_MONEY_NUSER_X = formatCurrency(row.OVERDUE_MONEY_NUSER_X)
    }
    if (row.OVERDUE_MONEY_NUSER) {
      row.OVERDUE_MONEY_NUSER = formatCurrency(row.OVERDUE_MONEY_NUSER)
    }
    //num
    if (row.OVERDUE_NUM_7DAY_Z) {
      row.OVERDUE_NUM_7DAY_Z = formatInt(row.OVERDUE_NUM_7DAY_Z)
    }
    if (row.OVERDUE_NUM_7DAY_X) {
      row.OVERDUE_NUM_7DAY_X = formatInt(row.OVERDUE_NUM_7DAY_X)
    }
    if (row.OVERDUE_NUM_7DAY) {
      row.OVERDUE_NUM_7DAY = formatInt(row.OVERDUE_NUM_7DAY)
    }
    if (row.OVERDUE_NUM_14DAY_Z) {
      row.OVERDUE_NUM_14DAY_Z = formatInt(row.OVERDUE_NUM_14DAY_Z)
    }
    if (row.OVERDUE_NUM_14DAY_X) {
      row.OVERDUE_NUM_14DAY_X = formatInt(row.OVERDUE_NUM_14DAY_X)
    }
    if (row.OVERDUE_NUM_14DAY) {
      row.OVERDUE_NUM_14DAY = formatInt(row.OVERDUE_NUM_14DAY)
    }
    //率
    if (row.OVERDUE_RATE_Z) {
      row.OVERDUE_RATE_Z = (row.OVERDUE_RATE_Z * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_X) {
      row.OVERDUE_RATE_X = (row.OVERDUE_RATE_X * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE) {
      row.OVERDUE_RATE = (row.OVERDUE_RATE * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE_Z) {
      row.REPAYMENT_RATE_Z = (row.REPAYMENT_RATE_Z * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE_X) {
      row.REPAYMENT_RATE_X = (row.REPAYMENT_RATE_X * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE) {
      row.REPAYMENT_RATE = (row.REPAYMENT_RATE * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_7DAY_Z) {
      row.OVERDUE_RATE_7DAY_Z = (row.OVERDUE_RATE_7DAY_Z * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_7DAY_X) {
      row.OVERDUE_RATE_7DAY_X = (row.OVERDUE_RATE_7DAY_X * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_7DAY) {
      row.OVERDUE_RATE_7DAY = (row.OVERDUE_RATE_7DAY * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_14DAY_Z) {
      row.OVERDUE_RATE_14DAY_Z = (row.OVERDUE_RATE_14DAY_Z * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_14DAY_X) {
      row.OVERDUE_RATE_14DAY_X = (row.OVERDUE_RATE_14DAY_X * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_14DAY) {
      row.OVERDUE_RATE_14DAY = (row.OVERDUE_RATE_14DAY * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_OUSER_Z) {
      row.OVERDUE_RATE_OUSER_Z = (row.OVERDUE_RATE_OUSER_Z * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_OUSER_X) {
      row.OVERDUE_RATE_OUSER_X = (row.OVERDUE_RATE_OUSER_X * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_OUSER) {
      row.OVERDUE_RATE_OUSER = (row.OVERDUE_RATE_OUSER * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_NUSER_Z) {
      row.OVERDUE_RATE_NUSER_Z = (row.OVERDUE_RATE_NUSER_Z * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_NUSER_X) {
      row.OVERDUE_RATE_NUSER_X = (row.OVERDUE_RATE_NUSER_X * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_NUSER) {
      row.OVERDUE_RATE_NUSER = (row.OVERDUE_RATE_NUSER * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE_OUSER_Z) {
      row.REPAYMENT_RATE_OUSER_Z = (row.REPAYMENT_RATE_OUSER_Z * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE_OUSER_X) {
      row.REPAYMENT_RATE_OUSER_X = (row.REPAYMENT_RATE_OUSER_X * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE_OUSER) {
      row.REPAYMENT_RATE_OUSER = (row.REPAYMENT_RATE_OUSER * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE_NUSER_Z) {
      row.REPAYMENT_RATE_NUSER_Z = (row.REPAYMENT_RATE_NUSER_Z * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE_NUSER_X) {
      row.REPAYMENT_RATE_NUSER_X = (row.REPAYMENT_RATE_NUSER_X * 100).toFixed(2) + '%'
    }
    if (row.REPAYMENT_RATE_NUSER) {
      row.REPAYMENT_RATE_NUSER = (row.REPAYMENT_RATE_NUSER * 100).toFixed(2) + '%'
    }
    if (row.RENEWAL_RATE_Z) {
      row.RENEWAL_RATE_Z = (row.RENEWAL_RATE_Z * 100).toFixed(2) + '%'
    }
    if (row.RENEWAL_RATE_X) {
      row.RENEWAL_RATE_X = (row.RENEWAL_RATE_X * 100).toFixed(2) + '%'
    }
    if (row.RENEWAL_RATE) {
      row.RENEWAL_RATE = (row.RENEWAL_RATE * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.order
    let query = sql.period.selectAll + queries + order + sql.period.selectAllBack
    func.connPool1(query, [tableName.period.periodDailyRepaymentAmountData, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.getCount + queries
    func.connPool1(query, [tableName.period.periodDailyRepaymentAmountData], function (err, rs) {
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
    if (global.periodDailyRepaymentAmountDataCount === 0) {
      global.periodDailyRepaymentAmountDataCount++
      pro.exec(shell.periodDailyRepaymentAmountData, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日还款金额记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.periodDailyRepaymentAmountDataCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日还款金额记录shell脚本执行成功')
          res.json({code: '200'})
          global.periodDailyRepaymentAmountDataCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日还款金额记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.selectAll + queries + sql.period.order
    func.connPool1(query, [tableName.period.periodDailyRepaymentAmountData], function (err, rs) {
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
      const data = formatJson(filterVal, rs)

      let fileName = mosaicName()
      try {
        exportJsonToExcel(tHeader, data, fileName, merge, change)
      } catch (e) {
        console.log(e)
        res.sendFile(path.join(process.cwd(), 'error.html'))
        return
      }

      let currFilePath = path.join(process.cwd(), fileName)
      let options = {
        headers: {
          'Content-Disposition': 'attachment; filename=' + fileName
        }
      }
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
    }, 180000)
  }
}
