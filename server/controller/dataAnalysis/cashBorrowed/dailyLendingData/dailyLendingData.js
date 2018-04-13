let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.dailyLendingCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.loans_total) {
      row.loans_total = formatCurrency(row.loans_total)
    }
    if (row.loans_total_7day) {
      row.loans_total_7day = formatCurrency(row.loans_total_7day)
    }
    if (row.loans_total_14day) {
      row.loans_total_14day = formatCurrency(row.loans_total_14day)
    }
    if (row.loans_total_21day) {
      row.loans_total_21day = formatCurrency(row.loans_total_21day)
    }
    if (row.loans_total_f_21day) {
      row.loans_total_f_21day = formatCurrency(row.loans_total_f_21day)
    }
    if (row.loans_total_t_21day) {
      row.loans_total_t_21day = formatCurrency(row.loans_total_t_21day)
    }
    if (row.loans_total_90day) {
      row.loans_total_90day = formatCurrency(row.loans_total_90day)
    }
    if (row.loans_total_ouser) {
      row.loans_total_ouser = formatCurrency(row.loans_total_ouser)
    }
    if (row.loans_total_nuser) {
      row.loans_total_nuser = formatCurrency(row.loans_total_nuser)
    }
    //num
    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.loan_num) {
      row.loan_num = formatInt(row.loan_num)
    }
    if (row.success_loan_num) {
      row.success_loan_num = formatInt(row.success_loan_num)
    }
    if (row.loan_singular) {
      row.loan_singular = formatInt(row.loan_singular)
    }
    if (row.loan_singular_7day) {
      row.loan_singular_7day = formatInt(row.loan_singular_7day)
    }
    if (row.loan_singular_14day) {
      row.loan_singular_14day = formatInt(row.loan_singular_14day)
    }
    if (row.loan_singular_21day) {
      row.loan_singular_21day = formatInt(row.loan_singular_21day)
    }
    if (row.loan_singular_f_21day) {
      row.loan_singular_f_21day = formatInt(row.loan_singular_f_21day)
    }
    if (row.loan_singular_ouser) {
      row.loan_singular_ouser = formatInt(row.loan_singular_ouser)
    }
    if (row.loan_singular_nuser) {
      row.loan_singular_nuser = formatInt(row.loan_singular_nuser)
    }
    if (row.loan_singular_t_21day) {
      row.loan_singular_t_21day = formatInt(row.loan_singular_t_21day)
    }
    if (row.loan_singular_90day) {
      row.loan_singular_90day = formatInt(row.loan_singular_90day)
    }

    if (row.CHARGEBACK_FAILRATE) {
      row.CHARGEBACK_FAILRATE = (row.CHARGEBACK_FAILRATE * 100).toFixed(2) + '%'
    }
    if (row.newuser_loan_rate) {
      row.newuser_loan_rate = (row.newuser_loan_rate * 100).toFixed(2) + '%'
    }
    if (row.olduser_loan_rate) {
      row.olduser_loan_rate = (row.olduser_loan_rate * 100).toFixed(2) + '%'
    }
    if (row.accunewuser_loan_rate) {
      row.accunewuser_loan_rate = (row.accunewuser_loan_rate * 100).toFixed(2) + '%'
    }
    if (row.accuolduser_loan_rate) {
      row.accuolduser_loan_rate = (row.accuolduser_loan_rate * 100).toFixed(2) + '%'
    }
    if (row.FULL_AMOUNT_RATE) {
      row.FULL_AMOUNT_RATE = (row.FULL_AMOUNT_RATE * 100).toFixed(2) + '%'
    }
    if (row.NUSER_FULL_AMOUNT_RATE) {
      row.NUSER_FULL_AMOUNT_RATE = (row.NUSER_FULL_AMOUNT_RATE * 100).toFixed(2) + '%'
    }
    if (row.OUSER_FULL_AMOUNT_RATE) {
      row.OUSER_FULL_AMOUNT_RATE = (row.OUSER_FULL_AMOUNT_RATE * 100).toFixed(2) + '%'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.更新时间) {
      row.更新时间 = moment(row.更新时间).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.放款总额) {
      row.放款总额 = formatCurrency(row.放款总额)
    }
    if (row['7天期限放款总额(元)']) {
      row['7天期限放款总额(元)'] = formatCurrency(row['7天期限放款总额(元)'])
    }
    if (row['14天期限放款总额(元)']) {
      row['14天期限放款总额(元)'] = formatCurrency(row['14天期限放款总额(元)'])
    }
    if (row['21天期限放款总额(元)']) {
      row['21天期限放款总额(元)'] = formatCurrency(row['21天期限放款总额(元)'])
    }
    if (row['21天分期放款总额(元)']) {
      row['21天分期放款总额(元)'] = formatCurrency(row['21天分期放款总额(元)'])
    }
    if (row['21天分期提额放款金额(元)']) {
      row['21天分期提额放款金额(元)'] = formatCurrency(row['21天分期提额放款金额(元)'])
    }
    if (row['90天分期放款金额(元)']) {
      row['90天分期放款金额(元)'] = formatCurrency(row['90天分期放款金额(元)'])
    }
    if (row['老用户放款总额(元)']) {
      row['老用户放款总额(元)'] = formatCurrency(row['老用户放款总额(元)'])
    }
    if (row['新用户放款总额(元)']) {
      row['新用户放款总额(元)'] = formatCurrency(row['新用户放款总额(元)'])
    }
    //num
    if (row.注册人数) {
      row.注册人数 = formatInt(row.注册人数)
    }
    if (row.借款人数) {
      row.借款人数 = formatInt(row.借款人数)
    }
    if (row.成功借款人数) {
      row.成功借款人数 = formatInt(row.成功借款人数)
    }
    if (row.放款单数) {
      row.放款单数 = formatInt(row.放款单数)
    }
    if (row['7天期限放款单数']) {
      row['7天期限放款单数'] = formatInt(row['7天期限放款单数'])
    }
    if (row['14天期限放款单数']) {
      row['14天期限放款单数'] = formatInt(row['14天期限放款单数'])
    }
    if (row['21天期限放款单数']) {
      row['21天期限放款单数'] = formatInt(row['21天期限放款单数'])
    }
    if (row['21天分期放款单数']) {
      row['21天分期放款单数'] = formatInt(row['21天分期放款单数'])
    }
    if (row.老用户放款单数) {
      row.老用户放款单数 = formatInt(row.老用户放款单数)
    }
    if (row.新用户放款单数) {
      row.新用户放款单数 = formatInt(row.新用户放款单数)
    }
    if (row['21天分期提额放款单数']) {
      row['21天分期提额放款单数'] = formatInt(row['21天分期提额放款单数'])
    }
    if (row['90天分期放款单数']) {
      row['90天分期放款单数'] = formatInt(row['90天分期放款单数'])
    }

    if (row.扣款失败率) {
      row.扣款失败率 = (row.扣款失败率 * 100).toFixed(2) + '%'
    }
    if (row.新用户借款占比) {
      row.新用户借款占比 = (row.新用户借款占比 * 100).toFixed(2) + '%'
    }
    if (row.老用户借款占比) {
      row.老用户借款占比 = (row.老用户借款占比 * 100).toFixed(2) + '%'
    }
    if (row.累计新用户借款占比) {
      row.累计新用户借款占比 = (row.累计新用户借款占比 * 100).toFixed(2) + '%'
    }
    if (row.累计老用户借款占比) {
      row.累计老用户借款占比 = (row.累计老用户借款占比 * 100).toFixed(2) + '%'
    }
    if (row.满额率) {
      row.满额率 = (row.满额率 * 100).toFixed(2) + '%'
    }
    if (row.新用户满额率) {
      row.新用户满额率 = (row.新用户满额率 * 100).toFixed(2) + '%'
    }
    if (row.老用户满额率) {
      row.老用户满额率 = (row.老用户满额率 * 100).toFixed(2) + '%'
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
    func.connPool1(query, [tableName.dailyLendingDataXJJB, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.dailyLendingDataXJJB], function (err, rs) {
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
    if (global.dailyLendingCount === 0) {
      global.dailyLendingCount++
      pro.exec(shell.dailyLendingDataXJJB, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日放款数据-借呗shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.dailyLendingCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日放款数据-借呗shell脚本执行成功')
          res.json({code: '200'})
          global.dailyLendingCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 每日放款数据-借呗开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.dailyLendingDataExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.dailyLendingDataXJJB], function (err, rs) {
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
      rs = formatExcelData(rs)
      let fileName = mosaicName()
      let currFilePath = path.join(process.cwd(), fileName)
      let options = {
        headers: {
          'Content-Disposition': 'attachment; filename=' + fileName
        }
      }
      let writer = new XLSXWriter(fileName, {})
      let wirteStream = fs.createWriteStream(fileName)

// After instantiation, you can grab the readstream at any time.
      writer.getReadStream().pipe(wirteStream)
      for (let i of rs) {
        writer.addRow(i)
      }
      writer.finalize()
      wirteStream.on('finish', function () {
        // finish
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
    }, 180000)
  }
}
