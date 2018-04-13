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
    if (row.registe_at) {
      row.registe_at = moment(row.registe_at).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.last_borrow_time) {
      row.last_borrow_time = moment(row.last_borrow_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.last_repayment_time) {
      row.last_repayment_time = moment(row.last_repayment_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.money_amount) {
      row.money_amount = formatCurrency(row.money_amount)
    }
    if (row.hmd !== '') {
      switch (row.hmd)
      {
        case 1:
          row.hmd = '是'
          break
        default:
          row.hmd = '否'
          break
      }
    }
    if (row.status !== '') {
      switch (row.status)
      {
        case 0:
          row.status = '待初审(待机审)'
          break
        case -3:
          row.status = '初审驳回'
          break
        case 1:
          row.status = '初审驳回'
          break
        case -4:
          row.status = '复审驳回'
          break
        case 20:
          row.status = '复审通过,待放款'
          break
        case -5:
          row.status = '放款驳回'
          break
        case 22:
          row.status = '放款中'
          break
        case -10:
          row.status = '放款失败'
          break
        case 21:
          row.status = '已放款，还款中'
          break
        case 23:
          row.status = '部分还款'
          break
        case 30:
          row.status = '已还款'
          break
        case -11:
          row.status = '已逾期'
          break
        case -20:
          row.status = '已坏账'
          break
        case 34:
          row.status = '逾期已还款'
          break
      }
    }
    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.注册时间) {
      row.注册时间 = moment(row.注册时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.最近一次借款时间) {
      row.最近一次借款时间 = moment(row.最近一次借款时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.最近一次还款时间) {
      row.最近一次还款时间 = moment(row.最近一次还款时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.累计借款金额) {
      row.累计借款金额 = formatCurrency(row.累计借款金额)
    }
    if (row.黑名单 === 1) {
      row.黑名单 = '是'
    } else if (row.黑名单 === 0) {
      row.黑名单 = '否'
    }
    if (row.还款状态 !== '') {
      switch (row.还款状态)
      {
        case 0:
          row.还款状态 = '待初审(待机审)'
          break
        case -3:
          row.还款状态 = '初审驳回'
          break
        case 1:
          row.还款状态 = '初审驳回'
          break
        case -4:
          row.还款状态 = '复审驳回'
          break
        case 20:
          row.还款状态 = '复审通过,待放款'
          break
        case -5:
          row.还款状态 = '放款驳回'
          break
        case 22:
          row.还款状态 = '放款中'
          break
        case -10:
          row.还款状态 = '放款失败'
          break
        case 21:
          row.还款状态 = '已放款，还款中'
          break
        case 23:
          row.还款状态 = '部分还款'
          break
        case 30:
          row.还款状态 = '已还款'
          break
        case -11:
          row.还款状态 = '已逾期'
          break
        case -20:
          row.还款状态 = '已坏账'
          break
        case 34:
          row.还款状态 = '逾期已还款'
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
    let queries = analysis(params, ['a.registe_at', 'a.last_borrow_time', 'a.last_repayment_time', 'b.order_time'], 'w', 'a')
    let order = params.order || ''
    let query = sql.userInformationManagement.oldUserTagList.selectAllFront + queries + order + sql.userInformationManagement.oldUserTagList.groupBy + sql.userInformationManagement.oldUserTagList.limit
    func.connPool1(query, [tableName.OldUserTagList.a, tableName.OldUserTagList.b, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, ['a.registe_at', 'a.last_borrow_time', 'a.last_repayment_time', 'b.order_time'], 'w', 'a')
    let query = sql.userInformationManagement.oldUserTagList.getCount + queries
    func.connPool1(query, [tableName.OldUserTagList.a, tableName.OldUserTagList.b], function (err, rs) {
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
    let queries = analysis(params, ['a.registe_at', 'a.last_borrow_time', 'a.last_repayment_time', 'b.order_time'], 'w', 'a')
    let query = sql.userInformationManagement.oldUserTagList.oldUserTagListExcel + queries + sql.userInformationManagement.oldUserTagList.groupBy
    func.connPool1(query, [tableName.OldUserTagList.a, tableName.OldUserTagList.b], function (err, rs) {
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

