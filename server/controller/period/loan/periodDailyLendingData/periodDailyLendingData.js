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

const tHeader = [['', '', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计'], ['日期', '注册人数', '借款人数', '', '成功借款人数', '', '新用户借款占比', '', '老用户借款占比', '', '累计新用户借款占比', '', '累计老用户借款占比', '', '放款单数', '', '7天期限放款单数', '', '14天期限放款单数', '', '放款总额', '', '7天期限放款总额', '',  '14天期限放款总额', '', '老用户放款单数', '', '老用户放款总额', '', '新用户放款单数', '', '新用户放款总额', '', '满额率', '', '新用户满额率', '', '老用户满额率', '', '扣款失败率', '', '新用户续期率', '', '老用户续期率', '', '总续期率', '']]
const filterVal = ['d_date', 'register_num', 'loan_num_z', 'loan_num_x', 'loan_num', 'success_loan_num_z', 'success_loan_num_x', 'success_loan_num', 'newuser_loan_rate_z', 'newuser_loan_rate_x', 'newuser_loan_rate', 'olduser_loan_rate_z', 'olduser_loan_rate_x', 'olduser_loan_rate', 'accunewuser_loan_rate_z', 'accunewuser_loan_rate_x', 'accunewuser_loan_rate', 'accuolduser_loan_rate_z', 'accuolduser_loan_rate_x', 'accuolduser_loan_rate',
  'loan_singular_z', 'loan_singular_x', 'loan_singular',
  'loan_singular_7day_z', 'loan_singular_7day_x', 'loan_singular_7day',
  'loan_singular_14day_z', 'loan_singular_14day_x', 'loan_singular_14day',
  'loans_total_z', 'loans_total_x', 'loans_total',
  'loans_total_7day_z', 'loans_total_7day_x', 'loans_total_7day',
  'loans_total_14day_z', 'loans_total_14day_x', 'loans_total_14day',
  'loan_singular_ouser_z', 'loan_singular_ouser_x', 'loan_singular_ouser',
  'loans_total_ouser_z', 'loans_total_ouser_x', 'loans_total_ouser',
  'loan_singular_nuser_z', 'loan_singular_nuser_x', 'loan_singular_nuser',
  'loans_total_nuser_z', 'loans_total_nuser_x', 'loans_total_nuser', 'full_amount_rate_z', 'full_amount_rate_x', 'full_amount_rate', 'nuser_full_amount_rate_z', 'nuser_full_amount_rate_x', 'nuser_full_amount_rate', 'ouser_full_amount_rate_z', 'ouser_full_amount_rate_x', 'ouser_full_amount_rate', 'Chargeback_failrate_z', 'Chargeback_failrate_x', 'Chargeback_failrate', 'renewal_rate_nuser_z', 'renewal_rate_nuser_x', 'renewal_rate_nuser', 'renewal_rate_ouser_z', 'renewal_rate_ouser_x', 'renewal_rate_ouser', 'renewal_rate_z', 'renewal_rate_x', 'renewal_rate']
//横坐标纵坐标
const merge = [[0, 0, 0, 1], [1, 0, 1, 1], [2, 0, 4, 0], [5, 0, 7, 0], [8, 0, 10, 0], [11, 0, 13, 0], [14, 0, 16, 0], [17, 0, 19, 0], [20, 0, 22, 0], [23, 0, 25, 0], [26, 0, 28, 0], [29, 0, 31, 0], [32, 0, 34, 0], [35, 0, 37, 0], [38, 0, 40, 0], [41, 0, 43, 0], [44, 0, 46, 0], [47, 0, 49, 0], [50, 0, 52, 0], [53, 0, 55, 0], [56, 0, 58, 0], [59, 0, 61, 0], [62, 0, 64, 0], [65, 0, 67, 0], [68, 0, 70, 0]]
const change = [['A1', '    日期'], ['B1', '  注册人数'], ['C1', '  借款人数'], ['F1', '  成功借款人数'], ['I1', '  新用户借款占比'], ['L1', ' 老用户借款占比'], ['O1', ' 累计新用户借款占比'], ['R1', ' 累计老用户借款占比'], ['U1', ' 放款单数'], ['X1', ' 7天期限放款单数(元)'], ['AA1', ' 14天期限放款单数(元)'], ['AD1', ' 放款总额'], ['AG1', ' 7天期限放款总额(元)'], ['AJ1', ' 14天期限放款总额(元)'], ['AM1', ' 老用户放款单数'], ['AP1', ' 老用户放款总额(元)'], ['AS1', ' 新用户放款单数'], ['AV1', ' 新用户放款总额(元)'], ['AY1', ' 满额率'], ['BB1', ' 新用户满额率'], ['BE1', ' 老用户满额率'], ['BH1', ' 扣款失败率'], ['BK1', ' 新用户续期率'], ['BN1', ' 老用户续期率'], ['BQ1', ' 总续期率']]

global.periodDailyLendingCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.loans_total_z) {
      row.loans_total_z = formatCurrency(row.loans_total_z)
    }
    if (row.loans_total_x) {
      row.loans_total_x = formatCurrency(row.loans_total_x)
    }
    if (row.loans_total) {
      row.loans_total = formatCurrency(row.loans_total)
    }
    if (row.loans_total_7day_z) {
      row.loans_total_7day_z = formatCurrency(row.loans_total_7day_z)
    }
    if (row.loans_total_7day_x) {
      row.loans_total_7day_x = formatCurrency(row.loans_total_7day_x)
    }
    if (row.loans_total_7day) {
      row.loans_total_7day = formatCurrency(row.loans_total_7day)
    }
    if (row.loans_total_14day_z) {
      row.loans_total_14day_z = formatCurrency(row.loans_total_14day_z)
    }
    if (row.loans_total_14day_x) {
      row.loans_total_14day_x = formatCurrency(row.loans_total_14day_x)
    }
    if (row.loans_total_14day) {
      row.loans_total_14day = formatCurrency(row.loans_total_14day)
    }
    if (row.loans_total_ouser_z) {
      row.loans_total_ouser_z = formatCurrency(row.loans_total_ouser_z)
    }
    if (row.loans_total_ouser_x) {
      row.loans_total_ouser_x = formatCurrency(row.loans_total_ouser_x)
    }
    if (row.loans_total_ouser) {
      row.loans_total_ouser = formatCurrency(row.loans_total_ouser)
    }
    if (row.loans_total_nuser_z) {
      row.loans_total_nuser_z = formatCurrency(row.loans_total_nuser_z)
    }
    if (row.loans_total_nuser_x) {
      row.loans_total_nuser_x = formatCurrency(row.loans_total_nuser_x)
    }
    if (row.loans_total_nuser) {
      row.loans_total_nuser = formatCurrency(row.loans_total_nuser)
    }
    //num
    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.loan_num_z) {
      row.loan_num_z = formatInt(row.loan_num_z)
    }
    if (row.loan_num_x) {
      row.loan_num_x = formatInt(row.loan_num_x)
    }
    if (row.loan_num) {
      row.loan_num = formatInt(row.loan_num)
    }
    if (row.success_loan_num_z) {
      row.success_loan_num_z = formatInt(row.success_loan_num_z)
    }
    if (row.success_loan_num_x) {
      row.success_loan_num_x = formatInt(row.success_loan_num_x)
    }
    if (row.success_loan_num) {
      row.success_loan_num = formatInt(row.success_loan_num)
    }
    if (row.loan_singular_z) {
      row.loan_singular_z = formatInt(row.loan_singular_z)
    }
    if (row.loan_singular_x) {
      row.loan_singular_x = formatInt(row.loan_singular_x)
    }
    if (row.loan_singular) {
      row.loan_singular = formatInt(row.loan_singular)
    }
    if (row.loan_singular_7day_z) {
      row.loan_singular_7day_z = formatInt(row.loan_singular_7day_z)
    }
    if (row.loan_singular_7day_x) {
      row.loan_singular_7day_x = formatInt(row.loan_singular_7day_x)
    }
    if (row.loan_singular_7day) {
      row.loan_singular_7day = formatInt(row.loan_singular_7day)
    }
    if (row.loan_singular_14day_z) {
      row.loan_singular_14day_z = formatInt(row.loan_singular_14day_z)
    }
    if (row.loan_singular_14day_x) {
      row.loan_singular_14day_x = formatInt(row.loan_singular_14day_x)
    }
    if (row.loan_singular_14day) {
      row.loan_singular_14day = formatInt(row.loan_singular_14day)
    }
    if (row.loan_singular_ouser_z) {
      row.loan_singular_ouser_z = formatInt(row.loan_singular_ouser_z)
    }
    if (row.loan_singular_ouser_x) {
      row.loan_singular_ouser_x = formatInt(row.loan_singular_ouser_x)
    }
    if (row.loan_singular_ouser) {
      row.loan_singular_ouser = formatInt(row.loan_singular_ouser)
    }
    if (row.loan_singular_nuser_z) {
      row.loan_singular_nuser_z = formatInt(row.loan_singular_nuser_z)
    }
    if (row.loan_singular_nuser_x) {
      row.loan_singular_nuser_x = formatInt(row.loan_singular_nuser_x)
    }
    if (row.loan_singular_nuser) {
      row.loan_singular_nuser = formatInt(row.loan_singular_nuser)
    }
    //率
    if (row.newuser_loan_rate_z) {
      row.newuser_loan_rate_z = (row.newuser_loan_rate_z * 100).toFixed(2) + '%'
    }
    if (row.newuser_loan_rate_x) {
      row.newuser_loan_rate_x = (row.newuser_loan_rate_x * 100).toFixed(2) + '%'
    }
    if (row.newuser_loan_rate) {
      row.newuser_loan_rate = (row.newuser_loan_rate * 100).toFixed(2) + '%'
    }
    if (row.olduser_loan_rate_z) {
      row.olduser_loan_rate_z = (row.olduser_loan_rate_z * 100).toFixed(2) + '%'
    }
    if (row.olduser_loan_rate_x) {
      row.olduser_loan_rate_x = (row.olduser_loan_rate_x * 100).toFixed(2) + '%'
    }
    if (row.olduser_loan_rate) {
      row.olduser_loan_rate = (row.olduser_loan_rate * 100).toFixed(2) + '%'
    }
    if (row.accunewuser_loan_rate_z) {
      row.accunewuser_loan_rate_z = (row.accunewuser_loan_rate_z * 100).toFixed(2) + '%'
    }
    if (row.accunewuser_loan_rate_x) {
      row.accunewuser_loan_rate_x = (row.accunewuser_loan_rate_x * 100).toFixed(2) + '%'
    }
    if (row.accunewuser_loan_rate) {
      row.accunewuser_loan_rate = (row.accunewuser_loan_rate * 100).toFixed(2) + '%'
    }
    if (row.accuolduser_loan_rate_z) {
      row.accuolduser_loan_rate_z = (row.accuolduser_loan_rate_z * 100).toFixed(2) + '%'
    }
    if (row.accuolduser_loan_rate_x) {
      row.accuolduser_loan_rate_x = (row.accuolduser_loan_rate_x * 100).toFixed(2) + '%'
    }
    if (row.accuolduser_loan_rate) {
      row.accuolduser_loan_rate = (row.accuolduser_loan_rate * 100).toFixed(2) + '%'
    }
    if (row.full_amount_rate_z) {
      row.full_amount_rate_z = (row.full_amount_rate_z * 100).toFixed(2) + '%'
    }
    if (row.full_amount_rate_x) {
      row.full_amount_rate_x = (row.full_amount_rate_x * 100).toFixed(2) + '%'
    }
    if (row.full_amount_rate) {
      row.full_amount_rate = (row.full_amount_rate * 100).toFixed(2) + '%'
    }
    if (row.nuser_full_amount_rate_z) {
      row.nuser_full_amount_rate_z = (row.nuser_full_amount_rate_z * 100).toFixed(2) + '%'
    }
    if (row.nuser_full_amount_rate_x) {
      row.nuser_full_amount_rate_x = (row.nuser_full_amount_rate_x * 100).toFixed(2) + '%'
    }
    if (row.nuser_full_amount_rate) {
      row.nuser_full_amount_rate = (row.nuser_full_amount_rate * 100).toFixed(2) + '%'
    }
    if (row.ouser_full_amount_rate_z) {
      row.ouser_full_amount_rate_z = (row.ouser_full_amount_rate_z * 100).toFixed(2) + '%'
    }
    if (row.ouser_full_amount_rate_x) {
      row.ouser_full_amount_rate_x = (row.ouser_full_amount_rate_x * 100).toFixed(2) + '%'
    }
    if (row.ouser_full_amount_rate) {
      row.ouser_full_amount_rate = (row.ouser_full_amount_rate * 100).toFixed(2) + '%'
    }
    if (row.Chargeback_failrate_z) {
      row.Chargeback_failrate_z = (row.Chargeback_failrate_z * 100).toFixed(2) + '%'
    }
    if (row.Chargeback_failrate_x) {
      row.Chargeback_failrate_x = (row.Chargeback_failrate_x * 100).toFixed(2) + '%'
    }
    if (row.Chargeback_failrate) {
      row.Chargeback_failrate = (row.Chargeback_failrate * 100).toFixed(2) + '%'
    }

    if (row.renewal_rate_nuser_z) {
      row.renewal_rate_nuser_z = (row.renewal_rate_nuser_z * 100).toFixed(2) + '%'
    }
    if (row.renewal_rate_nuser_x) {
      row.renewal_rate_nuser_x = (row.renewal_rate_nuser_x * 100).toFixed(2) + '%'
    }
    if (row.renewal_rate_nuser) {
      row.renewal_rate_nuser = (row.renewal_rate_nuser * 100).toFixed(2) + '%'
    }
    if (row.renewal_rate_ouser_z) {
      row.renewal_rate_ouser_z = (row.renewal_rate_ouser_z * 100).toFixed(2) + '%'
    }
    if (row.renewal_rate_ouser_x) {
      row.renewal_rate_ouser_x = (row.renewal_rate_ouser_x * 100).toFixed(2) + '%'
    }
    if (row.renewal_rate_ouser) {
      row.renewal_rate_ouser = (row.renewal_rate_ouser * 100).toFixed(2) + '%'
    }
    if (row.renewal_rate_z) {
      row.renewal_rate_z = (row.renewal_rate_z * 100).toFixed(2) + '%'
    }
    if (row.renewal_rate_x) {
      row.renewal_rate_x = (row.renewal_rate_x * 100).toFixed(2) + '%'
    }
    if (row.renewal_rate) {
      row.renewal_rate = (row.renewal_rate * 100).toFixed(2) + '%'
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
    func.connPool1(query, [tableName.period.periodDailyLendingData, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.period.periodDailyLendingData], function (err, rs) {
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
    if (global.periodDailyLendingCount === 0) {
      global.periodDailyLendingCount++
      pro.exec(shell.periodDailyLending, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日放款记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.periodDailyLendingCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日放款记录shell脚本执行成功')
          res.json({code: '200'})
          global.periodDailyLendingCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每日放款记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.selectAll + queries + sql.period.order
    func.connPool1(query, [tableName.period.periodDailyLendingData], function (err, rs) {
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
