let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let {exportJsonToExcel} = require('../../../../utils/excel')

global.collectionCount = 0

const tHeader = [['', '', 'S1逾期回款(元)', 'S1-K/D', 'S1滞纳金收入(元)', 'S2逾期回款(元)', 'S2-K/D', 'S2滞纳金收入(元)', 'M2逾期回款(元)', 'M2-K/D', 'M2滞纳金收入(元)', 'M3逾期回款(元)', 'M3-K/D', 'M3滞纳金收入(元)', 'M3+逾期回款(元)', 'M3+-K/D', 'M3+滞纳金收入(元)', '', '', ''], ['日期', '当日逾期总额(元)', 'S1', 'S2', 'M2', 'M3', 'M3+', '当日M3+逾期金额(元)', '累计滞纳金收入(元)', '更新时间']]
const filterVal = ['d_date', 'overdue_total', 'overdue_payment_s1', 'overdue_index_s1', 'late_fee_s1', 'overdue_payment_s2', 'overdue_index_s2', 'late_fee_s2', 'overdue_payment_m2', 'overdue_index_m2', 'late_fee_m2', 'overdue_payment_m3', 'overdue_index_m3', 'late_fee_m3', 'bad_debt_m3', 'overdue_index_m4', 'comp_late_fee', 'due_debt_m3', 'accu_late_fee', 'create_time']
const merge = [[0, 0, 0, 1], [1, 0, 1, 1], [2, 0, 4, 0], [5, 0, 7, 0], [8, 0, 10, 0], [11, 0, 13, 0], [14, 0, 16, 0], [17, 0, 17, 1], [18, 0, 18, 1], [19, 0, 19, 1]]
const change = [['A1', '  日期'], ['B1', '当日逾期总额(元)'], ['C1', '           S1'], ['F1', '            S2'], ['I1', '            M2'], ['L1', '            M3'], ['O1', '            M3+'], ['R1', '当日M3+逾期金额(元)'], ['S1', '累计滞纳金收入(元)'], ['T1', '更新时间']]

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
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

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.overdue_index_s1) {
      row.overdue_index_s1 = (row.overdue_index_s1 * 100).toFixed(2) + '%'
    }
    if (row.overdue_index_s2) {
      row.overdue_index_s2 = (row.overdue_index_s2 * 100).toFixed(2) + '%'
    }
    if (row.overdue_index_m2) {
      row.overdue_index_m2 = (row.overdue_index_m2 * 100).toFixed(2) + '%'
    }
    if (row.overdue_index_m3) {
      row.overdue_index_m3 = (row.overdue_index_m3 * 100).toFixed(2) + '%'
    }
    if (row.overdue_index_m4) {
      row.overdue_index_m4 = (row.overdue_index_m4 * 100).toFixed(2) + '%'
    }

    if (row.overdue_total) {
      row.overdue_total = formatCurrency(row.overdue_total)
    }
    if (row.overdue_payment_s1) {
      row.overdue_payment_s1 = formatCurrency(row.overdue_payment_s1)
    }
    if (row.late_fee_s1) {
      row.late_fee_s1 = formatCurrency(row.late_fee_s1)
    }
    if (row.overdue_payment_s2) {
      row.overdue_payment_s2 = formatCurrency(row.overdue_payment_s2)
    }
    if (row.late_fee_s2) {
      row.late_fee_s2 = formatCurrency(row.late_fee_s2)
    }
    if (row.overdue_payment_m2) {
      row.overdue_payment_m2 = formatCurrency(row.overdue_payment_m2)
    }
    if (row.late_fee_m2) {
      row.late_fee_m2 = formatCurrency(row.late_fee_m2)
    }
    if (row.overdue_payment_m3) {
      row.overdue_payment_m3 = formatCurrency(row.overdue_payment_m3)
    }
    if (row.late_fee_m3) {
      row.late_fee_m3 = formatCurrency(row.late_fee_m3)
    }
    if (row.bad_debt_m3) {
      row.bad_debt_m3 = formatCurrency(row.bad_debt_m3)
    }
    if (row.comp_late_fee) {
      row.comp_late_fee = formatCurrency(row.comp_late_fee)
    }
    if (row.accu_late_fee) {
      row.accu_late_fee = formatCurrency(row.accu_late_fee)
    }
    if (row.due_debt_m3) {
      row.due_debt_m3 = formatCurrency(row.due_debt_m3)
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
    func.connPool1(query, [tableName.collectionManagement, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.collectionManagement], function (err, rs) {
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
    if (global.collectionCount === 0) {
      global.collectionCount++
      pro.exec(shell.collectionManagement, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 催收管理shell脚本执行失败')
          res.json({code: '500'})
          global.collectionCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 催收管理shell脚本执行成功')
          res.json({code: '200'})
          global.collectionCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 催收管理开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.selectAll + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.collectionManagement], function (err, rs) {
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
          return
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
