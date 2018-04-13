let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {formatCurrency, mosaicName, analysis, formatInt} = require('../../../utils/utils')
let {exportJsonToExcel} = require('../../../utils/excel')
let path = require('path')
let fs = require('fs')

const tHeader = [['', '','A类', 'B类', 'C类', 'D类', '其他借款', '小计', 'A类', 'B类', 'C类', 'D类', '其他借款', '小计', 'A类', 'B类', 'C类', 'D类', '其他借款', '小计', 'A类', 'B类', 'C类', 'D类', '其他借款', '小计','',''], ['日期', '期限', '放款金额','','','','', '','实际放款金额', '','','','','','放款笔数','','','','','', '应收服务费和加急费','','','','','', '创建时间', '更新时间']]
const filterVal = ['D_DATE', 'LOAN_TERM', 'MONEY_AMOUNT_A', 'MONEY_AMOUNT_B', 'MONEY_AMOUNT_C', 'MONEY_AMOUNT_D', 'MONEY_AMOUNT_O', 'MONEY_AMOUNT_SUM', 'INTO_MONEY_A', 'INTO_MONEY_B', 'INTO_MONEY_C', 'INTO_MONEY_D', 'INTO_MONEY_O', 'INTO_MONEY_SUM', 'TRADE_CNT_A', 'TRADE_CNT_B', 'TRADE_CNT_C', 'TRADE_CNT_D', 'TRADE_CNT_O', 'TRADE_CNT_SUM', 'FEE_A', 'FEE_B', 'FEE_C', 'FEE_D', 'FEE_O', 'FEE_SUM', 'CREATE_TIME', 'UPDATE_TIME']
const merge = [[0, 0, 0, 1], [1, 0, 1, 1], [2, 0, 7, 0], [8, 0, 13, 0], [14, 0, 19, 0], [20, 0, 25, 0], [26, 0, 26, 1], [27, 0, 27, 1]]
const change = [['A1', '  日期'], ['B1', '  期限'], ['C1', '                 放款金额'], ['I1', '               实际放款金额'], ['O1', '            放款笔数'], ['U1', '                  应收服务费和加急费'], ['AA', '创建时间'], ['AB', '更新时间']]

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData (rows) {
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

    if (row.LOAN_TERM) {
      row.LOAN_TERM = formatInt(row.LOAN_TERM)
    }

    if (row.MONEY_AMOUNT_A) {
      row.MONEY_AMOUNT_A = formatCurrency(row.MONEY_AMOUNT_A)
    }
    if (row.MONEY_AMOUNT_B) {
      row.MONEY_AMOUNT_B = formatCurrency(row.MONEY_AMOUNT_B)
    }
    if (row.MONEY_AMOUNT_C) {
      row.MONEY_AMOUNT_C = formatCurrency(row.MONEY_AMOUNT_C)
    }
    if (row.MONEY_AMOUNT_D) {
      row.MONEY_AMOUNT_D = formatCurrency(row.MONEY_AMOUNT_D)
    }
    if (row.MONEY_AMOUNT_O) {
      row.MONEY_AMOUNT_O = formatCurrency(row.MONEY_AMOUNT_O)
    }
    if (row.MONEY_AMOUNT_SUM) {
      row.MONEY_AMOUNT_SUM = formatCurrency(row.MONEY_AMOUNT_SUM)
    }

    if (row.INTO_MONEY_A) {
      row.INTO_MONEY_A = formatCurrency(row.INTO_MONEY_A)
    }
    if (row.INTO_MONEY_B) {
      row.INTO_MONEY_B = formatCurrency(row.INTO_MONEY_B)
    }
    if (row.INTO_MONEY_C) {
      row.INTO_MONEY_C = formatCurrency(row.INTO_MONEY_C)
    }
    if (row.INTO_MONEY_D) {
      row.INTO_MONEY_D = formatCurrency(row.INTO_MONEY_D)
    }
    if (row.INTO_MONEY_O) {
      row.INTO_MONEY_O = formatCurrency(row.INTO_MONEY_O)
    }
    if (row.INTO_MONEY_SUM) {
      row.INTO_MONEY_SUM = formatCurrency(row.INTO_MONEY_SUM)
    }

    if (row.TRADE_CNT_A) {
      row.TRADE_CNT_A = formatInt(row.TRADE_CNT_A)
    }
    if (row.TRADE_CNT_B) {
      row.TRADE_CNT_B = formatInt(row.TRADE_CNT_B)
    }
    if (row.TRADE_CNT_C) {
      row.TRADE_CNT_C = formatInt(row.TRADE_CNT_C)
    }
    if (row.TRADE_CNT_D) {
      row.TRADE_CNT_D = formatInt(row.TRADE_CNT_D)
    }
    if (row.TRADE_CNT_O) {
      row.TRADE_CNT_O = formatInt(row.TRADE_CNT_O)
    }
    if (row.TRADE_CNT_SUM) {
      row.TRADE_CNT_SUM = formatInt(row.TRADE_CNT_SUM)
    }

    if (row.FEE_A) {
      row.FEE_A = formatCurrency(row.FEE_A)
    }
    if (row.FEE_B) {
      row.FEE_B = formatCurrency(row.FEE_B)
    }
    if (row.FEE_C) {
      row.FEE_C = formatCurrency(row.FEE_C)
    }
    if (row.FEE_D) {
      row.FEE_D = formatCurrency(row.FEE_D)
    }
    if (row.FEE_O) {
      row.FEE_O = formatCurrency(row.FEE_O)
    }
    if (row.FEE_SUM) {
      row.FEE_SUM = formatCurrency(row.FEE_SUM)
    }

    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.financeAnalysis.lendingDaily.orderBy
    let query = sql.financeAnalysis.lendingDaily.selectAllFront + queries + order + sql.financeAnalysis.lendingDaily.selectAllBack
    func.connPool1(query, [tableName.lendingDaily, params.offset, params.limit], function (err, rs) {
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
    let query = sql.financeAnalysis.lendingDaily.getCount + queries
    func.connPool1(query, [tableName.lendingDaily], function (err, rs) {
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
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.financeAnalysis.lendingDaily.selectAllFront + queries + sql.financeAnalysis.lendingDaily.orderBy
    let query2 = sql.financeAnalysis.lendingDaily.selectSum + queries
    func.connPool1(query, [tableName.lendingDaily], function (err, rs) {
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
      if (rs.length > 0) {
        func.connPool1(query2, [tableName.lendingDaily], function (err, rs2) {
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
          rs.unshift(rs2[0])
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
        })
      }
    }, 180000)
  },
  fetchSum (req, res) {
    let params = req.body
    let queries = analysis(params, 'D_DATE', 'w')
    let query = sql.financeAnalysis.lendingDaily.selectSum + queries
    func.connPool1(query, [tableName.lendingDaily, tableName.lendingDaily, params.offset, params.limit], function (err, rs) {
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
  }
}
