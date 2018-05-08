let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {analysis, formatCurrency, formatInt, mosaicName} = require('../../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
global.regionCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.Pass_rate) {
      row.Pass_rate = (row.Pass_rate * 100).toFixed(2) + '%'
    }

    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.realname_auth_num) {
      row.realname_auth_num = formatInt(row.realname_auth_num)
    }
    if (row.card_bound_num) {
      row.card_bound_num = formatInt(row.card_bound_num)
    }
    if (row.emergency_contact_num) {
      row.emergency_contact_num = formatInt(row.emergency_contact_num)
    }
    if (row.operator_auth_num) {
      row.operator_auth_num = formatInt(row.operator_auth_num)
    }
    if (row.Alipay_auth_num) {
      row.Alipay_auth_num = formatInt(row.Alipay_auth_num)
    }
    if (row.Sesame_auth_num) {
      row.Sesame_auth_num = formatInt(row.Sesame_auth_num)
    }
    if (row.jobinfo_auth_num) {
      row.jobinfo_auth_num = formatInt(row.jobinfo_auth_num)
    }
    if (row.apply_loan_num) {
      row.apply_loan_num = formatInt(row.apply_loan_num)
    }
    if (row.apply_succ_num) {
      row.apply_succ_num = formatInt(row.apply_succ_num)
    }
    if (row.loan_amount) {
      row.loan_amount = formatCurrency(row.loan_amount)
    }
    if (row.blacklist_num) {
      row.blacklist_num = formatInt(row.blacklist_num)
    }
    if (row.overdue_num) {
      row.overdue_num = formatInt(row.overdue_num)
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
    row.日期 = moment(row.日期).format('YYYY-MM-DD')
  }
  if (row.通过率) {
    row.通过率 = (row.通过率 * 100).toFixed(2) + '%'
  }

  /*if (row.注册量) {
    row.注册量 = formatInt(row.注册量)
  }
  if (row.实名认证) {
    row.实名认证 = formatInt(row.实名认证)
  }
  if (row.绑卡人数) {
    row.绑卡人数 = formatInt(row.绑卡人数)
  }
  if (row.紧急联系人) {
    row.紧急联系人 = formatInt(row.紧急联系人)
  }
  if (row.运营商认证) {
    row.运营商认证 = formatInt(row.运营商认证)
  }
  if (row.支付宝认证人数) {
    row.支付宝认证人数 = formatInt(row.支付宝认证人数)
  }
  if (row.芝麻认证人数) {
    row.芝麻认证人数 = formatInt(row.芝麻认证人数)
  }
  if (row.工作信息) {
    row.工作信息 = formatInt(row.工作信息)
  }
  if (row.申请借款人数) {
    row.申请借款人数 = formatInt(row.申请借款人数)
  }
  if (row.申请成功人数) {
    row.申请成功人数 = formatInt(row.申请成功人数)
  }
  if (row['放款金额(元)']) {
    row['放款金额(元)'] = formatCurrency(row['放款金额(元)'])
  }
  if (row.黑名单人数) {
    row.黑名单人数 = formatInt(row.黑名单人数)
  }
  if (row.逾期人数) {
    row.逾期人数 = formatInt(row.逾期人数)
  }*/
  return row
})
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    if (params.province[0] === '全国') {
      params.province[0] = ''
    }
    if (params.city[0] === '全国' || params.city[0] === '全部') {
      params.city[0] = ''
    }
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.promotionStatisticsArea.order
    let query = sql.period.promotionStatisticsArea.selectAllFront + queries + order + sql.period.promotionStatisticsArea.selectAllBack
    func.connPool1(query, [tableName.period.promotionStatisticsArea, params.offset, params.limit], function (err, rs) {
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
    if (params.province[0] === '全国') {
      params.province[0] = ''
    }
    if (params.city[0] === '全国' || params.city[0] === '全部') {
      params.city[0] = ''
    }
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.promotionStatisticsArea.getCount + queries
    func.connPool1(query, [tableName.period.promotionStatisticsArea], function (err, rs) {
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
    if (params.province[0] === '全国') {
      params.province[0] = ''
    }
    if (params.city[0] === '全国' || params.city[0] === '全部') {
      params.city[0] = ''
    }
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.promotionStatisticsArea.selectAllExcel + queries
    console.log(query)
    func.connPool1(query, tableName.period.promotionStatisticsArea, function (err, rs) {
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
