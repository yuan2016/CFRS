let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

global.promptAmountCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.CREATE_TIME) {
      row.CREATE_TIME = moment(row.CREATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD')
    }

    if (row.COLLECTION_PRINCIPAL_DAY) {
      row.COLLECTION_PRINCIPAL_DAY = formatCurrency(row.COLLECTION_PRINCIPAL_DAY)
    }
    if (row.COLLECTION_PRINCIPAL_DOING) {
      row.COLLECTION_PRINCIPAL_DOING = formatCurrency(row.COLLECTION_PRINCIPAL_DOING)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_S1) {
      row.COLLECTION_PRINCIPAL_DOING_S1 = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_S1)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_S2) {
      row.COLLECTION_PRINCIPAL_DOING_S2 = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_S2)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M2) {
      row.COLLECTION_PRINCIPAL_DOING_M2 = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M2)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M3) {
      row.COLLECTION_PRINCIPAL_DOING_M3 = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M3)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M3PLUS) {
      row.COLLECTION_PRINCIPAL_DOING_M3PLUS = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M3PLUS)
    }
    if (row.COLLECTION_LATE_FEE_DOING) {
      row.COLLECTION_LATE_FEE_DOING = formatCurrency(row.COLLECTION_LATE_FEE_DOING)
    }
    if (row.COLLECTION_LATE_FEE_DOING_S1) {
      row.COLLECTION_LATE_FEE_DOING_S1 = formatCurrency(row.COLLECTION_LATE_FEE_DOING_S1)
    }
    if (row.COLLECTION_LATE_FEE_DOING_S2) {
      row.COLLECTION_LATE_FEE_DOING_S2 = formatCurrency(row.COLLECTION_LATE_FEE_DOING_S2)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M2) {
      row.COLLECTION_LATE_FEE_DOING_M2 = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M2)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M3) {
      row.COLLECTION_LATE_FEE_DOING_M3 = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M3)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M3PLUS) {
      row.COLLECTION_LATE_FEE_DOING_M3PLUS = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M3PLUS)
    }

    if (row.COLLECTION_PRINCIPAL_DOING_RATE_S1) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_S1 = (row.COLLECTION_PRINCIPAL_DOING_RATE_S1 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_S2) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_S2 = (row.COLLECTION_PRINCIPAL_DOING_RATE_S2 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M2) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M2 = (row.COLLECTION_PRINCIPAL_DOING_RATE_M2 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M3) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M3 = (row.COLLECTION_PRINCIPAL_DOING_RATE_M3 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS = (row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE) {
      row.OVERDUE_RATE = (row.OVERDUE_RATE * 100).toFixed(2) + '%'
    }

    if (row.OVERDUE_RATE_S1_P) {
      row.OVERDUE_RATE_S1_P = (row.OVERDUE_RATE_S1_P * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_S1_F) {
      row.OVERDUE_RATE_S1_F = (row.OVERDUE_RATE_S1_F * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_S2_P) {
      row.OVERDUE_RATE_S2_P = (row.OVERDUE_RATE_S2_P * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_S2_F) {
      row.OVERDUE_RATE_S2_F = (row.OVERDUE_RATE_S2_F * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_M2_P) {
      row.OVERDUE_RATE_M2_P = (row.OVERDUE_RATE_M2_P * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_M2_F) {
      row.OVERDUE_RATE_M2_F = (row.OVERDUE_RATE_M2_F * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_M3_P) {
      row.OVERDUE_RATE_M3_P = (row.OVERDUE_RATE_M3_P * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_M3_F) {
      row.OVERDUE_RATE_M3_F = (row.OVERDUE_RATE_M3_F * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_M3PLUS_P) {
      row.OVERDUE_RATE_M3PLUS_P = (row.OVERDUE_RATE_M3PLUS_P * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_M3PLUS_F) {
      row.OVERDUE_RATE_M3PLUS_F = (row.OVERDUE_RATE_M3PLUS_F * 100).toFixed(2) + '%'
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.更新时间) {
    row.更新时间 = moment(row.更新时间).format('YYYY-MM-DD HH:mm:ss')
  }
  if (row.创建时间) {
    row.创建时间 = moment(row.创建时间).format('YYYY-MM-DD HH:mm:ss')
  }
  if (row.日期) {
    row.日期 = moment(row.日期).format('YYYY-MM-DD')
  }

  if (row['当日入催本金(元)']) {
    row['当日入催本金(元)'] = formatCurrency(row['当日入催本金(元)'])
  }
  if (row['在催本金(元)']) {
    row['在催本金(元)'] = formatCurrency(row['在催本金(元)'])
  }
  if (row['S1在催本金(元)']) {
    row['S1在催本金(元)'] = formatCurrency(row['S1在催本金(元)'])
  }
  if (row['S2在催本金(元)']) {
    row['S2在催本金(元)'] = formatCurrency(row['S2在催本金(元)'])
  }
  if (row['M2在催本金(元)']) {
    row['M2在催本金(元)'] = formatCurrency(row['M2在催本金(元)'])
  }
  if (row['M3在催本金(元)']) {
    row['M3在催本金(元)'] = formatCurrency(row['M3在催本金(元)'])
  }
  if (row['M3+在催本金(元)']) {
    row['M3+在催本金(元)'] = formatCurrency(row['M3+在催本金(元)'])
  }
  if (row.在催滞纳金) {
    row.在催滞纳金 = formatCurrency(row.在催滞纳金)
  }
  if (row.S1在催滞纳金) {
    row.S1在催滞纳金 = formatCurrency(row.S1在催滞纳金)
  }
  if (row.S2在催滞纳金) {
    row.S2在催滞纳金 = formatCurrency(row.S2在催滞纳金)
  }
  if (row.M2在催滞纳金) {
    row.M2在催滞纳金 = formatCurrency(row.M2在催滞纳金)
  }
  if (row.M3在催滞纳金) {
    row.M3在催滞纳金 = formatCurrency(row.M3在催滞纳金)
  }
  if (row['M3+在催滞纳金']) {
    row['M3+在催滞纳金'] = formatCurrency(row['M3+在催滞纳金'])
  }
  if (row.S1在催本金比例) {
    row.S1在催本金比例 = (row.S1在催本金比例 * 100).toFixed(2) + '%'
  }
  if (row.S2在催本金比例) {
    row.S2在催本金比例 = (row.S2在催本金比例 * 100).toFixed(2) + '%'
  }
  if (row.M2在催本金比例) {
    row.M2在催本金比例 = (row.M2在催本金比例 * 100).toFixed(2) + '%'
  }
  if (row.M3在催本金比例) {
    row.M3在催本金比例 = (row.M3在催本金比例 * 100).toFixed(2) + '%'
  }
  if (row['M3+在催本金比例']) {
    row['M3+在催本金比例'] = (row['M3+在催本金比例'] * 100).toFixed(2) + '%'
  }

  if (row.当日催回率) {
    row.当日催回率 = (row.当日催回率 * 100).toFixed(2) + '%'
  }

  if (row.S1当期催回率) {
    row.S1当期催回率 = (row.S1当期催回率 * 100).toFixed(2) + '%'
  }
  if (row.S1总和催回率) {
    row.S1总和催回率 = (row.S1总和催回率 * 100).toFixed(2) + '%'
  }
  if (row.S2当期催回率) {
    row.S2当期催回率 = (row.S2当期催回率 * 100).toFixed(2) + '%'
  }
  if (row.S2总和催回率) {
    row.S2总和催回率 = (row.S2总和催回率 * 100).toFixed(2) + '%'
  }
  if (row.M2当期催回率) {
    row.M2当期催回率 = (row.M2当期催回率 * 100).toFixed(2) + '%'
  }
  if (row.M2总和催回率) {
    row.M2总和催回率 = (row.M2总和催回率 * 100).toFixed(2) + '%'
  }
  if (row.M3当期催回率) {
    row.M3当期催回率 = (row.M3当期催回率 * 100).toFixed(2) + '%'
  }
  if (row.M3总和催回率) {
    row.M3总和催回率 = (row.M3总和催回率 * 100).toFixed(2) + '%'
  }
  if (row['M3+当期催回率']) {
    row['M3+当期催回率'] = (row['M3+当期催回率'] * 100).toFixed(2) + '%'
  }
  if (row['M3+总和催回率']) {
    row['M3+总和催回率'] = (row['M3+总和催回率'] * 100).toFixed(2) + '%'
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
    func.connPool1(query, [tableName.promptAmount, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.promptAmount], function (err, rs) {
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
    if (global.promptAmountCount === 0) {
      global.promptAmountCount++
      pro.exec(shell.promptAmount, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '在催金额shell脚本执行失败')
          res.json({code: '500'})
          global.promptAmountCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '在催金额shell脚本执行成功')
          res.json({code: '200'})
          global.promptAmountCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '在催金额开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.promptAmountExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.promptAmount], function (err, rs) {
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
