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
    if (row.passuser_rate) {
      row.passuser_rate = (row.passuser_rate * 100).toFixed(2) + '%'
    }
    if (row.Order_through_rate) {
      row.Order_through_rate = (row.Order_through_rate * 100).toFixed(2) + '%'
    }

    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.realname_auth_num) {
      row.realname_auth_num = formatInt(row.realname_auth_num)
    }
    if (row.realname_auth_freq) {
      row.realname_auth_freq = formatInt(row.realname_auth_freq)
    }
    if (row.realname_fee) {
      row.realname_fee = formatCurrency(row.realname_fee)
    }
    if (row.operator_auth_num) {
      row.operator_auth_num = formatInt(row.operator_auth_num)
    }
    if (row.generate_report_num) {
      row.generate_report_num = formatInt(row.generate_report_num)
    }
    if (row.operator_fee) {
      row.operator_fee = formatCurrency(row.operator_fee)
    }
    if (row.card_bound_num) {
      row.card_bound_num = formatInt(row.card_bound_num)
    }
    if (row.Sesame_auth_num) {
      row.Sesame_auth_num = formatInt(row.Sesame_auth_num)
    }
    if (row.Sesame_auth_fee) {
      row.Sesame_auth_fee = formatCurrency(row.Sesame_auth_fee)
    }
    if (row.auth_work_num) {
      row.auth_work_num = formatInt(row.auth_work_num)
    }
    if (row.Alipay_auth_num) {
      row.Alipay_auth_num = formatInt(row.Alipay_auth_num)
    }
    if (row.total_apply_loan_num) {
      row.total_apply_loan_num = formatInt(row.total_apply_loan_num)
    }
    if (row.total_audit_num) {
      row.total_audit_num = formatInt(row.total_audit_num)
    }
    if (row.total_payloans_amount) {
      row.total_payloans_amount = formatCurrency(row.total_payloans_amount)
    }
    if (row.total_succloan_amount) {
      row.total_succloan_amount = formatCurrency(row.total_succloan_amount)
    }
    if (row.succ_loan_num) {
      row.succ_loan_num = formatInt(row.succ_loan_num)
    }
    if (row.outstand_num) {
      row.outstand_num = formatInt(row.outstand_num)
    }
    if (row.total_failsingular_num) {
      row.total_failsingular_num = formatInt(row.total_failsingular_num)
    }
    if (row.total_passuser_num) {
      row.total_passuser_num = formatInt(row.total_passuser_num)
    }
    if (row.counter_fraud_num) {
      row.counter_fraud_num = formatInt(row.counter_fraud_num)
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
    row.日期 = moment(row.日期).format('YYYY-MM-DD')
  }
  if (row.用户通过率) {
    row.用户通过率 = (row.用户通过率 * 100).toFixed(2) + '%'
  }
  if (row.订单通过率) {
    row.订单通过率 = (row.订单通过率 * 100).toFixed(2) + '%'
  }

  if (row.注册人数) {
    row.注册人数 = formatInt(row.注册人数)
  }
  if (row.实名认证人数) {
    row.实名认证人数 = formatInt(row.实名认证人数)
  }
  if (row.实名认证次数) {
    row.实名认证次数 = formatInt(row.实名认证次数)
  }
  if (row['实名费用(元)']) {
    row['实名费用(元)'] = formatCurrency(row['实名费用(元)'])
  }
  if (row.运营商认证数) {
    row.运营商认证数 = formatInt(row.运营商认证数)
  }
  if (row.生成报告人数) {
    row.生成报告人数 = formatInt(row.生成报告人数)
  }
  if (row['运营商费用(元)']) {
    row['运营商费用(元)'] = formatCurrency(row['运营商费用(元)'])
  }
  if (row.绑卡人数) {
    row.绑卡人数 = formatInt(row.绑卡人数)
  }
  if (row.芝麻认证人数) {
    row.芝麻认证人数 = formatInt(row.芝麻认证人数)
  }
  if (row['芝麻认证费用(元)']) {
    row['芝麻认证费用(元)'] = formatCurrency(row['芝麻认证费用(元)'])
  }
  if (row.认证工作人数) {
    row.认证工作人数 = formatInt(row.认证工作人数)
  }
  if (row.支付宝认证人数) {
    row.支付宝认证人数 = formatInt(row.支付宝认证人数)
  }
  if (row.借款申请总数) {
    row.借款申请总数 = formatInt(row.借款申请总数)
  }
  if (row.通过审核总数) {
    row.通过审核总数 = formatInt(row.通过审核总数)
  }
  if (row['应放款总额(元)']) {
    row['应放款总额(元)'] = formatCurrency(row['应放款总额(元)'])
  }
  if (row['放款成功总额(元)']) {
    row['放款成功总额(元)'] = formatCurrency(row['放款成功总额(元)'])
  }
  if (row.放款成功笔数) {
    row.放款成功笔数 = formatInt(row.放款成功笔数)
  }
  if (row.未到账笔数) {
    row.未到账笔数 = formatInt(row.未到账笔数)
  }
  if (row.打款失败总订单数) {
    row.打款失败总订单数 = formatInt(row.打款失败总订单数)
  }
  if (row.通过用户总数) {
    row.通过用户总数 = formatInt(row.通过用户总数)
  }
  if (row.反欺诈人数) {
    row.反欺诈人数 = formatInt(row.反欺诈人数)
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
    func.connPool1(query, [tableName.platformData, params.offset, params.limit], function (err, rs) {
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
    func.connPool1(query, [tableName.platformData], function (err, rs) {
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
    if (global.platformCount === 0) {
      global.platformCount++
      pro.exec(shell.platformData, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 平台数据shell脚本执行失败')
          res.json({code: '500'})
          global.platformCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 平台数据shell脚本执行成功')
          res.json({code: '200'})
          global.platformCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 平台数据开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.platformDataExcel + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.platformData], function (err, rs) {
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
