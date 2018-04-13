let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let fs = require('fs')
let path = require('path')
let XLSXWriter = require('xlsx-writestream')

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.coupon_num) {
      row.coupon_num = formatInt(row.coupon_num)
    }
    if (row.login_cnt) {
      row.login_cnt = formatInt(row.login_cnt)
    }
    if (row.prelogin_cnt) {
      row.prelogin_cnt = formatInt(row.prelogin_cnt)
    }
    if (row.opage_cnt) {
      row.opage_cnt = formatInt(row.opage_cnt)
    }
    if (row.preopage_cnt) {
      row.preopage_cnt = formatCurrency(row.preopage_cnt)
    }
    if (row.online_time) {
      row.online_time = formatInt(row.online_time)
    }
    if (row.preonline_time) {
      row.preonline_time = formatCurrency(row.preonline_time)
    }
    if (row.Acceptinuser_num) {
      row.Acceptinuser_num = formatInt(row.Acceptinuser_num)
    }
    if (row.initiatinuser_num) {
      row.initiatinuser_num = formatInt(row.initiatinuser_num)
    }
    if (row.preinfriend_num) {
      row.preinfriend_num = formatCurrency(row.preinfriend_num)
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
    if (row.优惠券使用数) {
      row.优惠券使用数 = formatInt(row.优惠券使用数)
    }
    if (row.登录次数) {
      row.登录次数 = formatInt(row.登录次数)
    }
    if (row.人均登录次数) {
      row.人均登录次数 = formatInt(row.人均登录次数)
    }
    if (row.打开页面数) {
      row.打开页面数 = formatInt(row.打开页面数)
    }
    if (row.打开页面数均值) {
      row.打开页面数均值 = formatCurrency(row.打开页面数均值)
    }
    if (row.在线时长) {
      row.在线时长 = formatInt(row.在线时长)
    }
    if (row.平均在线时长) {
      row.平均在线时长 = formatCurrency(row.平均在线时长)
    }
    if (row.接受邀请用户数) {
      row.接受邀请用户数 = formatInt(row.接受邀请用户数)
    }
    if (row.发起邀请用户数) {
      row.发起邀请用户数 = formatInt(row.发起邀请用户数)
    }
    if (row.邀请好友数均值) {
      row.邀请好友数均值 = formatCurrency(row.邀请好友数均值)
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.auction.market.channelUserActivity.order
    let query = sql.auction.market.channelUserActivity.selectAll + queries + order + sql.auction.market.channelUserActivity.selectAllBack
    func.connPool1(query, [tableName.channelUserActivity, params.offset, params.limit], function (err, rs) {
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
    let query = sql.auction.market.channelUserActivity.getCount + queries
    func.connPool1(query, [tableName.channelUserActivity], function (err, rs) {
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
    let query = sql.auction.market.channelUserActivity.selectAllExcel + queries + sql.auction.market.channelUserActivity.order
    func.connPool1(query, [tableName.channelUserActivity], function (err, rs) {
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
