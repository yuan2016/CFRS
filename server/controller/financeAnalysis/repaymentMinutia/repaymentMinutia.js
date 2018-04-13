let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, formatCurrency, mosaicName} = require('../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

// const tHeader = ['日期', '用户ID', '借款人姓名', '手机号', '债权ID', '还款ID', '借款金额', '总应还款金额', '已还金额', '服务费', '加急费', '本金', '利息', '分期费', '续期服务费', '续期手续费', '逾期滞纳金', '实还金额', '退款金额', '借款状态', '还款方式', '还款通道', '还款详情', '还款状态', '放款时间', '预期还款时间', '实际还款时间', '还款期限', '续期期限', '滞纳天数', '基础服务费率', '加急费率', '借款利率', '分期费率', '续期利率', '逾期费率']
// const filterVal = ['d_date', 'user_id', 'user_name', 'user_phone', 'order_id', 'loan_id', 'loan_money', 'repayment_amount', 'repaymented_amount', 'repayment_Service', 'loan_urgent_fee', 'Principal_amount', 'loan_accrual', 'stages_fee', 'renewal_service_fee', 'renewal_fee', 'Overdue_fine', 'repayment_real_money', 'return_money', 'loan_status', 'repayment_type', 'repayment_channel', 'repayment_detail', 'repayment_status', 'credit_repayment_time', 'repayment_time', 'repayment_real_time', 'repayment_term', 'renewal_term', 'late_day', 'service_rate', 'Urgent_rate', 'Loan_interest_rate', 'Installment_rate', 'Renewal_rate', 'Overdue_rate']

// function formatJson (filterVal, jsonData) {
//   return jsonData.map(v => filterVal.map(j => v[j]))
// }

function formatData (rows) {
  return rows.map(row => {
    if (row.credit_repayment_time) {
      row.credit_repayment_time = moment(row.credit_repayment_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.repayment_time) {
      row.repayment_time = moment(row.repayment_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_real_time) {
      row.repayment_real_time = moment(row.repayment_real_time).format('YYYY-MM-DD HH:mm:ss')
    }

    if (row.loan_money) {
      row.loan_money = formatCurrency(row.loan_money)
    }
    if (row.repayment_amount) {
      row.repayment_amount = formatCurrency(row.repayment_amount)
    }
    if (row.repaymented_amount) {
      row.repaymented_amount = formatCurrency(row.repaymented_amount)
    }
    if (row.repayment_real_money) {
      row.repayment_real_money = formatCurrency(row.repayment_real_money)
    }
    if (row.return_money) {
      row.return_money = formatCurrency(row.return_money)
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.放款时间) {
      row.放款时间 = moment(row.放款时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.应还款时间) {
      row.应还款时间 = moment(row.应还款时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.实际还款时间) {
      row.实际还款时间 = moment(row.实际还款时间).format('YYYY-MM-DD HH:mm:ss')
    }

    if (row.借款金额) {
      row.借款金额 = formatCurrency(row.借款金额)
    }
    if (row.总应还款金额) {
      row.总应还款金额 = formatCurrency(row.总应还款金额)
    }
    if (row.已还金额) {
      row.已还金额 = formatCurrency(row.已还金额)
    }
    if (row.实还金额) {
      row.实还金额 = formatCurrency(row.实还金额)
    }
    if (row.退款金额) {
      row.退款金额 = formatCurrency(row.退款金额)
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'repayment_real_time', 'w')
    let order = params.order || sql.financeAnalysis.repaymentMinutia.orderBy
    let query = sql.financeAnalysis.repaymentMinutia.selectAllFront + queries + order + sql.financeAnalysis.repaymentMinutia.selectAllLimit
    func.connPool1(query, [tableName.repaymentMinutia, params.offset, params.limit], function (err, rs) {
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
      // console.log(formatData(rs))
      res.json(formatData(rs))
    })
  },
  //每日还款金额数据总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'repayment_real_time', 'w')
    let query = sql.financeAnalysis.repaymentMinutia.getCount + queries
    func.connPool1(query, tableName.repaymentMinutia, function (err, rs) {
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
    let queries = analysis(params, 'repayment_real_time', 'w')
    let query = sql.financeAnalysis.repaymentMinutia.selectAllExcel + queries + sql.financeAnalysis.repaymentMinutia.orderBy
    // let start = new Date().getTime()
    // console.log(start)
    func.connPool1(query, [tableName.repaymentMinutia], function (err, rs) {
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
      // let end = new Date().getTime()
      // console.log(end)
      // console.log((end-start)/1000)
      // console.log(rs.length)
      rs = formatExcelData(rs)
      // const data = formatJson(filterVal, rs)

      // let fileName = mosaicName()
      // try {
      //   exportJsonToExcel(tHeader, data, fileName)
      // } catch (e) {
      //   console.log(e)
      //   res.sendFile(path.join(process.cwd(), 'error.html'))
      //   return
      // }
      // let currFilePath = path.join(process.cwd(), fileName)
      // let options = {
      //   headers: {
      //     'Content-Disposition': 'attachment; filename=' + fileName
      //   }
      // }
      // res.sendFile(currFilePath, options, function () {
      //   if (err) {
      //     console.log(err)
      //     res.sendFile(path.join(process.cwd(), 'error.html'))
      //     return
      //   } else {
      //     console.log('Sent:', fileName)
      //     fs.unlink(currFilePath, function (err) {
      //       if (err) console.log(err)
      //       console.log('文件删除成功')
      //     })
      //   }
      // })
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
