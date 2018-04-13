let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, formatCurrency, formatInt, mosaicName} = require('../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

function formatData (rows) {
  return rows.map(row => {
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
    if (row.blacklist_num) {
      row.blacklist_num = formatInt(row.blacklist_num)
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
    if (row.overdue_num) {
      row.overdue_num = formatInt(row.overdue_num)
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.通过率) {
    row.通过率 = (row.通过率 * 100).toFixed(2) + '%'
  }

  if (row.注册量) {
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
  if (row.黑名单人数) {
    row.黑名单人数 = formatInt(row.黑名单人数)
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
  if (row.逾期人数) {
    row.逾期人数 = formatInt(row.逾期人数)
  }
  return row
})
}

function packageRows (rows) {
  let options = [{value: '', label: '不限'}]
  for (let row of rows) {
    let option = {}
    if (row.channel_trader && row.channel_trader !== '') {
      option.value = row.channel_trader
      option.label = row.channel_trader
      options.push(option)
    }
  }
  return options
}

module.exports = {
  //渠道统计汇总
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'a')
    let order = params.order || ''
    let query = sql.promotionManagement.channelStatisticsSummary.selectAllFront + queries + order + sql.promotionManagement.channelStatisticsSummary.selectAllBack

    func.connPool1(query, [tableName.channelStatisticsSummary, params.offset, params.limit], function (err, rs) {
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
  //渠道统计汇总总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'a')
    let query = sql.promotionManagement.channelStatisticsSummary.getCount + queries
    func.connPool1(query, tableName.channelStatisticsSummary, function (err, rs) {
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
  getSelectOptions (req, res) {
    func.connPool1(sql.promotionManagement.channelStatisticsSummary.getSelectOptions, tableName.channelStatisticsSummary, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageRows(rs)
      res.json(rs)
    })
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, null, 'a')
    let query = sql.promotionManagement.channelStatisticsSummary.selectAllExcel + queries
    func.connPool1(query, tableName.channelStatisticsSummary, function (err, rs) {
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
