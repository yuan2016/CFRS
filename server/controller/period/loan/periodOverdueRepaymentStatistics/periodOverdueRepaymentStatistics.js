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

const tHeader = [['', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', ''], ['日期', '当前借款总数量', '', '', '当前借款总额(元)', '', '',  '已经还款总数量', '', '',  '已经还款总额(元)', '', '',  '逾期中数量', '', '',  '逾期中总额(元)', '', '',  '逾期十天以上总金额(元)', '', '',  'S1级逾期率(按金额)', '', '',  'S2级逾期率(按金额)', '', '',  'S3级逾期率(按金额)', '', '',  'M3级逾期率(按金额)', '', '',  'S1级逾期率(按单数)', '', '',  'S2级逾期率(按单数)', '', '',  'S3级逾期率(按单数)', '', '',  'M3级逾期率(按单数)', '', '', '更新时间']]
const filterVal = ['d_date', 'loan_amount_total_z', 'loan_amount_total_x', 'loan_amount_total', 'loan_money_total_z', 'loan_money_total_x', 'loan_money_total', 'repayment_amount_total_z', 'repayment_amount_total_x', 'repayment_amount_total', 'repayment_money_total_z', 'repayment_money_total_x', 'repayment_money_total', 'quantity_overdue_z', 'quantity_overdue_x', 'quantity_overdue', 'total_overdue_z', 'total_overdue_x', 'total_overdue', 'overdue_money_10d_z', 'overdue_money_10d_z', 'overdue_money_10d', 'overdue_money_10d_14_z', 'overdue_money_10d_14_z', 'overdue_money_10d_14', 'M_overdue_rate_s1_z', 'M_overdue_rate_s1_x', 'M_overdue_rate_s1', 'M_overdue_rate_s2_z', 'M_overdue_rate_s2_x', 'M_overdue_rate_s2_z', 'M_overdue_rate_s3_z', 'M_overdue_rate_s3_x', 'M_overdue_rate_s3', 'M_overdue_rate_m3_z', 'M_overdue_rate_m3_x', 'M_overdue_rate_m3_z', 'N_overdue_rate_s1_z', 'N_overdue_rate_s1_x', 'N_overdue_rate_s1', 'N_overdue_rate_s2_z', 'N_overdue_rate_s2_x', 'N_overdue_rate_s2', 'N_overdue_rate_s3_z', 'N_overdue_rate_s3_x', 'N_overdue_rate_s3', 'N_overdue_rate_m3_z', 'N_overdue_rate_m3_x', 'N_overdue_rate_m3', 'create_time']
//横坐标纵坐标
const merge = [[0, 0, 0, 1], [1, 0, 3, 0], [4, 0, 6, 0], [7, 0, 9, 0], [10, 0, 12, 0], [13, 0, 15, 0], [16, 0, 18, 0], [19, 0, 21, 0], [22, 0, 24, 0], [25, 0, 27, 0], [28, 0, 30, 0], [31, 0, 33, 0], [34, 0, 36, 0], [37, 0, 39, 0], [40, 0, 42, 0], [43, 0, 45, 0], [46, 0, 48, 0], [49, 0, 49, 0]]
const change = [['A1', '    日期'], ['B1', '  当前借款总数量'], ['E1', '  当前借款总额(元)'], ['H1', '  已经还款总数量'], ['K1', ' 已经还款总额(元)'], ['N1', ' 逾期中数量'], ['Q1', ' 逾期中总额(元)'], ['T1', ' 逾期十天以上总金额(元)'], ['W1', ' S1级逾期率(按金额)'], ['Z1', ' S2级逾期率(按金额)'], ['AC1', ' S3级逾期率(按金额)'], ['AF1', ' M3级逾期率(按金额)'], ['AI1', 'S1级逾期率(按单数)'], ['AL1', ' S2级逾期率(按单数)'], ['AO1', ' S3级逾期率(按单数)'], ['AR1', ' M3级逾期率(按单数)'], ['AU1', ' 更新时间']]

global.periodOverdueRepaymentStatisticsCount = 0

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
    if (row.loan_money_total_z) {
      row.loan_money_total_z = formatCurrency(row.loan_money_total_z)
    }
    if (row.loan_money_total_x) {
      row.loan_money_total_x = formatCurrency(row.loan_money_total_x)
    }
    if (row.loan_money_total) {
      row.loan_money_total = formatCurrency(row.loan_money_total)
    }
    if (row.repayment_money_total_z) {
      row.repayment_money_total_z = formatCurrency(row.repayment_money_total_z)
    }
    if (row.repayment_money_total_x) {
      row.repayment_money_total_x = formatCurrency(row.repayment_money_total_x)
    }
    if (row.repayment_money_total) {
      row.repayment_money_total = formatCurrency(row.repayment_money_total)
    }
    if (row.total_overdue_z) {
      row.total_overdue_z = formatCurrency(row.total_overdue_z)
    }
    if (row.total_overdue_x) {
      row.total_overdue_x = formatCurrency(row.total_overdue_x)
    }
    if (row.total_overdue) {
      row.total_overdue = formatCurrency(row.total_overdue)
    }
    if (row.overdue_money_10d_z) {
      row.overdue_money_10d_z = formatCurrency(row.overdue_money_10d_z)
    }
    if (row.overdue_money_10d_x) {
      row.overdue_money_10d_x = formatCurrency(row.overdue_money_10d_x)
    }
    if (row.overdue_money_10d) {
      row.overdue_money_10d = formatCurrency(row.overdue_money_10d)
    }
    if (row.overdue_money_10d_14_z) {
      row.overdue_money_10d_14_z = formatCurrency(row.overdue_money_10d_14_z)
    }
    if (row.overdue_money_10d_14_x) {
      row.overdue_money_10d_14_x = formatCurrency(row.overdue_money_10d_14_x)
    }
    if (row.overdue_money_10d_14) {
      row.overdue_money_10d_14 = formatCurrency(row.overdue_money_10d_14)
    }
    //num
    if (row.loan_amount_total) {
      row.loan_amount_total = formatInt(row.loan_amount_total)
    }
    if (row.loan_amount_total_z) {
      row.loan_amount_total_z = formatInt(row.loan_amount_total_z)
    }
    if (row.loan_amount_total_x) {
      row.loan_amount_total_x = formatInt(row.loan_amount_total_x)
    }
    if (row.repayment_amount_total) {
      row.repayment_amount_total = formatInt(row.repayment_amount_total)
    }
    if (row.repayment_amount_total_z) {
      row.repayment_amount_total_z = formatInt(row.repayment_amount_total_z)
    }
    if (row.repayment_amount_total_x) {
      row.repayment_amount_total_x = formatInt(row.repayment_amount_total_x)
    }
    if (row.quantity_overdue) {
      row.quantity_overdue = formatInt(row.quantity_overdue)
    }
    if (row.quantity_overdue_z) {
      row.quantity_overdue_z = formatInt(row.quantity_overdue_z)
    }
    if (row.quantity_overdue_x) {
      row.quantity_overdue_x = formatInt(row.quantity_overdue_x)
    }
    //率
    if (row.M_overdue_rate_s1_z) {
      row.M_overdue_rate_s1_z = (row.M_overdue_rate_s1_z * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_s1_x) {
      row.M_overdue_rate_s1_x = (row.M_overdue_rate_s1_x * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_s1) {
      row.M_overdue_rate_s1 = (row.M_overdue_rate_s1 * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_s2_z) {
      row.M_overdue_rate_s2_z = (row.M_overdue_rate_s2_z * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_s2_x) {
      row.M_overdue_rate_s2_x = (row.M_overdue_rate_s2_x * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_s2) {
      row.M_overdue_rate_s2 = (row.M_overdue_rate_s2 * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_s3_z) {
      row.M_overdue_rate_s3_z = (row.M_overdue_rate_s3_z * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_s3_x) {
      row.M_overdue_rate_s3_x = (row.M_overdue_rate_s3_x * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_s3) {
      row.M_overdue_rate_s3 = (row.M_overdue_rate_s3 * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_m3_z) {
      row.M_overdue_rate_m3_z = (row.M_overdue_rate_m3_z * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_m3_x) {
      row.M_overdue_rate_m3_x = (row.M_overdue_rate_m3_x * 100).toFixed(2) + '%'
    }
    if (row.M_overdue_rate_m3) {
      row.M_overdue_rate_m3 = (row.M_overdue_rate_m3 * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s1_z) {
      row.N_overdue_rate_s1_z = (row.N_overdue_rate_s1_z * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s1_x) {
      row.N_overdue_rate_s1_x = (row.N_overdue_rate_s1_x * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s1) {
      row.N_overdue_rate_s1 = (row.N_overdue_rate_s1 * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s2_z) {
      row.N_overdue_rate_s2_z = (row.N_overdue_rate_s2_z * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s2_x) {
      row.N_overdue_rate_s2_x = (row.N_overdue_rate_s2_x * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s2) {
      row.N_overdue_rate_s2 = (row.N_overdue_rate_s2 * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s3_z) {
      row.N_overdue_rate_s3_z = (row.N_overdue_rate_s3_z * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s3_x) {
      row.N_overdue_rate_s3_x = (row.N_overdue_rate_s3_x * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_s3) {
      row.N_overdue_rate_s3 = (row.N_overdue_rate_s3 * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_m3_z) {
      row.N_overdue_rate_m3_z = (row.N_overdue_rate_m3_z * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_m3_x) {
      row.N_overdue_rate_m3_x = (row.N_overdue_rate_m3_x * 100).toFixed(2) + '%'
    }
    if (row.N_overdue_rate_m3) {
      row.N_overdue_rate_m3 = (row.N_overdue_rate_m3 * 100).toFixed(2) + '%'
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
    func.connPool1(query, [tableName.period.periodOverdueRepaymentStatistics, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.period.periodOverdueRepaymentStatistics], function (err, rs) {
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
    if (global.periodOverdueRepaymentStatisticsCount === 0) {
      global.periodOverdueRepaymentStatisticsCount++
      pro.exec(shell.periodOverdueRepaymentStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期还款逾期记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.periodOverdueRepaymentStatisticsCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期还款逾期记录shell脚本执行成功')
          res.json({code: '200'})
          global.periodOverdueRepaymentStatisticsCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期还款逾期记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.selectAll + queries + sql.period.order
    func.connPool1(query, [tableName.period.periodOverdueRepaymentStatistics], function (err, rs) {
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
