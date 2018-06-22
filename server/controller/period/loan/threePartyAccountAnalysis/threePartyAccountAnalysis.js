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
let XLSXWriter = require('xlsx-writestream')

//第一个数组是第二行，第一个数组输第一行
const tHeader = [['', 'ZCM开心分期连连(元)', 'ZCM消费分期连连(元)', 'ZB开心分期连连(元)', 'ZB消费分期连连(元)', 'ZB开心分期益码通(元)', 'ZB消费分期益码通(元)', 'XN零钱充值连连(元)', 'XN零钱充值益码通(元)', 'XN续期连连(元)', 'XN续期益码通(元)', '合计(元)', 'ZCM连连(元)', 'ZB连连(元)', 'ZB益码通(元)', 'XN连连(元)', 'XN益码通(元)', '合计(元)', 'ZCM连连(元)', 'ZB连连(元)', 'ZB益码通(元)', 'XN连连(元)', 'XN益码通(元)', '合计(元)'], ['日期', '', '', '', '', '技术后台数据', '', '', '', '', '', '', '','第三方账户数据', '', '', '', '', '', '差异(技术后台-第三方账户)', '', '', '', '创建时间']]
const filterVal = ['D_DATE', 'LL_ZCM_KX', 'LL_ZCM_XF', 'LL_ZB_KX', 'LL_ZB_XF', 'YMT_ZB_KX', 'YMT_ZB_XF', 'LL_LQ_XN', 'YMT_LQ_XN', 'LL_XQ_XN', 'YMT_XQ_XN', 'TOTAL_AMT', 'LL_ZCM_T', 'LL_ZB_T', 'YMT_ZB_T', 'LL_XN_T', 'YMT_XN_T', 'TOTAL_AMT_T', 'LL_ZCM_D', 'LL_ZB_D', 'YMT_ZB_D', 'LL_XN_D', 'YMT_XN_D', 'TOTAL_AMT_D', 'CREATE_TIME']
//横坐标纵坐标
const merge = [[0, 0, 0, 1], [1, 0, 11, 0], [12, 0, 17, 0], [18, 0, 23, 0], [24, 0, 24, 1]]
const change = [['A1', '    日期'], ['B1', '                                                                                                     技术后台数据'], ['M1', '                                第三方账户数据'], ['S1', '                         差异(技术后台-第三方账户)'], ['Y1', '      创建时间']]

global.threePartyAccountAnalysisCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

//千分位表示为普通数字表示
// function changeItem(a) {
//   if (a === 0 || a === '0') {
//     return a
//   }
//   return parseFloat(a.split(',').join(''))
// }

function formatData(rows) {
  return rows.map(row => {
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD ')
    }
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.LL_ZCM_KX) {
      row.LL_ZCM_KX = formatCurrency(row.LL_ZCM_KX)
    }
    if (row.LL_ZCM_XF) {
      row.LL_ZCM_XF = formatCurrency(row.LL_ZCM_XF)
    }
    if (row.LL_ZB_KX) {
      row.LL_ZB_KX = formatCurrency(row.LL_ZB_KX)
    }
    if (row.LL_ZB_XF) {
      row.LL_ZB_XF = formatCurrency(row.LL_ZB_XF)
    }
    if (row.YMT_ZB_KX) {
      row.YMT_ZB_KX = formatCurrency(row.YMT_ZB_KX)
    }
    if (row.YMT_ZB_XF) {
      row.YMT_ZB_XF = formatCurrency(row.YMT_ZB_XF)
    }
    if (row.LL_LQ_XN) {
      row.LL_LQ_XN = formatCurrency(row.LL_LQ_XN)
    }
    if (row.YMT_LQ_XN) {
      row.YMT_LQ_XN = formatCurrency(row.YMT_LQ_XN)
    }
    if (row.LL_XQ_XN) {
      row.LL_XQ_XN = formatCurrency(row.LL_XQ_XN)
    }
    if (row.YMT_XQ_XN) {
      row.YMT_XQ_XN = formatCurrency(row.YMT_XQ_XN)
    }
    if (row.TOTAL_AMT) {
      row.TOTAL_AMT = formatCurrency(row.TOTAL_AMT)
    }
    if (row.LL_ZCM_T) {
      row.LL_ZCM_T = formatCurrency(row.LL_ZCM_T)
    }
    if (row.LL_ZB_T) {
      row.LL_ZB_T = formatCurrency(row.LL_ZB_T)
    }
    if (row.YMT_ZB_T) {
      row.YMT_ZB_T = formatCurrency(row.YMT_ZB_T)
    }
    if (row.LL_XN_T) {
      row.LL_XN_T = formatCurrency(row.LL_XN_T)
    }
    if (row.YMT_XN_T) {
      row.YMT_XN_T = formatCurrency(row.YMT_XN_T)
    }
    if (row.TOTAL_AMT_T) {
      row.TOTAL_AMT_T = formatCurrency(row.TOTAL_AMT_T)
    }
    if (row.LL_ZCM_KX !== '' && row.LL_ZCM_KX !== null && row.LL_ZCM_XF !== null && row.LL_ZCM_XF !== null && row.LL_ZCM_T !== null && row.LL_ZCM_T !== null) {
      let temp = parseFloat(row.LL_ZCM_KX) + parseFloat(row.LL_ZCM_XF) - parseFloat(row.LL_ZCM_T)
      if (temp === 0) {
        row.LL_ZCM_D = 0
      } else {
        row.LL_ZCM_D = formatCurrency(temp)
      }
    }
    if (row.LL_ZB_KX !== '' && row.LL_ZB_KX !== null && row.LL_ZB_XF !== null && row.LL_ZB_XF !== null && row.LL_ZB_T !== null && row.LL_ZB_T !== null) {
      let temp = parseFloat(row.LL_ZB_KX) + parseFloat(row.LL_ZB_XF) - parseFloat(row.LL_ZB_T)
      if (temp === 0) {
        row.LL_ZB_D = 0
      } else {
        row.LL_ZB_D = formatCurrency(temp)
      }
    }
    if (row.YMT_ZB_KX !== '' && row.YMT_ZB_KX !== null && row.YMT_ZB_XF !== null && row.YMT_ZB_XF !== null && row.YMT_ZB_T !== null && row.YMT_ZB_T !== null) {
      let temp = parseFloat(row.YMT_ZB_KX) + parseFloat(row.YMT_ZB_XF) - parseFloat(row.YMT_ZB_T)
      if (temp === 0) {
        row.YMT_ZB_D = 0
      } else {
        row.YMT_ZB_D = formatCurrency(temp)
      }
    }
    if (row.LL_LQ_XN !== '' && row.LL_LQ_XN !== null && row.LL_XQ_XN !== null && row.LL_XQ_XN !== null && row.LL_XN_T !== null && row.LL_XN_T !== null) {
      let temp = parseFloat(row.LL_LQ_XN) + parseFloat(row.LL_XQ_XN) - parseFloat(row.LL_XN_T)
      if (temp === 0) {
        row.LL_XN_D = 0
      } else {
        row.LL_XN_D = formatCurrency(temp)
      }
    }
    if (row.YMT_LQ_XN !== '' && row.YMT_LQ_XN !== null && row.YMT_XQ_XN !== null && row.YMT_XQ_XN !== null && row.YMT_XN_T !== null && row.YMT_XN_T !== null) {
      let temp = parseFloat(row.YMT_LQ_XN) + parseFloat(row.YMT_XQ_XN) - parseFloat(row.YMT_XN_T)
      if (temp === 0) {
        row.YMT_XN_D = 0
      } else {
        row.YMT_XN_D = formatCurrency(temp)
      }
    }
    if ((changeItem(row.LL_ZCM_D) !== '' && changeItem(row.LL_ZCM_D) !== null) || (changeItem(row.LL_ZB_D) !== '' && changeItem(row.LL_ZB_D) !== null) || (changeItem(row.YMT_ZB_D) !== '' && changeItem(row.YMT_ZB_D) !== null) || (changeItem(row.LL_XN_D) !== '' && changeItem(row.LL_XN_D) !== null) || (changeItem(row.YMT_XN_D) !== '' && changeItem(row.YMT_XN_D) !== null)) {
      let temp = Number(changeItem(row.LL_ZCM_D)) + Number(changeItem(row.LL_ZB_D)) + Number(changeItem(row.YMT_ZB_D))+ Number(changeItem(row.LL_XN_D))+ parseFloat(Number(row.YMT_XN_D))
      if (temp === 0) {
        row.TOTAL_AMT_D = 0
      } else {
        row.TOTAL_AMT_D = formatCurrency(temp)
      }
    }

    /*if (row.LL_ZCM_D) {
      row.LL_ZCM_D = formatCurrency(row.LL_ZCM_D)
    }
    if (row.LL_ZB_D) {
      row.LL_ZB_D = formatCurrency(row.LL_ZB_D)
    }
    if (row.YMT_ZB_D) {
      row.YMT_ZB_D = formatCurrency(row.YMT_ZB_D)
    }
    if (row.LL_XN_D) {
      row.LL_XN_D = formatCurrency(row.LL_XN_D)
    }
    if (row.YMT_XN_D) {
      row.YMT_XN_D = formatCurrency(row.YMT_XN_D)
    }
    if (row.TOTAL_AMT_D) {
      row.TOTAL_AMT_D = formatCurrency(row.TOTAL_AMT_D)
    }*/
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
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.threePartyAccountAnalysis.order
    let query = sql.period.threePartyAccountAnalysis.selectSum + queries + ' UNION ALL ' + '(' + sql.period.threePartyAccountAnalysis.selectAll + queries + order + sql.period.threePartyAccountAnalysis.selectAllBack + ')'
    func.connPool1(query, [tableName.period.threePartyAccountAnalysis, tableName.period.threePartyAccountAnalysis, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.period.threePartyAccountAnalysis], function (err, rs) {
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
    if (global.threePartyAccountAnalysisCount === 0) {
      global.threePartyAccountAnalysisCount++
      pro.exec(shell.threePartyAccountAnalysis, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期三方对账shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.threePartyAccountAnalysisCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期三方对账shell脚本执行成功')
          res.json({code: '200'})
          global.threePartyAccountAnalysisCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期三方对账开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.threePartyAccountAnalysis.selectSum + queries + ' UNION ALL ' + '(' + sql.period.threePartyAccountAnalysis.selectAll + queries + sql.period.threePartyAccountAnalysis.order + ')'
    func.connPool1(query, [tableName.period.threePartyAccountAnalysis, tableName.period.threePartyAccountAnalysis], function (err, rs) {
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
  },
  //数据变更
  modify (req, res) {
    let params = req.body.formData
    let query = sql.period.threePartyAccountAnalysis.update
    func.connPool1(query, [tableName.period.threePartyAccountAnalysis, changeItem(params.LL_ZCM_T), changeItem(params.LL_ZB_T), changeItem(params.YMT_ZB_T), changeItem(params.LL_XN_T), changeItem(params.YMT_XN_T), changeItem(params.TOTAL_AMT_T), changeItem(params.LL_ZCM_D), changeItem(params.LL_ZB_D), changeItem(params.YMT_ZB_D), changeItem(params.LL_XN_D), changeItem(params.YMT_XN_D), changeItem(params.TOTAL_AMT_D), req.body.date], function (err, rs) {
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
