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

const tHeader = [['', '', 'ZCM开心分期', 'XW开心分期', 'ZCM消费分期', 'XW消费分期', '合计', 'ZCM开心分期', 'XW开心分期', 'ZCM消费分期', 'XW消费分期', '合计', 'ZCM开心分期', 'XW开心分期', 'ZCM消费分期', 'XW消费分期', '合计'], ['年', '月份', '', '', '借款金额(元)', '', '', '', '', '利息(元)', '', '', '', '', '放款笔数', '', '']]
const filterVal = ['D_YEAR', 'D_MONTH', 'KXLOAN_AMT_Z', 'KXLOAN_AMT_X', 'XFLOAN_AMT_Z', 'XFLOAN_AMT_X', 'LOAN_AMT', 'KX_INTEREST_Z', 'KX_INTEREST_X', 'XF_INTEREST_Z', 'XF_INTEREST_X', 'INTEREST_AMT', 'KXLOAN_CNT_Z', 'KXLOAN_CNT_X', 'XFLOAN_CNT_Z', 'XFLOAN_CNT_X', 'LOAN_CNT']
//横坐标纵坐标
const merge = [[0, 0, 0, 1],[1, 0, 1, 1], [2, 0, 6, 0], [7, 0, 11, 0], [12, 0, 16, 0]]
const change = [['A1', '    年'],['B1', '    月份'], ['C1', '                 借款金额(元)'], ['H1', '                 利息(元)'], ['M1', '                 放款笔数']]

global.monthlyBondDataCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.CREATE_TIME) {
      row.CREATE_TIME = moment(row.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.D_MONTH) {
      row.D_MONTH = row.D_MONTH + '月'
    }
    // money
    if (row.KXLOAN_AMT_Z) {
      row.KXLOAN_AMT_Z = formatCurrency(row.KXLOAN_AMT_Z)
    }
    if (row.KXLOAN_AMT_X) {
      row.KXLOAN_AMT_X = formatCurrency(row.KXLOAN_AMT_X)
    }
    if (row.XFLOAN_AMT_Z) {
      row.XFLOAN_AMT_Z = formatCurrency(row.XFLOAN_AMT_Z)
    }
    if (row.XFLOAN_AMT_X) {
      row.XFLOAN_AMT_X = formatCurrency(row.XFLOAN_AMT_X)
    }
    if (row.LOAN_AMT) {
      row.LOAN_AMT = formatCurrency(row.LOAN_AMT)
    }
    if (row.KX_INTEREST_Z) {
      row.KX_INTEREST_Z = formatCurrency(row.KX_INTEREST_Z)
    }
    if (row.KX_INTEREST_X) {
      row.KX_INTEREST_X = formatCurrency(row.KX_INTEREST_X)
    }
    if (row.XF_INTEREST_Z) {
      row.XF_INTEREST_Z = formatCurrency(row.XF_INTEREST_Z)
    }
    if (row.XF_INTEREST_X) {
      row.XF_INTEREST_X = formatCurrency(row.XF_INTEREST_X)
    }
    if (row.INTEREST_AMT) {
      row.INTEREST_AMT = formatCurrency(row.INTEREST_AMT)
    }
    // num
    if (row.KXLOAN_CNT_Z) {
      row.KXLOAN_CNT_Z = formatInt(row.KXLOAN_CNT_Z)
    }
    if (row.KXLOAN_CNT_X) {
      row.KXLOAN_CNT_X = formatInt(row.KXLOAN_CNT_X)
    }
    if (row.XFLOAN_CNT_Z) {
      row.XFLOAN_CNT_Z = formatInt(row.XFLOAN_CNT_Z)
    }
    if (row.XFLOAN_CNT_X) {
      row.XFLOAN_CNT_X = formatInt(row.XFLOAN_CNT_X)
    }
    if (row.LOAN_CNT) {
      row.LOAN_CNT = formatInt(row.LOAN_CNT)
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_month', 'w')
    let order = params.order || sql.period.orderMonth
    let query = sql.period.selectAll + queries + order + sql.period.selectAllBack
    func.connPool1(query, [tableName.period.monthlyBondData, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'd_month', 'w')
    let query = sql.period.getCount + queries
    func.connPool1(query, [tableName.period.monthlyBondData], function (err, rs) {
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
    if (global.monthlyBondDataCount === 0) {
      global.monthlyBondDataCount++
      pro.exec(shell.monthlyBondData, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每月债权表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.monthlyBondDataCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每月债权表shell脚本执行成功')
          res.json({code: '200'})
          global.monthlyBondDataCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期每月债权表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    console.log(params)
    let queries = analysis(params, 'd_month', 'w')
    console.log(queries)
    let query = sql.period.selectAll + queries + sql.period.orderMonth
    func.connPool1(query, [tableName.period.monthlyBondData], function (err, rs) {
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
