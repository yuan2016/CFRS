let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis, formatCurrency, mosaicName} = require('../../../utils/utils')
let path = require('path')
let fs = require('fs')
let XLSXWriter = require('xlsx-writestream')
function formatData (rows) {
  return rows.map(row => {
    if (row.add_time) {
      row.add_time = moment(row.add_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.use_time) {
      row.use_time = moment(row.use_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.discount) {
      row.discount = formatCurrency(row.discount)
    }
    if (row.borrow_money) {
      row.borrow_money = formatCurrency(row.borrow_money)
    }
    if (row.borrow_suss !== '') {
      switch (row.borrow_suss)
      {
        case 1:
          row.borrow_suss = '是'
          break
        default:
          row.borrow_suss = '否'
          break
      }
    }
    if (row.status !== '') {
      switch (row.status)
      {
        case 1:
          row.status = '未使用'
          break
        case 2:
          row.status = '已使用'
          break
        case 3:
          row.status = '已过期'
          break
      }
    }
    return row
  })
}
function formatExcelData (rows) {
  return rows.map(row => {
    if (row.优惠券获取时间) {
      row.优惠券获取时间 = moment(row.优惠券获取时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.优惠券使用时间) {
      row.优惠券使用时间 = moment(row.优惠券使用时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row['优惠券面额/折扣']) {
      row['优惠券面额/折扣'] = formatCurrency(row['优惠券面额/折扣'])
    }
    if (row.使用优惠券申请借款金额) {
      row.使用优惠券申请借款金额 = formatCurrency(row.使用优惠券申请借款金额)
    }
    if (row.是否成功借款 !== '') {
      switch (row.是否成功借款)
      {
        case 1:
          row.是否成功借款 = '是'
          break
        default:
          row.是否成功借款 = '否'
          break
      }
    }
    if (row.优惠券使用状态 !== '') {
      switch (row.优惠券使用状态)
      {
        case 1:
          row.优惠券使用状态 = '未使用'
          break
        case 2:
          row.优惠券使用状态 = '已使用'
          break
        case 3:
          row.优惠券使用状态 = '已过期'
          break
      }
    }
    return row
  })
}
module.exports = {
  //用户列表数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'a.use_time', 'w', 'a')
    let order = params.order || ''
    queries = queries.replace('a.borrow_suss = "1"', ' a.asset_id <> "0" and b.status in (21,23,30,-11,-20,34)')
    queries = queries.replace('a.borrow_suss = "0"', ' (a.asset_id = "0" or b.status not in (21,23,30,-11,-20,34))')
    let query = sql.userInformationManagement.discountCoupon.selectAllFront + queries + order + sql.userInformationManagement.discountCoupon.limit
    func.connPool2(query, [tableName.discountCoupon.a, tableName.discountCoupon.b, params.offset, params.limit], function (err, rs) {
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
  //用户列表总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'a.use_time', 'w', 'a')
    queries = queries.replace('a.borrow_suss = "1"', ' a.asset_id <> "0" and b.status in (21,23,30,-11,-20,34)')
    queries = queries.replace('a.borrow_suss = "0"', ' (a.asset_id = "0" or b.status not in (21,23,30,-11,-20,34))')
    let query = sql.userInformationManagement.discountCoupon.getCount + queries
    func.connPool2(query, [tableName.discountCoupon.a, tableName.discountCoupon.b], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        console.log(err.message)
        console.log(err.message === 'Query inactivity timeout')
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
    let queries = analysis(params, 'a.use_time', 'w')
    queries = queries.replace('a.borrow_suss = "1"', ' a.asset_id <> "0" and b.status in (21,23,30,-11,-20,34)')
    queries = queries.replace('a.borrow_suss = "0"', ' (a.asset_id = "0" or b.status not in (21,23,30,-11,-20,34))')
    let query = sql.userInformationManagement.discountCoupon.discountCouponExcel + queries
    func.connPool2(query, [tableName.discountCoupon.a, tableName.discountCoupon.b], function (err, rs) {
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

