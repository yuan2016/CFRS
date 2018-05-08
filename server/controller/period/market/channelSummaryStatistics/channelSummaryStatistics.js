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

global.channelSummaryStatisticsCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD ')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.register_num) {
      row.register_num = formatInt(row.register_num)
    }
    if (row.login_num) {
      row.login_num = formatInt(row.login_num)
    }
    if (row.realname_auth_num) {
      row.realname_auth_num = formatInt(row.realname_auth_num)
    }
    if (row.emergency_contact_num) {
      row.emergency_contact_num = formatInt(row.emergency_contact_num)
    }
    if (row.operator_auth_num) {
      row.operator_auth_num = formatInt(row.operator_auth_num)
    }
    if (row.card_bound_num) {
      row.card_bound_num = formatInt(row.card_bound_num)
    }
    if (row.all_auth_num) {
      row.all_auth_num = formatInt(row.all_auth_num)
    }
    if (row.jobinfo_auth_num) {
      row.jobinfo_auth_num = formatInt(row.jobinfo_auth_num)
    }
    if (row.Sesame_auth_num) {
      row.Sesame_auth_num = formatInt(row.Sesame_auth_num)
    }
    if (row.Alipay_auth_num) {
      row.Alipay_auth_num = formatInt(row.Alipay_auth_num)
    }
    if (row.taobao_auth_num) {
      row.taobao_auth_num = formatInt(row.taobao_auth_num)
    }
    if (row.credit_auth_num) {
      row.credit_auth_num = formatInt(row.credit_auth_num)
    }
    if (row.gjj_auth_num) {
      row.gjj_auth_num = formatInt(row.gjj_auth_num)
    }
    if (row.Appl_quota_num) {
      row.Appl_quota_num = formatInt(row.Appl_quota_num)
    }
    if (row.blacklist_num) {
      row.blacklist_num = formatInt(row.blacklist_num)
    }
    if (row.succ_quota_num) {
      row.succ_quota_num = formatInt(row.succ_quota_num)
    }
    if (row.Pass_rate) {
      row.Pass_rate = (row.Pass_rate * 100).toFixed(2) + '%'
    }
    if (row.member_new_num) {
      row.member_new_num = formatInt(row.member_new_num)
    }
    if (row.member_old_num) {
      row.member_old_num = formatInt(row.member_old_num)
    }
    if (row.loan_new) {
      row.loan_new = formatCurrency(row.loan_new)
    }
    if (row.loan_old) {
      row.loan_old = formatCurrency(row.loan_old)
    }
    if (row.loan_amount_new) {
      row.loan_amount_new = formatCurrency(row.loan_amount_new)
    }
    if (row.loan_amount_old) {
      row.loan_amount_old = formatCurrency(row.loan_amount_old)
    }
    if (row.Overdue_rate) {
      row.Overdue_rate = (row.Overdue_rate * 100).toFixed(2) + '%'
    }
    if (row.Overdue_rate_new) {
      row.Overdue_rate_new = (row.Overdue_rate_new * 100).toFixed(2) + '%'
    }
    if (row.Overdue_rate_old) {
      row.Overdue_rate_old = (row.Overdue_rate_old * 100).toFixed(2) + '%'
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD ')
    }
    if (row.修改时间) {
      row.修改时间 = moment(row.修改时间).format('YYYY-MM-DD HH:mm:ss')
    }
  /*  if (row.注册人数) {
      row.注册人数 = formatInt(row.注册人数)
    }
    if (row.登录人数) {
      row.登录人数 = formatInt(row.登录人数)
    }
    if (row.实名认证) {
      row.实名认证 = formatInt(row.实名认证)
    }
    if (row.紧急联系人) {
      row.紧急联系人 = formatInt(row.紧急联系人)
    }
    if (row.运营商认证) {
      row.运营商认证 = formatInt(row.运营商认证)
    }
    if (row.绑卡人数) {
      row.绑卡人数 = formatInt(row.绑卡人数)
    }
    if (row.全要素认证) {
      row.全要素认证 = formatInt(row.全要素认证)
    }
    if (row.工作信息人数) {
      row.工作信息人数 = formatInt(row.工作信息人数)
    }
    if (row.芝麻信用) {
      row.芝麻信用 = formatInt(row.芝麻信用)
    }
    if (row.支付宝) {
      row.支付宝 = formatInt(row.支付宝)
    }
    if (row.淘宝认证) {
      row.淘宝认证 = formatInt(row.淘宝认证)
    }
    if (row.信用卡) {
      row.信用卡 = formatInt(row.信用卡)
    }
    if (row.公积金认证) {
      row.公积金认证 = formatInt(row.公积金认证)
    }
    if (row.申请额度人数) {
      row.申请额度人数 = formatInt(row.申请额度人数)
    }
    if (row.黑名单人数) {
      row.黑名单人数 = formatInt(row.黑名单人数)
    }
    if (row.成功获取额度) {
      row.成功获取额度 = formatInt(row.成功获取额度)
    }
    if (row['购买会员(新用户)']) {
      row['购买会员(新用户)'] = formatInt(row['购买会员(新用户)'])
    }
    if (row['购买会员(老用户)']) {
      row['购买会员(老用户)'] = formatInt(row['购买会员(老用户)'])
    }
    if (row['借款(新用户)']) {
      row['借款(新用户)'] = formatCurrency(row['借款(新用户)'])
    }
    if (row['借款(老用户)']) {
      row['借款(老用户)'] = formatCurrency(row['借款(老用户)'])
    }
    if (row['放款金额(新用户)']) {
      row['放款金额(新用户)'] = formatCurrency(row['放款金额(新用户)'])
    }
    if (row['放款金额(老用户)']) {
      row['放款金额(老用户)'] = formatCurrency(row['放款金额(老用户)'])
    }*/
    if (row['通过率(成功激活人数/激活人数)']) {
      row['通过率(成功激活人数/激活人数)'] = (row['通过率(成功激活人数/激活人数)'] * 100).toFixed(2) + '%'
    }
    if (row.逾期率) {
      row.逾期率 = (row.逾期率 * 100).toFixed(2) + '%'
    }
    if (row['新用户逾期率(金额)']) {
      row['新用户逾期率(金额)'] = (row['新用户逾期率(金额)'] * 100).toFixed(2) + '%'
    }
    if (row['老用户逾期率(金额)']) {
      row['老用户逾期率(金额)'] = (row['老用户逾期率(金额)'] * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.channelSummaryStatistics.order
    let query = sql.period.channelSummaryStatistics.selectAll + queries + order + sql.period.channelSummaryStatistics.selectAllBack
    func.connPool1(query, [tableName.period.channelSummaryStatistics, params.offset, params.limit], function (err, rs) {
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
    let query = sql.period.channelSummaryStatistics.getCount + queries
    func.connPool1(query, [tableName.period.channelSummaryStatistics], function (err, rs) {
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
    if (global.channelSummaryStatisticsCount === 0) {
      global.channelSummaryStatisticsCount++
      pro.exec(shell.channelSummaryStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期渠道汇总统计表shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.channelSummaryStatisticsCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期渠道汇总统计表shell脚本执行成功')
          res.json({code: '200'})
          global.channelSummaryStatisticsCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期渠道汇总统计表开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.channelSummaryStatistics.selectAllExcel + queries + sql.period.channelSummaryStatistics.order
    func.connPool1(query, [tableName.period.channelSummaryStatistics], function (err, rs) {
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
            return false
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
