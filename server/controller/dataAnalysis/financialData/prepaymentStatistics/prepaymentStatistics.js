let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let fs = require('fs')
let path = require('path')
let {exportJsonToExcel} = require('../../../../utils/excel')

global.prepaymentStatisticsCount = 0

const tHeader = [['', '累计提前还款额(元)', '累计提前还款率(提前还款/总借款)', '当前提前还款额(元)', '当前提前还款率', '累计提前还款额(元)', '累计提前还款率(提前还款/总借款)', '当前提前还款额(元)', '当前提前还款率', '累计提前还款额(元)', '累计提前还款率(提前还款/总借款)', '当前提前还款额(元)', '当前提前还款率', '累计提前还款额(元)', '累计提前还款率(提前还款/总借款)', '当前提前还款额(元)', '当前提前还款率', '累计提前还款额(元)', '累计提前还款率(提前还款/总借款)', '当前提前还款额(元)', '当前提前还款率', ''], ['日期', '14天新用户', '14天老用户', '21天新用户', '21天老用户', '90天老用户', '更新时间']]
const filterVal = ['D_DATE', 'NUSER_PREPAYMENT_BEFORE_AMOUNT_14', 'NUSER_PREPAYMENT_BEFORE_RATE_TOTAL_14', 'NUSER_PREPAYMENT_NOW_AMOUNT_14', 'NUSER_PREPAYMENT_NOW_RATE_14', 'OUSER_PREPAYMENT_BEFORE_AMOUNT_14', 'OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_14', 'OUSER_PREPAYMENT_NOW_AMOUNT_14', 'OUSER_PREPAYMENT_NOW_RATE_14', 'NUSER_PREPAYMENT_BEFORE_AMOUNT_21', 'NUSER_PREPAYMENT_BEFORE_RATE_TOTAL_21', 'NUSER_PREPAYMENT_NOW_AMOUNT_21', 'NUSER_PREPAYMENT_NOW_RATE_21', 'OUSER_PREPAYMENT_BEFORE_AMOUNT_21', 'OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_21', 'OUSER_PREPAYMENT_NOW_AMOUNT_21', 'OUSER_PREPAYMENT_NOW_RATE_21', 'OUSER_PREPAYMENT_BEFORE_AMOUNT_90', 'OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_90', 'OUSER_PREPAYMENT_NOW_AMOUNT_90', 'OUSER_PREPAYMENT_NOW_RATE_90', 'UPDATE_TIME']
const merge = [[0, 0, 0, 1], [1, 0, 4, 0], [5, 0, 8, 0], [9, 0, 12, 0], [13, 0, 16, 0], [17, 0, 20, 0], [21, 0, 21, 1]]
const change = [['A1', '  日期'], ['B1', '     14天新用户'], ['F1', '     14天老用户'], ['J1', '      21天新用户'], ['N1', '     21天老用户'], ['R1', '      90天老用户'], ['V1', '更新时间']]

function formatData (rows) {
  return rows.map(row => {
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD')
    }
    if (row.NUSER_PREPAYMENT_BEFORE_RATE_DONE_14) {
      row.NUSER_PREPAYMENT_BEFORE_RATE_DONE_14 = (row.NUSER_PREPAYMENT_BEFORE_RATE_DONE_14 * 100).toFixed(2) + '%'
    }
    if (row.NUSER_PREPAYMENT_BEFORE_RATE_TOTAL_14) {
      row.NUSER_PREPAYMENT_BEFORE_RATE_TOTAL_14 = (row.NUSER_PREPAYMENT_BEFORE_RATE_TOTAL_14 * 100).toFixed(2) + '%'
    }
    if (row.NUSER_PREPAYMENT_NOW_RATE_14) {
      row.NUSER_PREPAYMENT_NOW_RATE_14 = (row.NUSER_PREPAYMENT_NOW_RATE_14 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_14) {
      row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_14 = (row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_14 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_14) {
      row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_14 = (row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_14 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_NOW_RATE_14) {
      row.OUSER_PREPAYMENT_NOW_RATE_14 = (row.OUSER_PREPAYMENT_NOW_RATE_14 * 100).toFixed(2) + '%'
    }
    if (row.NUSER_PREPAYMENT_BEFORE_RATE_DONE_21) {
      row.NUSER_PREPAYMENT_BEFORE_RATE_DONE_21 = (row.NUSER_PREPAYMENT_BEFORE_RATE_DONE_21 * 100).toFixed(2) + '%'
    }
    if (row.NUSER_PREPAYMENT_BEFORE_RATE_TOTAL_21) {
      row.NUSER_PREPAYMENT_BEFORE_RATE_TOTAL_21 = (row.NUSER_PREPAYMENT_BEFORE_RATE_TOTAL_21 * 100).toFixed(2) + '%'
    }
    if (row.NUSER_PREPAYMENT_NOW_RATE_21) {
      row.NUSER_PREPAYMENT_NOW_RATE_21 = (row.NUSER_PREPAYMENT_NOW_RATE_21 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_21) {
      row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_21 = (row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_21 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_21) {
      row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_21 = (row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_21 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_NOW_RATE_21) {
      row.OUSER_PREPAYMENT_NOW_RATE_21 = (row.OUSER_PREPAYMENT_NOW_RATE_21 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_90) {
      row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_90 = (row.OUSER_PREPAYMENT_BEFORE_RATE_DONE_90 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_90) {
      row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_90 = (row.OUSER_PREPAYMENT_BEFORE_RATE_TOTAL_90 * 100).toFixed(2) + '%'
    }
    if (row.OUSER_PREPAYMENT_NOW_RATE_90) {
      row.OUSER_PREPAYMENT_NOW_RATE_90 = (row.OUSER_PREPAYMENT_NOW_RATE_90 * 100).toFixed(2) + '%'
    }

    if (row.NUSER_PREPAYMENT_BEFORE_AMOUNT_14) {
      row.NUSER_PREPAYMENT_BEFORE_AMOUNT_14 = formatCurrency(row.NUSER_PREPAYMENT_BEFORE_AMOUNT_14)
    }
    if (row.NUSER_PREPAYMENT_NOW_AMOUNT_14) {
      row.NUSER_PREPAYMENT_NOW_AMOUNT_14 = formatCurrency(row.NUSER_PREPAYMENT_NOW_AMOUNT_14)
    }
    if (row.OUSER_PREPAYMENT_BEFORE_AMOUNT_14) {
      row.OUSER_PREPAYMENT_BEFORE_AMOUNT_14 = formatCurrency(row.OUSER_PREPAYMENT_BEFORE_AMOUNT_14)
    }
    if (row.OUSER_PREPAYMENT_NOW_AMOUNT_14) {
      row.OUSER_PREPAYMENT_NOW_AMOUNT_14 = formatCurrency(row.OUSER_PREPAYMENT_NOW_AMOUNT_14)
    }
    if (row.NUSER_PREPAYMENT_BEFORE_AMOUNT_21) {
      row.NUSER_PREPAYMENT_BEFORE_AMOUNT_21 = formatCurrency(row.NUSER_PREPAYMENT_BEFORE_AMOUNT_21)
    }
    if (row.NUSER_PREPAYMENT_NOW_AMOUNT_21) {
      row.NUSER_PREPAYMENT_NOW_AMOUNT_21 = formatCurrency(row.NUSER_PREPAYMENT_NOW_AMOUNT_21)
    }
    if (row.OUSER_PREPAYMENT_BEFORE_AMOUNT_21) {
      row.OUSER_PREPAYMENT_BEFORE_AMOUNT_21 = formatCurrency(row.OUSER_PREPAYMENT_BEFORE_AMOUNT_21)
    }
    if (row.OUSER_PREPAYMENT_NOW_AMOUNT_21) {
      row.OUSER_PREPAYMENT_NOW_AMOUNT_21 = formatCurrency(row.OUSER_PREPAYMENT_NOW_AMOUNT_21)
    }
    if (row.OUSER_PREPAYMENT_BEFORE_AMOUNT_90) {
      row.OUSER_PREPAYMENT_BEFORE_AMOUNT_90 = formatCurrency(row.OUSER_PREPAYMENT_BEFORE_AMOUNT_90)
    }
    if (row.OUSER_PREPAYMENT_NOW_AMOUNT_90) {
      row.OUSER_PREPAYMENT_NOW_AMOUNT_90 = formatCurrency(row.OUSER_PREPAYMENT_NOW_AMOUNT_90)
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

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

module.exports = {
  //每日还款金额数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack
    func.connPool1(query, [tableName.prepaymentStatistics, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.prepaymentStatistics], function (err, rs) {
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
    if (global.prepaymentStatisticsCount === 0) {
      global.prepaymentStatisticsCount++
      pro.exec(shell.prepaymentStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '提前还款统计shell脚本执行失败')
          res.json({code: '500'})
          global.prepaymentStatisticsCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '提前还款统计shell脚本执行成功')
          res.json({code: '200'})
          global.prepaymentStatisticsCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '提前还款统计开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.selectAll + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.prepaymentStatistics], function (err, rs) {
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
