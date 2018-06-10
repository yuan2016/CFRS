let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {analysis, mosaicName, formatCurrency, formatInt} = require('../../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    //率
    if (row.uv_conversion_rate) {
      row.uv_conversion_rate = (row.uv_conversion_rate).toFixed(2) + '%'
    }
    if (row.click_conversion_rate) {
      row.click_conversion_rate = (row.click_conversion_rate).toFixed(2) + '%'
    }
    if (row.register_conversion_rate) {
      row.register_conversion_rate = (row.register_conversion_rate).toFixed(2) + '%'
    }
    if (row.hmd_rate) {
      row.hmd_rate = (row.hmd_rate).toFixed(2) + '%'
    }
    if (row.nuser_buy_rate) {
      row.nuser_buy_rate = (row.nuser_buy_rate).toFixed(2) + '%'
    }
    if (row.ouser_buy_rate) {
      row.ouser_buy_rate = (row.ouser_buy_rate).toFixed(2) + '%'
    }
    if (row.nuser_buyback_rate) {
      row.nuser_buyback_rate = (row.nuser_buyback_rate).toFixed(2) + '%'
    }
    if (row.ouser_buyback_rate) {
      row.ouser_buyback_rate = (row.ouser_buyback_rate).toFixed(2) + '%'
    }
    if (row.overdue_rate) {
      row.overdue_rate = (row.overdue_rate).toFixed(2) + '%'
    }
    if (row.recovery_rate) {
      row.recovery_rate = (row.recovery_rate).toFixed(2) + '%'
    }
    if (row.bad_debt_rate) {
      row.bad_debt_rate = (row.bad_debt_rate).toFixed(2) + '%'
    }
    if (row.annual_rate) {
      row.annual_rate = (row.annual_rate).toFixed(2) + '%'
    }

    if (row.unit_price) {
      row.unit_price = formatCurrency(row.unit_price)
    }
    if (row.channel_consumption) {
      row.channel_consumption = formatCurrency(row.channel_consumption)
    }
    if (row.nuser_loan_amount) {
      row.nuser_loan_amount = formatCurrency(row.nuser_loan_amount)
    }
    if (row.ouser_loan_amount) {
      row.ouser_loan_amount = formatCurrency(row.ouser_loan_amount)
    }
    if (row.loan_amount) {
      row.loan_amount = formatCurrency(row.loan_amount)
    }
    if (row.overdue_amount) {
      row.overdue_amount = formatCurrency(row.overdue_amount)
    }
    if (row.unit_bad_debts) {
      row.unit_bad_debts = formatCurrency(row.unit_bad_debts)
    }
    if (row.credit_cost) {
      row.credit_cost = formatCurrency(row.credit_cost)
    }
    if (row.annual_income) {
      row.annual_income = formatCurrency(row.annual_income)
    }
    if (row.interest) {
      row.interest = formatCurrency(row.interest)
    }
    if (row.new_customer_cost) {
      row.new_customer_cost = formatCurrency(row.new_customer_cost)
    }
    if (row.new_unit_maori) {
      row.new_unit_maori = formatCurrency(row.new_unit_maori)
    }
    
    if (row.element4_authentication) {
      row.element4_authentication = formatInt(row.element4_authentication)
    }
    if (row.credit_suss_num) {
      row.credit_suss_num = formatInt(row.credit_suss_num)
    }
    if (row.credit_fail_num) {
      row.credit_fail_num = formatInt(row.credit_fail_num)
    }
    if (row.hmd_num) {
      row.hmd_num = formatInt(row.hmd_num)
    }
    if (row.nuser_buy_num) {
      row.nuser_buy_num = formatInt(row.nuser_buy_num)
    }
    if (row.ouser_buy_num) {
      row.ouser_buy_num = formatInt(row.ouser_buy_num)
    }
    if (row.buy_num) {
      row.buy_num = formatInt(row.buy_num)
    }
    if (row.nuser_buyback_num) {
      row.nuser_buyback_num = formatInt(row.nuser_buyback_num)
    }
    if (row.ouser_buyback_num) {
      row.ouser_buyback_num = formatInt(row.ouser_buyback_num)
    }
    if (row.nuser_buycard_num) {
      row.nuser_buycard_num = formatInt(row.nuser_buycard_num)
    }
    if (row.nuser_buyback_apply_num) {
      row.nuser_buyback_apply_num = formatInt(row.nuser_buyback_apply_num)
    }
    if (row.ouser_buycard_num) {
      row.ouser_buycard_num = formatInt(row.ouser_buycard_num)
    }
    if (row.ouser_buyback_apply_num) {
      row.ouser_buyback_apply_num = formatInt(row.ouser_buyback_apply_num)
    }
    if (row.average_price) {
      row.average_price = formatInt(row.average_price)
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
    //率
    if (row.UV转化率) {
      row.UV转化率 = (row.UV转化率).toFixed(2) + '%'
    }
    if (row.点击转化率) {
      row.点击转化率 = (row.点击转化率).toFixed(2) + '%'
    }
    if (row.注册转化率) {
      row.注册转化率 = (row.注册转化率).toFixed(2) + '%'
    }
    if (row.黑名单率) {
      row.黑名单率 = (row.黑名单率).toFixed(2) + '%'
    }
    if (row.新用户购买率) {
      row.新用户购买率 = (row.新用户购买率).toFixed(2) + '%'
    }
    if (row.老用户购买率) {
      row.老用户购买率 = (row.老用户购买率).toFixed(2) + '%'
    }
    if (row.新用户回购成功率) {
      row.新用户回购成功率 = (row.新用户回购成功率).toFixed(2) + '%'
    }
    if (row.老用户回购成功率) {
      row.老用户回购成功率 = (row.老用户回购成功率).toFixed(2) + '%'
    }
    if (row.逾期率) {
      row.逾期率 = (row.逾期率).toFixed(2) + '%'
    }
    if (row.催回率) {
      row.催回率 = (row.催回率).toFixed(2) + '%'
    }
    if (row.坏账率) {
      row.坏账率 = (row.坏账率).toFixed(2) + '%'
    }
    if (row.年化率) {
      row.年化率 = (row.年化率).toFixed(2) + '%'
    }

    if (row.结算单价) {
      row.结算单价 = formatCurrency(row.结算单价)
    }
    if (row.渠道消耗) {
      row.渠道消耗 = formatCurrency(row.渠道消耗)
    }
    if (row.新用户放款金额) {
      row.新用户放款金额 = formatCurrency(row.新用户放款金额)
    }
    if (row.老用户放款金额) {
      row.老用户放款金额 = formatCurrency(row.老用户放款金额)
    }
    if (row.总放款金额) {
      row.总放款金额 = formatCurrency(row.总放款金额)
    }
    if (row.逾期金额) {
      row.逾期金额 = formatCurrency(row.逾期金额)
    }
    if (row.单位坏账额) {
      row.单位坏账额 = formatCurrency(row.单位坏账额)
    }
    if (row.单位征信成本) {
      row.单位征信成本 = formatCurrency(row.单位征信成本)
    }
    if (row.年化收入) {
      row.年化收入 = formatCurrency(row.年化收入)
    }
    if (row.利息) {
      row.利息 = formatCurrency(row.利息)
    }
    if (row.新用户单位获客成本) {
      row.新用户单位获客成本 = formatCurrency(row.新用户单位获客成本)
    }
    if (row.新用户单位毛利) {
      row.新用户单位毛利 = formatCurrency(row.新用户单位毛利)
    }
    
    if (row.全要素认证数) {
      row.全要素认证数 = formatInt(row.全要素认证数)
    }
    if (row.授信成功人数) {
      row.授信成功人数 = formatInt(row.授信成功人数)
    }
    if (row.授信失败人数) {
      row.授信失败人数 = formatInt(row.授信失败人数)
    }
    if (row.黑名单人数) {
      row.黑名单人数 = formatInt(row.黑名单人数)
    }
    if (row.新用户购买商品人数) {
      row.新用户购买商品人数 = formatInt(row.新用户购买商品人数)
    }
    if (row.老用户购买商品人数) {
      row.老用户购买商品人数 = formatInt(row.老用户购买商品人数)
    }
    if (row.购买总人数) {
      row.购买总人数 = formatInt(row.购买总人数)
    }
    if (row.新用户回购成功人数) {
      row.新用户回购成功人数 = formatInt(row.新用户回购成功人数)
    }
    if (row.老用户回购成功人数) {
      row.老用户回购成功人数 = formatInt(row.老用户回购成功人数)
    }
    if (row.新用户购买会员卡数) {
      row.新用户购买会员卡数 = formatInt(row.新用户购买会员卡数)
    }
    if (row.新用户购买会员申请数) {
      row.新用户购买会员申请数 = formatInt(row.新用户购买会员申请数)
    }
    if (row.老用户购买会员卡数) {
      row.老用户购买会员卡数 = formatInt(row.老用户购买会员卡数)
    }
    if (row.老用户购买会员申请数) {
      row.老用户购买会员申请数 = formatInt(row.老用户购买会员申请数)
    }
    if (row.件均) {
      row.件均 = formatInt(row.件均)
    }
    return row
  })
}

function packageRows (rows) {
  let options = [{value: '', label: '不限'}]
  for (let row of rows) {
    let option = {}
    if (row.channel_name && row.channel_name !== '') {
      option.value = row.channel_name
      option.label = row.channel_name
      options.push(option)
    }
  }
  return options
}

module.exports = {

  //用户通讯录数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'mm_month', 'a')
    let order = params.order || sql.flashCard.market.monthlyPromotionEffectSummary.order
    let query = sql.flashCard.market.monthlyPromotionEffectSummary.selectAllFront + queries + order
    func.connPool1(query, [tableName.flashCard.monthlyPromotionEffectSummary, params.offset, params.limit], function (err, rs) {
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
  //用户通讯录总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'mm_month', 'a')
    let query = sql.flashCard.market.monthlyPromotionEffectSummary.getCount + queries
    func.connPool1(query, tableName.flashCard.monthlyPromotionEffectSummary, function (err, rs) {
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
    func.connPool1(sql.flashCard.market.monthlyPromotionEffectSummary.getSelectOptions, tableName.flashCard.monthlyPromotionEffectSummary, function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      rs = packageRows(rs)
      res.json(rs)
    })
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'mm_month', 'a')
    let query = sql.flashCard.market.monthlyPromotionEffectSummary.selectAllExcel + queries
    func.connPool1(query, tableName.flashCard.monthlyPromotionEffectSummary, function (err, rs) {
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
/**
 * Created by Administrator on 2017/7/10.
 */

