let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {formatCurrency, mosaicName, analysis} = require('../../../utils/utils')
let {exportJsonToExcel} = require('../../../utils/excel')
let fs = require('fs')
let path = require('path')
// let XLSXWriter = require('xlsx-writestream')

const tHeader = [['', '后台数据', '第三方数据', '差异(后台-第三方)', '后台数据', '第三方数据', '差异(后台-第三方)', '后台数据', '第三方数据', '差异(后台-第三方)', '后台数据', '第三方数据', '差异(后台-第三方)', '后台数据', '第三方数据', '差异(后台-第三方)', '后台数据', '第三方数据', '差异(后台-第三方)', '线下免还款金额', '优惠金额', '备注'], ['日期', '富友账户', '', '', '连连账户', '', '', '支付宝账户', '', '', '益码通支付宝账户', '', '', '拉卡拉', '', '', '合利宝', '', '', '批注', '', '']]
const filterVal = ['d_date', 'AMT_FY', 'AMT_FY_THIRD', 'AMT_FY_DIFF', 'AMT_LL', 'AMT_LL_THIRD', 'AMT_LL_DIFF', 'AMT_ZFB', 'AMT_ZFB_THIRD', 'AMT_ZFB_DIFF', 'AMT_YMT', 'AMT_YMT_THIRD', 'AMT_YMT_DIFF', 'AMT_LKL', 'AMT_LKL_THIRD', 'AMT_LKL_DIFF', 'AMT_HLB', 'AMT_HLB_THIRD', 'AMT_HLB_DIFF', 'AMT_JM', 'AMT_YH', 'REMARK']
const merge = [[0, 0, 0, 1], [1, 0, 3, 0], [4, 0, 6, 0], [7, 0, 9, 0], [10, 0, 12, 0], [13, 0, 15, 0], [16, 0, 18, 0], [19, 0, 21, 0]]
const change = [['A1', '  日期'], ['B1', '    富友账户'], ['E1', '          连连账户'], ['H1', '          支付宝账户'], ['K1', '     益码通支付宝账户'], ['N1', '           拉卡拉'],['Q1', '           合利宝'], ['T1', '         批注']]

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }

    if (row.AMT_FY !== '' && row.AMT_FY !== null && row.AMT_FY_THIRD !== null && row.AMT_FY_THIRD !== null) {
      let temp = parseFloat(row.AMT_FY) - parseFloat(row.AMT_FY_THIRD)
      if (temp === 0) {
        row.AMT_FY_DIFF = 0
      } else {
        row.AMT_FY_DIFF = formatCurrency(temp)
      }
    }

    if (row.AMT_LL !== '' && row.AMT_LL !== null && row.AMT_LL_THIRD !== null && row.AMT_LL_THIRD !== null) {
      let temp = parseFloat(row.AMT_LL) - parseFloat(row.AMT_LL_THIRD)
      if (temp === 0) {
        row.AMT_LL_DIFF = 0
      } else {
        row.AMT_LL_DIFF = formatCurrency(temp)
      }
    }

    if (row.AMT_ZFB !== '' && row.AMT_ZFB !== null && row.AMT_ZFB_THIRD !== null && row.AMT_ZFB_THIRD !== null) {
      let temp = parseFloat(row.AMT_ZFB) - parseFloat(row.AMT_ZFB_THIRD)
      if (temp === 0) {
        row.AMT_ZFB_DIFF = 0
      } else {
        row.AMT_ZFB_DIFF = formatCurrency(temp)
      }
    }

    if (row.AMT_YMT !== '' && row.AMT_YMT !== null && row.AMT_YMT_THIRD !== null && row.AMT_YMT_THIRD !== null) {
      let temp = parseFloat(row.AMT_YMT) - parseFloat(row.AMT_YMT_THIRD)
      if (temp === 0) {
        row.AMT_YMT_DIFF = 0
      } else {
        row.AMT_YMT_DIFF = formatCurrency(temp)
      }
    }

    if (row.AMT_LKL !== '' && row.AMT_LKL !== null && row.AMT_LKL_THIRD !== null && row.AMT_LKL_THIRD !== null) {
      let temp = parseFloat(row.AMT_LKL) - parseFloat(row.AMT_LKL_THIRD)
      if (temp === 0) {
        row.AMT_LKL_DIFF = 0
      } else {
        row.AMT_LKL_DIFF = formatCurrency(temp)
      }
    }
    if (row.AMT_HLB !== '' && row.AMT_HLB !== null && row.AMT_HLB_THIRD !== null && row.AMT_HLB_THIRD !== null) {
      let temp = parseFloat(row.AMT_HLB) - parseFloat(row.AMT_HLB_THIRD)
      if (temp === 0) {
        row.AMT_HLB_DIFF = 0
      } else {
        row.AMT_HLB_DIFF = formatCurrency(temp)
      }
    }
    if (row.AMT_FY) {
      row.AMT_FY = formatCurrency(row.AMT_FY)
    }
    if (row.AMT_LL) {
      row.AMT_LL = formatCurrency(row.AMT_LL)
    }
    if (row.AMT_ZFB) {
      row.AMT_ZFB = formatCurrency(row.AMT_ZFB)
    }
    if (row.AMT_YMT) {
      row.AMT_YMT = formatCurrency(row.AMT_YMT)
    }
    if (row.AMT_JM) {
      row.AMT_JM = formatCurrency(row.AMT_JM)
    }
    if (row.AMT_LKL) {
      row.AMT_LKL = formatCurrency(row.AMT_LKL)
    }
    if (row.AMT_HLB) {
      row.AMT_HLB = formatCurrency(row.AMT_HLB)
    }
    if (row.AMT_YH) {
      row.AMT_YH = formatCurrency(row.AMT_YH)
    }

    if (row.AMT_FY_THIRD) {
      row.AMT_FY_THIRD = formatCurrency(row.AMT_FY_THIRD)
    }
    if (row.AMT_LL_THIRD) {
      row.AMT_LL_THIRD = formatCurrency(row.AMT_LL_THIRD)
    }
    if (row.AMT_ZFB_THIRD) {
      row.AMT_ZFB_THIRD = formatCurrency(row.AMT_ZFB_THIRD)
    }
    if (row.AMT_YMT_THIRD) {
      row.AMT_YMT_THIRD = formatCurrency(row.AMT_YMT_THIRD)
    }
    if (row.AMT_LKL_THIRD) {
      row.AMT_LKL_THIRD = formatCurrency(row.AMT_LKL_THIRD)
    }
    if (row.AMT_HLB_THIRD) {
      row.AMT_HLB_THIRD = formatCurrency(row.AMT_HLB_THIRD)
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
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 't.d_date', 'w')
    let order = params.order || sql.financeAnalysis.reconciliationAnalysis.orderBy
    let query = sql.financeAnalysis.reconciliationAnalysis.selectAllFront + queries + order + sql.financeAnalysis.reconciliationAnalysis.selectAllBack

    func.connPool1(query, [tableName.reconciliationAnalysis.t, tableName.reconciliationAnalysis.t1, params.offset, params.limit], function (err, rs) {
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
    let query = sql.financeAnalysis.reconciliationAnalysis.getCount + queries
    func.connPool1(query, [tableName.reconciliationAnalysis.t], function (err, rs) {
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
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 't.d_date', 'w')
    let query = sql.financeAnalysis.reconciliationAnalysis.selectAllFront + queries + sql.financeAnalysis.reconciliationAnalysis.orderBy
    func.connPool1(query, [tableName.reconciliationAnalysis.t, tableName.reconciliationAnalysis.t1], function (err, rs) {
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
  },
  //数据变更
  modify (req, res) {
    let params = req.body.formData
    let date = req.body.date
    let query = sql.financeAnalysis.reconciliationAnalysis.upadte
    func.connPool1(query, [tableName.reconciliationAnalysis.t1, changeItem(params.AMT_FY_THIRD), changeItem(params.AMT_FY_DIFF), changeItem(params.AMT_LL_THIRD), changeItem(params.AMT_LL_DIFF), changeItem(params.AMT_ZFB_THIRD), changeItem(params.AMT_ZFB_DIFF), changeItem(params.AMT_YMT_THIRD), changeItem(params.AMT_YMT_DIFF), changeItem(params.AMT_LKL_THIRD), changeItem(params.AMT_LKL_DIFF), changeItem(params.AMT_HLB_THIRD), changeItem(params.AMT_HLB_DIFF), params.REMARK, date], function (err, rs) {
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
