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
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }

    if (row.new_proportion) {
      row.new_proportion = (row.new_proportion * 100).toFixed(2) + '%'
    }
    if (row.old_proportion) {
      row.old_proportion = (row.old_proportion * 100).toFixed(2) + '%'
    }

    if (row.ious_activation_num) {
      row.ious_activation_num = formatInt(row.ious_activation_num)
    }
    if (row.buyers_num) {
      row.buyers_num = formatInt(row.buyers_num)
    }
    if (row.buy_suss_num) {
      row.buy_suss_num = formatInt(row.buy_suss_num)
    }
    if (row.loan_num) {
      row.loan_num = formatInt(row.loan_num)
    }
    if (row.new_loan_num) {
      row.new_loan_num = formatInt(row.new_loan_num)
    }
    if (row.old_loan_num) {
      row.old_loan_num = formatInt(row.old_loan_num)
    }
    if (row.stages90_loan_num) {
      row.stages90_loan_num = formatInt(row.stages90_loan_num)
    }
    if (row.all_activation_ed) {
      row.all_activation_ed = formatCurrency(row.all_activation_ed)
    }
    if (row.avg_activation_ed) {
      row.avg_activation_ed = formatCurrency(row.avg_activation_ed)
    }
    if (row.loan_money) {
      row.loan_money = formatCurrency(row.loan_money)
    }
    if (row.new_loan_money) {
      row.new_loan_money = formatCurrency(row.new_loan_money)
    }
    if (row.old_loan_money) {
      row.old_loan_money = formatCurrency(row.old_loan_money)
    }
    if (row.stages90_loan_money) {
      row.stages90_loan_money = formatCurrency(row.stages90_loan_money)
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

    if (row.新用户占比) {
      row.新用户占比 = (row.新用户占比 * 100).toFixed(2) + '%'
    }
    if (row.老用户占比) {
      row.老用户占比 = (row.老用户占比 * 100).toFixed(2) + '%'
    }

    if (row.激活白条用户数) {
      row.激活白条用户数 = formatInt(row.激活白条用户数)
    }
    if (row.购买人数) {
      row.购买人数 = formatInt(row.购买人数)
    }
    if (row.购买成功人数) {
      row.购买成功人数 = formatInt(row.购买成功人数)
    }
    if (row.购买单数) {
      row.购买单数 = formatInt(row.购买单数)
    }
    if (row.新用户购买单数) {
      row.新用户购买单数 = formatInt(row.新用户购买单数)
    }
    if (row.老用户购买单数) {
      row.老用户购买单数 = formatInt(row.老用户购买单数)
    }
    if (row['90天分期购买单数']) {
      row['90天分期购买单数'] = formatInt(row['90天分期购买单数'])
    }
    if (row.总激活白条额度) {
      row.总激活白条额度 = formatCurrency(row.总激活白条额度)
    }
    if (row.平均激活白条额度) {
      row.平均激活白条额度 = formatCurrency(row.平均激活白条额度)
    }
    if (row.购买总额) {
      row.购买总额 = formatCurrency(row.购买总额)
    }
    if (row.新用户购买总额) {
      row.新用户购买总额 = formatCurrency(row.新用户购买总额)
    }
    if (row.老用户购买总额) {
      row.老用户购买总额 = formatCurrency(row.老用户购买总额)
    }
    if (row['90天分期购买总额']) {
      row['90天分期购买总额'] = formatCurrency(row['90天分期购买总额'])
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

    func.connPool1(query, [tableName.dailyExpenditureData, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.dailyExpenditureData], function (err, rs) {
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
    let query = sql.dataAnalysis.dailyExpenditureDataExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.dailyExpenditureData], function (err, rs) {
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
