let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let pro = require('child_process')
let shell = require('../../../../config/shell')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
global.platformCount = 0

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

    if (row.NUSER_LOAN_RATIO) {
      row.NUSER_LOAN_RATIO = (row.NUSER_LOAN_RATIO * 100).toFixed(2) + '%'
    }
    if (row.NUSER_ADOPTION_RATE) {
      row.NUSER_ADOPTION_RATE = (row.NUSER_ADOPTION_RATE * 100).toFixed(2) + '%'
    }
    if (row.OUSER_ADOPTION_RATE) {
      row.OUSER_ADOPTION_RATE = (row.OUSER_ADOPTION_RATE * 100).toFixed(2) + '%'
    }
    if (row.RATE_FULL) {
      row.RATE_FULL = (row.RATE_FULL * 100).toFixed(2) + '%'
    }
    if (row.PREPAYMENT_BEFORE_RATE) {
      row.PREPAYMENT_BEFORE_RATE = (row.PREPAYMENT_BEFORE_RATE * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE) {
      row.OVERDUE_RATE = (row.OVERDUE_RATE * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_3) {
      row.OVER_DUE_RATE_3 = (row.OVER_DUE_RATE_3 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_10) {
      row.OVER_DUE_RATE_10 = (row.OVER_DUE_RATE_10 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_90) {
      row.OVER_DUE_RATE_90 = (row.OVER_DUE_RATE_90 * 100).toFixed(2) + '%'
    }

    if (row.REGISTER_NUM) {
      row.REGISTER_NUM = formatInt(row.REGISTER_NUM)
    }
    if (row.ALL_FACT_AUTH_NUM) {
      row.ALL_FACT_AUTH_NUM = formatInt(row.ALL_FACT_AUTH_NUM)
    }
    if (row.BLACKLIST_NUM) {
      row.BLACKLIST_NUM = formatInt(row.BLACKLIST_NUM)
    }
    if (row.APPLY_LOAN_NUM) {
      row.APPLY_LOAN_NUM = formatInt(row.APPLY_LOAN_NUM)
    }
    if (row.NUSER_APPLY_SUCC_NUM) {
      row.NUSER_APPLY_SUCC_NUM = formatInt(row.NUSER_APPLY_SUCC_NUM)
    }
    if (row.OUSER_APPLY_SUCC_NUM) {
      row.OUSER_APPLY_SUCC_NUM = formatInt(row.OUSER_APPLY_SUCC_NUM)
    }

    if (row.NUSER_LOAN_AMOUNT) {
      row.NUSER_LOAN_AMOUNT = formatCurrency(row.NUSER_LOAN_AMOUNT)
    }
    if (row.OUSER_LOAN_AMOUNT) {
      row.OUSER_LOAN_AMOUNT = formatCurrency(row.OUSER_LOAN_AMOUNT)
    }
    if (row.LOANED_AMOUNT_AVG) {
      row.LOANED_AMOUNT_AVG = formatCurrency(row.LOANED_AMOUNT_AVG)
    }
    if (row.OLD_LOANED_CNT_AVG) {
      row.OLD_LOANED_CNT_AVG = formatCurrency(row.OLD_LOANED_CNT_AVG)
    }
    if (row.DUE_AMOUNT) {
      row.DUE_AMOUNT = formatCurrency(row.DUE_AMOUNT)
    }
    if (row.OVERDUE_AMOUNT) {
      row.OVERDUE_AMOUNT = formatCurrency(row.OVERDUE_AMOUNT)
    }
    if (row.COLLECTION_PRINCIPAL_DOING) {
      row.COLLECTION_PRINCIPAL_DOING = formatCurrency(row.COLLECTION_PRINCIPAL_DOING)
    }
    if (row.OVER_DUE_REPAYMENTED_AMOUNT) {
      row.OVER_DUE_REPAYMENTED_AMOUNT = formatCurrency(row.OVER_DUE_REPAYMENTED_AMOUNT)
    }
    if (row.LATE_FEE_INCOME) {
      row.LATE_FEE_INCOME = formatCurrency(row.LATE_FEE_INCOME)
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }
    if (row.创建时间) {
      row.创建时间 = moment(row.创建时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.更新时间) {
      row.更新时间 = moment(row.更新时间).format('YYYY-MM-DD HH:mm:ss')
    }

    if (row.新用户借款率) {
      row.新用户借款率 = (row.新用户借款率 * 100).toFixed(2) + '%'
    }
    if (row.新用户通过率) {
      row.新用户通过率 = (row.新用户通过率 * 100).toFixed(2) + '%'
    }
    if (row.老用户通过率) {
      row.老用户通过率 = (row.老用户通过率 * 100).toFixed(2) + '%'
    }
    if (row.满额率) {
      row.满额率 = (row.满额率 * 100).toFixed(2) + '%'
    }
    if (row.提前还款率) {
      row.提前还款率 = (row.提前还款率 * 100).toFixed(2) + '%'
    }
    if (row.逾期率) {
      row.逾期率 = (row.逾期率 * 100).toFixed(2) + '%'
    }
    if (row['3日剩余逾期率']) {
      row['3日剩余逾期率'] = (row['3日剩余逾期率'] * 100).toFixed(2) + '%'
    }
    if (row['10日剩余逾期率']) {
      row['10日剩余逾期率'] = (row['10日剩余逾期率'] * 100).toFixed(2) + '%'
    }
    if (row.坏账率) {
      row.坏账率 = (row.坏账率 * 100).toFixed(2) + '%'
    }

    if (row.注册量) {
      row.注册量 = formatInt(row.注册量)
    }
    if (row.全要素认证人数) {
      row.全要素认证人数 = formatInt(row.全要素认证人数)
    }
    if (row.黑名单人数) {
      row.黑名单人数 = formatInt(row.黑名单人数)
    }
    if (row.申请借款人数) {
      row.申请借款人数 = formatInt(row.申请借款人数)
    }
    if (row.新用户申请成功人数) {
      row.新用户申请成功人数 = formatInt(row.新用户申请成功人数)
    }
    if (row.老用户申请成功人数) {
      row.老用户申请成功人数 = formatInt(row.老用户申请成功人数)
    }

    if (row.新用户放款金额) {
      row.新用户放款金额 = formatCurrency(row.新用户放款金额)
    }
    if (row.老用户放款金额) {
      row.老用户放款金额 = formatCurrency(row.老用户放款金额)
    }
    if (row.平均借款金额) {
      row.平均借款金额 = formatCurrency(row.平均借款金额)
    }
    if (row.老用户平均借款次数) {
      row.老用户平均借款次数 = formatCurrency(row.老用户平均借款次数)
    }
    if (row.到期金额) {
      row.到期金额 = formatCurrency(row.到期金额)
    }
    if (row.逾期金额) {
      row.逾期金额 = formatCurrency(row.逾期金额)
    }
    if (row.在催金额) {
      row.在催金额 = formatCurrency(row.在催金额)
    }
    if (row.逾期回款) {
      row.逾期回款 = formatCurrency(row.逾期回款)
    }
    if (row.滞纳金收入) {
      row.滞纳金收入 = formatCurrency(row.滞纳金收入)
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

    func.connPool1(query, [tableName.naturalChannelStatistics, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.naturalChannelStatistics], function (err, rs) {
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
    let query = sql.dataAnalysis.naturalChannelStatisticsExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.naturalChannelStatistics], function (err, rs) {
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
