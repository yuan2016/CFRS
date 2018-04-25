let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, mosaicName, analysis} = require('../../../../utils/utils')
let {exportJsonToExcel} = require('../../../../utils/excel')
let fs = require('fs')
let path = require('path')
// let XLSXWriter = require('xlsx-writestream')

const tHeader = [['', '后台数据', '第三方数据', '差异(后台-第三方)', '后台数据', '第三方数据', '差异(后台-第三方)',  '后台数据', '第三方数据', '差异(后台-第三方)', '后台数据', '第三方数据', '差异(后台-第三方)', '总差异额', '备注', '更新时间'], ['日期', '支付宝账户', '微信账户', '邮费支付宝账户', '邮费微信账户', '汇总']]
const filterVal = ['d_date', 'Alipay_amt', 'Alipay_amt_third', 'Alipay_amt_diff', 'WeChat_amt', 'WeChat_amt_third', 'WeChat_amt_diff', 'post_alipay_amt', 'post_alipay_amt_third', 'post_alipay_amt_diff', 'post_wechat_amt', 'post_wechat_amt_third', 'post_wechat_amt_diff', 'all_amt_diff', 'remark', 'UPDATE_TIME']
const merge = [[0, 0, 0, 1], [1, 0, 3, 0], [4, 0, 6, 0], [7, 0, 9, 0], [10, 0, 12, 0], [13, 0, 15, 0]]
const change = [['A1', '  日期'], ['B1', '    支付宝账户'], ['E1', '          微信账户'], ['H1', '      邮费支付宝账户'], ['K1', '     邮费微信账户'], ['N1', '          汇总']]

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.Alipay_amt !== '' && row.Alipay_amt !== null && row.Alipay_amt_third !== null && row.Alipay_amt_third !== null) {
      let temp = parseFloat(row.Alipay_amt) - parseFloat(row.Alipay_amt_third)
      if (temp === 0) {
        row.Alipay_amt_diff = 0
      } else {
        row.Alipay_amt_diff = formatCurrency(temp)
      }
    }

    if (row.WeChat_amt !== '' && row.WeChat_amt !== null && row.WeChat_amt_third !== null && row.WeChat_amt_third !== null) {
      let temp = parseFloat(row.WeChat_amt) - parseFloat(row.WeChat_amt_third)
      if (temp === 0) {
        row.WeChat_amt_diff = 0
      } else {
        row.WeChat_amt_diff = formatCurrency(temp)
      }
    }
    if (row.post_alipay_amt !== '' && row.post_alipay_amt !== null && row.post_alipay_amt_third !== null && row.post_alipay_amt_third !== null) {
      let temp = parseFloat(row.post_alipay_amt) - parseFloat(row.post_alipay_amt_third)
      if (temp === 0) {
        row.post_alipay_amt_diff = 0
      } else {
        row.post_alipay_amt_diff = formatCurrency(temp)
      }
    }
    if (row.post_wechat_amt !== '' && row.post_wechat_amt !== null && row.post_wechat_amt_third !== null && row.post_wechat_amt_third !== null) {
      let temp = parseFloat(row.post_wechat_amt) - parseFloat(row.post_wechat_amt_third)
      if (temp === 0) {
        row.post_wechat_amt_diff = 0
      } else {
        row.post_wechat_amt_diff = formatCurrency(temp)
      }
    }
    if (row.all_amt_diff) {
      row.all_amt_diff = formatCurrency(row.all_amt_diff)
    }
    if (row.Alipay_amt) {
      row.Alipay_amt = formatCurrency(row.Alipay_amt)
    }
    if (row.WeChat_amt) {
      row.WeChat_amt = formatCurrency(row.WeChat_amt)
    }
    if (row.post_alipay_amt) {
      row.post_alipay_amt = formatCurrency(row.post_alipay_amt)
    }
    if (row.post_wechat_amt) {
      row.post_wechat_amt = formatCurrency(row.post_wechat_amt)
    }

    if (row.Alipay_amt_third) {
      row.Alipay_amt_third = formatCurrency(row.Alipay_amt_third)
    }
    if (row.WeChat_amt_third) {
      row.WeChat_amt_third = formatCurrency(row.WeChat_amt_third)
    }
    if (row.post_alipay_amt_third) {
      row.post_alipay_amt_third = formatCurrency(row.post_alipay_amt_third)
    }
    if (row.post_wechat_amt_third) {
      row.post_wechat_amt_third = formatCurrency(row.post_wechat_amt_third)
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
    let order = params.order || sql.financeAnalysis.reconciliationAnalysisQE.orderBy
    let query = sql.financeAnalysis.reconciliationAnalysisQE.selectAllFront + queries + order + sql.financeAnalysis.reconciliationAnalysisQE.selectAllBack
    func.connPool1(query, [tableName.reconciliationAnalysisQE.t, tableName.reconciliationAnalysisQE.t1, params.offset, params.limit], function (err, rs) {
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
    let query = sql.financeAnalysis.reconciliationAnalysisQE.getCount + queries
    func.connPool1(query, [tableName.reconciliationAnalysisQE.t], function (err, rs) {
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
    let query = sql.financeAnalysis.reconciliationAnalysisQE.selectAllFront + queries + sql.financeAnalysis.reconciliationAnalysisQE.orderBy
    func.connPool1(query, [tableName.reconciliationAnalysisQE.t, tableName.reconciliationAnalysisQE.t1], function (err, rs) {
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
    let query = sql.financeAnalysis.reconciliationAnalysisQE.upadte
    func.connPool1(query, [tableName.reconciliationAnalysisQE.t1, changeItem(params.Alipay_amt_third), changeItem(params.Alipay_amt_diff), changeItem(params.WeChat_amt_third), changeItem(params.WeChat_amt_diff), changeItem(params.post_alipay_amt_third), changeItem(params.post_alipay_amt_diff), changeItem(params.post_wechat_amt_third), changeItem(params.post_wechat_amt_diff), changeItem(params.all_amt_diff), params.remark, date], function (err, rs) {
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
