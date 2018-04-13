let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, mosaicName, analysis, formatInt} = require('../../../../utils/utils')
let {exportJsonToExcel} = require('../../../../utils/excel')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
global.repaymentCouponAnalysisCount = 0

const tHeader = [['', '', '', '未发券', '50元券', '100元券', '未发券', '50元券', '100元券', '未发券', '50元券', '100元券', '未发券', '50元券', '100元券', '未发券', '50元券', '100元券', '未发券', '50元券', '100元券','',''],['', '当日到期','次日到期', '当日到期','次日到期', '当日到期','次日到期', '当日到期','次日到期', ''], ['日期', '到期用户数','发券用户数','还款/用券用户数','还款/用券率', '刷新时间']]
const filterVal = ['d_date', 'd_Expuser_cnt', 'n_Expuser_cnt', 'd_uncoupon_cnt', 'd_Fiftycoupon_cnt', 'd_hundredcoupon_cnt', 'n_uncoupon_cnt', 'n_Fiftycoupon_cnt', 'n_hundredcoupon_cnt', 'd_uncouponrep_cnt', 'd_Fiftycouponrep_cnt', 'd_hundredcouponrep_cnt', 'n_uncouponrep_cnt', 'n_Fiftycouponrep_cnt', 'n_hundredcouponrep_cnt', 'd_unreprate_cnt', 'd_Fiftyreprate_cnt', 'd_hundredreprate_cnt', 'n_unreprate_cnt', 'n_Fiftyreprate_cnt', 'n_hundredreprate_cnt', 'CREATE_TIME']
const merge = [[0, 0, 0, 2], [1, 0, 2, 0], [3, 0, 8, 0], [9, 0, 14, 0], [15, 0, 20, 0], [21, 0, 21, 2], [1, 1, 1, 2], [2, 1, 2, 2], [3, 1, 5, 1], [6, 1, 8, 1], [9, 1, 11, 1], [12, 1, 14, 1], [15, 1, 17, 1], [18, 1, 20, 1]]
const change = [['A1', '  日期'], ['B1', '  到期用户数'], ['D1', '                 发券用户数'], ['J1', '               还款/用券用户数'], ['P1', '            还款/用券率'], ['V1', '刷新时间'],['B2', '当日到期'],['C2', '次日到期'],['D2', '          当日到期'],['G2', '          次日到期'],['J2', '          当日到期'],['M2', '          次日到期'],['P2', '          当日到期'],['S2', '          次日到期']]

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.CREATE_TIME) {
      row.CREATE_TIME = moment(row.CREATE_TIME).format('YYYY-MM-DD hh:mm:ss')
    }

    if (row.LOAN_TERM) {
      row.LOAN_TERM = formatInt(row.LOAN_TERM)
    }

    if (row.d_unreprate_cnt) {
      row.d_unreprate_cnt = (row.d_unreprate_cnt * 100).toFixed(2) + '%'
    }
    if (row.d_Fiftyreprate_cnt) {
      row.d_Fiftyreprate_cnt = (row.d_Fiftyreprate_cnt * 100).toFixed(2) + '%'
    }
    if (row.d_hundredreprate_cnt) {
      row.d_hundredreprate_cnt = (row.d_hundredreprate_cnt * 100).toFixed(2) + '%'
    }
    if (row.n_unreprate_cnt) {
      row.n_unreprate_cnt = (row.n_unreprate_cnt * 100).toFixed(2) + '%'
    }
    if (row.n_Fiftyreprate_cnt) {
      row.n_Fiftyreprate_cnt = (row.n_Fiftyreprate_cnt * 100).toFixed(2) + '%'
    }
    if (row.n_hundredreprate_cnt) {
      row.n_hundredreprate_cnt = (row.n_hundredreprate_cnt * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack

    func.connPool1(query, [tableName.repaymentCouponAnalysis, params.offset, params.limit], function (err, rs) {
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
    let query = sql.dataAnalysis.selectAll + queries
    func.connPool1(query, [tableName.repaymentCouponAnalysis], function (err, rs) {
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
    if (global.repaymentCouponAnalysisCount === 0) {
      global.repaymentCouponAnalysisCount++
      pro.exec(shell.repaymentCouponAnalysis, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 还款抵扣券分析shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.repaymentCouponAnalysisCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 还款抵扣券分析shell脚本执行成功')
          res.json({code: '200'})
          global.repaymentCouponAnalysisCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 还款抵扣券分析开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.selectAll + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.repaymentCouponAnalysis], function (err, rs) {
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
}
