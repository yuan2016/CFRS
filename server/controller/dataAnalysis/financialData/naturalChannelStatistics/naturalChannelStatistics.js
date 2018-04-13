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
let {exportJsonToExcel} = require('../../../../utils/excel')

global.platformCount = 0

const tHeader = [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '14天逾期率', '21天逾期率', '14天3天剩余逾期率', '14天10天剩余逾期率', '21天3天剩余逾期率', '21天10天剩余逾期率', '14天逾期率', '21天逾期率', '14天3天剩余逾期率', '14天10天剩余逾期率', '21天3天剩余逾期率', '21天10天剩余逾期率'], ['日期', '注册量', '全要素认证人数', '黑名单人数', '申请借款人数', '新用户申请成功人数', '老用户申请成功人数', '新用户借款率', '新用户通过率', '新用户放款金额', '老用户通过率', '老用户放款金额', '满额率', '平均借款金额', '老用户平均借款次数', '到期金额', '提前还款率', '逾期金额', '逾期率', '3日剩余逾期率', '10日剩余逾期率', '坏账率', '在催金额', '逾期回款', '滞纳金收入', '新用户' , '老用户']]
const filterVal = ['D_DATE', 'REGISTER_NUM', 'ALL_FACT_AUTH_NUM', 'BLACKLIST_NUM', 'APPLY_LOAN_NUM', 'NUSER_APPLY_SUCC_NUM', 'OUSER_APPLY_SUCC_NUM', 'NUSER_LOAN_RATIO', 'NUSER_ADOPTION_RATE', 'NUSER_LOAN_AMOUNT', 'OUSER_ADOPTION_RATE', 'OUSER_LOAN_AMOUNT', 'RATE_FULL', 'LOANED_AMOUNT_AVG', 'OLD_LOANED_CNT_AVG', 'DUE_AMOUNT', 'PREPAYMENT_BEFORE_RATE', 'OVERDUE_AMOUNT', 'OVERDUE_RATE', 'OVER_DUE_RATE_3', 'OVER_DUE_RATE_10', 'OVER_DUE_RATE_90', 'COLLECTION_PRINCIPAL_DOING', 'OVER_DUE_REPAYMENTED_AMOUNT', 'LATE_FEE_INCOME', 'OVERDUE_RATE_NUSER_14', 'OVERDUE_RATE_NUSER_21', 'OVER_DUE_RATE_3_NUSER_14', 'OVER_DUE_RATE_10_NUSER_14', 'OVER_DUE_RATE_3_NUSER_21', 'OVER_DUE_RATE_10_NUSER_21', 'OVERDUE_RATE_OUSER_14', 'OVERDUE_RATE_OUSER_21', 'OVER_DUE_RATE_3_OUSER_14', 'OVER_DUE_RATE_10_OUSER_14', 'OVER_DUE_RATE_3_OUSER_21', 'OVER_DUE_RATE_10_OUSER_21']
const merge = [[0, 0, 0, 1], [1, 0, 1, 1], [2, 0, 2, 1], [3, 0, 3, 1], [4, 0, 4, 1], [5, 0, 5, 1], [6, 0, 6, 1], [7, 0, 7, 1], [8, 0, 8, 1], [9, 0, 9, 1], [10, 0, 10, 1], [11, 0, 11, 1], [12, 0, 12, 1], [13, 0, 13, 1], [14, 0, 14, 1], [15, 0, 15, 1], [16, 0, 16, 1], [17, 0, 17, 1], [18, 0, 18, 1], [19, 0, 19, 1], [20, 0, 20, 1], [21, 0, 21, 1], [22, 0, 22, 1], [23, 0, 23, 1], [24, 0, 24, 1], [25, 0, 30, 0], [31, 0, 36, 0]]
const change = [['A1', '日期'], ['B1', '注册量'], ['C1', '全要素认证人数'], ['D1', '黑名单人数'], ['E1', '申请借款人数'], ['F1', '新用户申请成功人数'], ['G1', '老用户申请成功人数'], ['H1', '新用户借款率'], ['I1', '新用户通过率'], ['J1', '新用户放款金额'], ['K1', '老用户通过率'], ['L1', '老用户放款金额'], ['M1', '满额率'], ['N1', '平均借款金额'], ['O1', '老用户平均借款次数'], ['P1', '到期金额'], ['Q1', '提前还款率'], ['R1', '逾期金额'], ['S1', '逾期率'], ['T1', '3日剩余逾期率'], ['U1', '10日剩余逾期率'],['V1', '坏账率'], ['W1', '在催金额'], ['X1', '逾期回款'], ['Y1', '滞纳金收入'], ['Z1', '                        新用户'], ['AF1', '                        老用户']]

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
    if (row.OVERDUE_RATE_NUSER_14) {
      row.OVERDUE_RATE_NUSER_14 = (row.OVERDUE_RATE_NUSER_14 * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_OUSER_14) {
      row.OVERDUE_RATE_OUSER_14 = (row.OVERDUE_RATE_OUSER_14 * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_NUSER_21) {
      row.OVERDUE_RATE_NUSER_21 = (row.OVERDUE_RATE_NUSER_21 * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_OUSER_21) {
      row.OVERDUE_RATE_OUSER_21 = (row.OVERDUE_RATE_OUSER_21 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_3_NUSER_14) {
      row.OVER_DUE_RATE_3_NUSER_14 = (row.OVER_DUE_RATE_3_NUSER_14 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_3_OUSER_14) {
      row.OVER_DUE_RATE_3_OUSER_14 = (row.OVER_DUE_RATE_3_OUSER_14 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_10_NUSER_14) {
      row.OVER_DUE_RATE_10_NUSER_14 = (row.OVER_DUE_RATE_10_NUSER_14 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_10_OUSER_14) {
      row.OVER_DUE_RATE_10_OUSER_14 = (row.OVER_DUE_RATE_10_OUSER_14 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_3_NUSER_21) {
      row.OVER_DUE_RATE_3_NUSER_21 = (row.OVER_DUE_RATE_3_NUSER_21 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_3_OUSER_21) {
      row.OVER_DUE_RATE_3_OUSER_21 = (row.OVER_DUE_RATE_3_OUSER_21 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_10_NUSER_21) {
      row.OVER_DUE_RATE_10_NUSER_21 = (row.OVER_DUE_RATE_10_NUSER_21 * 100).toFixed(2) + '%'
    }
    if (row.OVER_DUE_RATE_10_OUSER_21) {
      row.OVER_DUE_RATE_10_OUSER_21 = (row.OVER_DUE_RATE_10_OUSER_21 * 100).toFixed(2) + '%'
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
    if (row.新用户14天逾期率) {
      row.新用户14天逾期率 = (row.新用户14天逾期率 * 100).toFixed(2) + '%'
    }
    if (row.老用户14天逾期率) {
      row.老用户14天逾期率 = (row.老用户14天逾期率 * 100).toFixed(2) + '%'
    }
    if (row.新用户21天逾期率) {
      row.新用户21天逾期率 = (row.新用户21天逾期率 * 100).toFixed(2) + '%'
    }
    if (row.老用户21天逾期率) {
      row.老用户21天逾期率 = (row.老用户21天逾期率 * 100).toFixed(2) + '%'
    }
    if (row.新用户14天3天剩余逾期率) {
      row.新用户14天3天剩余逾期率 = (row.新用户14天3天剩余逾期率 * 100).toFixed(2) + '%'
    }
    if (row.老用户14天3天剩余逾期率) {
      row.老用户14天3天剩余逾期率 = (row.老用户14天3天剩余逾期率 * 100).toFixed(2) + '%'
    }
    if (row.新用户14天10天剩余逾期率) {
      row.新用户14天10天剩余逾期率 = (row.新用户14天10天剩余逾期率 * 100).toFixed(2) + '%'
    }
    if (row.老用户14天10天剩余逾期率) {
      row.老用户14天10天剩余逾期率 = (row.老用户14天10天剩余逾期率 * 100).toFixed(2) + '%'
    }
    if (row.新用户21天3天剩余逾期率) {
      row.新用户21天3天剩余逾期率 = (row.新用户21天3天剩余逾期率 * 100).toFixed(2) + '%'
    }
    if (row.老用户21天3天剩余逾期率) {
      row.老用户21天3天剩余逾期率 = (row.老用户21天3天剩余逾期率 * 100).toFixed(2) + '%'
    }
    if (row.新用户21天10天剩余逾期率) {
      row.新用户21天10天剩余逾期率 = (row.新用户21天10天剩余逾期率 * 100).toFixed(2) + '%'
    }
    if (row.老用户21天10天剩余逾期率) {
      row.老用户21天10天剩余逾期率 = (row.老用户21天10天剩余逾期率 * 100).toFixed(2) + '%'
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
    let query = sql.dataAnalysis.selectAll + queries + sql.dataAnalysis.order
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
