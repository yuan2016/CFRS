let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
global.dailyPromotionEffectStatisticsCount = 0

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.Settlement_price) {
      row.Settlement_price = formatCurrency(row.Settlement_price)
    }
    if (row.channel_consumption) {
      row.channel_consumption = formatCurrency(row.channel_consumption)
    }
    if (row.nusercharge_amt) {
      row.nusercharge_amt = formatCurrency(row.nusercharge_amt)
    }
    if (row.nusercharge_avg) {
      row.nusercharge_avg = formatCurrency(row.nusercharge_avg)
    }
    if (row.ousercharge_amt) {
      row.ousercharge_amt = formatCurrency(row.ousercharge_amt)
    }
    if (row.ousercharge_avg) {
      row.ousercharge_avg = formatCurrency(row.ousercharge_avg)
    }
    if (row.bid_total) {
      row.bid_total = formatCurrency(row.bid_total)
    }
    if (row.avgbidperson_amt) {
      row.avgbidperson_amt = formatCurrency(row.avgbidperson_amt)
    }

    if (row.zpbuy_amt) {
      row.zpbuy_amt = formatCurrency(row.zpbuy_amt)
    }
    if (row.dpurchase_amt) {
      row.dpurchase_amt = formatCurrency(row.dpurchase_amt)
    }
    if (row.cpurchase_amt) {
      row.cpurchase_amt = formatCurrency(row.cpurchase_amt)
    }
    if (row.nuser_recharge_cost) {
      row.nuser_recharge_cost = formatCurrency(row.nuser_recharge_cost)
    }
    if (row.auser_recharge_cost) {
      row.auser_recharge_cost = formatCurrency(row.auser_recharge_cost)
    }
    if (row.Unit_Maori) {
      row.Unit_Maori = formatCurrency(row.Unit_Maori)
    }
    if (row.total_maori) {
      row.total_maori = formatCurrency(row.total_maori)
    }

    if (row.zcoin_amt) {
      row.zcoin_amt = formatInt(row.zcoin_amt)
    }
    if (row.hcoin_amt) {
      row.hcoin_amt = formatInt(row.hcoin_amt)
    }
    //num
    if (row.channel_pv) {
      row.channel_pv = formatInt(row.channel_pv)
    }
    if (row.channel_uv) {
      row.channel_uv = formatInt(row.channel_uv)
    }
    if (row.registration_num) {
      row.registration_num = formatInt(row.registration_num)
    }
    if (row.nusercharge_num) {
      row.nusercharge_num = formatInt(row.nusercharge_num)
    }
    if (row.ousercharge_num) {
      row.ousercharge_num = formatInt(row.ousercharge_num)
    }
    if (row.bid_cnt) {
      row.bid_cnt = formatInt(row.bid_cnt)
    }
    if (row.bidperson_cnt) {
      row.bidperson_cnt = formatInt(row.bidperson_cnt)
    }
    if (row.avgbidperson_cnt) {
      row.avgbidperson_cnt = formatInt(row.avgbidperson_cnt)
    }
    if (row.zp_total_cnt) {
      row.zp_total_cnt = formatInt(row.zp_total_cnt)
    }
    if (row.zpperson_cnt) {
      row.zpperson_cnt = formatInt(row.zpperson_cnt)
    }
    if (row.avg_zpperson_cnt) {
      row.avg_zpperson_cnt = formatInt(row.avg_zpperson_cnt)
    }
    if (row.zpbuy_cnt) {
      row.zpbuy_cnt = formatInt(row.zpbuy_cnt)
    }
    if (row.zpfail_cnt) {
      row.zpfail_cnt = formatInt(row.zpfail_cnt)
    }
    if (row.dpurchase_cnt) {
      row.dpurchase_cnt = formatInt(row.dpurchase_cnt)
    }


    if (row.uv_Conversionrate) {
      row.uv_Conversionrate = (row.uv_Conversionrate * 100).toFixed(2) + '%'
    }
    if (row.reg_Conversionrate) {
      row.reg_Conversionrate = (row.reg_Conversionrate * 100).toFixed(2) + '%'
    }
    if (row.nusercharge_rate) {
      row.nusercharge_rate = (row.nusercharge_rate * 100).toFixed(2) + '%'
    }
    if (row.zpbuy_rate) {
      row.zpbuy_rate = (row.zpbuy_rate * 100).toFixed(2) + '%'
    }
    if (row.Invalid_rate) {
      row.Invalid_rate = (row.Invalid_rate * 100).toFixed(2) + '%'
    }
    if (row.dpurchase_rate) {
      row.dpurchase_rate = (row.dpurchase_rate * 100).toFixed(2) + '%'
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
    // money
    /*if (row['结算单价(元)']) {
      row['结算单价(元)'] = formatCurrency(row['结算单价(元)'])
    }*/
    if (row['渠道消耗(元)']) {
      row['渠道消耗(元)'] = formatCurrency(row['渠道消耗(元)'])
    }
    if (row['新用户充值金额(元)']) {
      row['新用户充值金额(元)'] = formatCurrency(row['新用户充值金额(元)'])
    }
    if (row['新用户充值均值(元)']) {
      row['新用户充值均值(元)'] = formatCurrency(row['新用户充值均值(元)'])
    }
    if (row['老用户充值金额(元)']) {
      row['老用户充值金额(元)'] = formatCurrency(row['老用户充值金额(元)'])
    }
    if (row['老用户充值均值(元)']) {
      row['老用户充值均值(元)'] = formatCurrency(row['老用户充值均值(元)'])
    }
    if (row['竞拍总出价额(元)']) {
      row['竞拍总出价额(元)'] = formatCurrency(row['竞拍总出价额(元)'])
    }
    if (row['竞拍人均出价额(元)']) {
      row['竞拍人均出价额(元)'] = formatCurrency(row['竞拍人均出价额(元)'])
    }
    if (row['中拍购买总额(元)']) {
      row['中拍购买总额(元)'] = formatCurrency(row['中拍购买总额(元)'])
    }
    if (row['差价购买额(元)']) {
      row['差价购买额(元)'] = formatCurrency(row['差价购买额(元)'])
    }
    if (row['商品购买总额(元)']) {
      row['商品购买总额(元)'] = formatCurrency(row['商品购买总额(元)'])
    }
    if (row['新用户充值成本(元)']) {
      row['新用户充值成本(元)'] = formatCurrency(row['新用户充值成本(元)'])
    }
    if (row['总用户充值成本(元)']) {
      row['总用户充值成本(元)'] = formatCurrency(row['总用户充值成本(元)'])
    }
    if (row['单位毛利(元)']) {
      row['单位毛利(元)'] = formatCurrency(row['单位毛利(元)'])
    }
    if (row['总毛利(元)']) {
      row['总毛利(元)'] = formatCurrency(row['总毛利(元)'])
    }

    if (row['赠币消耗总额(个)']) {
      row['赠币消耗总额(个)'] = formatInt(row['赠币消耗总额(个)'])
    }
    if (row['开心币消耗总额(个)']) {
      row['开心币消耗总额(个)'] = formatInt(row['开心币消耗总额(个)'])
    }
    //num
    if (row.PV) {
      row.PV = formatInt(row.PV)
    }
    if (row.UV) {
      row.UV = formatInt(row.UV)
    }
    if (row.注册数) {
      row.注册数 = formatInt(row.注册数)
    }
    if (row.新用户充值人数) {
      row.新用户充值人数 = formatInt(row.新用户充值人数)
    }
    if (row.老用户充值人数) {
      row.老用户充值人数 = formatInt(row.老用户充值人数)
    }
    if (row.竞拍出价总次数) {
      row.竞拍出价总次数 = formatInt(row.竞拍出价总次数)
    }
    if (row.参与竞拍人数) {
      row.参与竞拍人数 = formatInt(row.参与竞拍人数)
    }
    if (row.人均竞拍次数) {
      row.人均竞拍次数 = formatInt(row.人均竞拍次数)
    }
    if (row.中拍总次数) {
      row.中拍总次数 = formatInt(row.中拍总次数)
    }
    if (row.中拍人数) {
      row.中拍人数 = formatInt(row.中拍人数)
    }
    if (row.人均中拍数) {
      row.人均中拍数 = formatInt(row.人均中拍数)
    }
    if (row.中拍购买数) {
      row.中拍购买数 = formatInt(row.中拍购买数)
    }
    if (row.中拍未付失效单数) {
      row.中拍未付失效单数 = formatInt(row.中拍未付失效单数)
    }
    if (row.差价购买数) {
      row.差价购买数 = formatInt(row.差价购买数)
    }


    if (row.UV转化率) {
      row.UV转化率 = (row.UV转化率 * 100).toFixed(2) + '%'
    }
    if (row.注册转化率) {
      row.注册转化率 = (row.注册转化率 * 100).toFixed(2) + '%'
    }
    if (row.新用户充值率) {
      row.新用户充值率 = (row.新用户充值率 * 100).toFixed(2) + '%'
    }
    if (row.失效率) {
      row.失效率 = (row.失效率 * 100).toFixed(2) + '%'
    }
    if (row.差价购买率) {
      row.差价购买率 = (row.差价购买率 * 100).toFixed(2) + '%'
    }
    if (row.中拍购买率) {
      row.中拍购买率 = (row.中拍购买率 * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.auction.market.dailyPromotionEffectStatistics.order
    let query = sql.auction.market.dailyPromotionEffectStatistics.selectAll + queries + order + sql.auction.market.dailyPromotionEffectStatistics.selectAllBack
    func.connPool1(query, [tableName.dailyPromotionEffectStatistics, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.auction.market.dailyPromotionEffectStatistics.getCount + queries
    func.connPool1(query, [tableName.dailyPromotionEffectStatistics], function (err, rs) {
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
    if (global.dailyPromotionEffectStatisticsCount === 0) {
      global.dailyPromotionEffectStatisticsCount++
      pro.exec(shell.dailyPromotionEffectStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 渠道每日统计shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.dailyPromotionEffectStatisticsCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 渠道每日统计shell脚本执行成功')
          res.json({code: '200'})
          global.dailyPromotionEffectStatisticsCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 渠道每日统计开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.auction.market.dailyPromotionEffectStatistics.selectAllExcel + queries + sql.auction.market.dailyPromotionEffectStatistics.order
    func.connPool1(query, [tableName.dailyPromotionEffectStatistics], function (err, rs) {
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
