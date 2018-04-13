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
    if (row.authentication_at) {
      row.authentication_at = moment(row.authentication_at).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.order_time) {
      row.order_time = moment(row.order_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.second_time) {
      row.second_time = moment(row.second_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.repayment_real_time) {
      row.repayment_real_time = moment(row.repayment_real_time).format('YYYY-MM-DD HH:mm:ss')
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
    if (row.认证时间) {
      row.认证时间 = moment(row.认证时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.申请首贷时间) {
      row.申请首贷时间 = moment(row.申请首贷时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.申请复贷时间) {
      row.申请复贷时间 = moment(row.申请复贷时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.首贷还款时间) {
      row.首贷还款时间 = moment(row.首贷还款时间).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.首贷借款金额) {
      row.首贷借款金额 = formatCurrency(row.首贷借款金额)
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
    let queries = analysis(params, ['registe_at', 'authentication_at', 'order_time', 'second_time', 'repayment_real_time'], 'w')
    let order = params.order || ''
    let query = sql.userInformationManagement.newUserTagList.selectAllFront + queries + order + sql.userInformationManagement.newUserTagList.limit

    func.connPool1(query, [tableName.NewUserTagList, params.offset, params.limit], function (err, rs) {
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
    let queries = analysis(params, ['registe_at', 'authentication_at', 'order_time', 'second_time', 'repayment_real_time'], 'w')
    let query = sql.userInformationManagement.newUserTagList.getCount + queries
    func.connPool1(query, [tableName.NewUserTagList], function (err, rs) {
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
    let queries = analysis(params, ['registe_at', 'authentication_at', 'order_time', 'second_time', 'repayment_real_time'], 'w')
    let query = sql.userInformationManagement.newUserTagList.newUserTagListExcel + queries
    func.connPool1(query, [tableName.NewUserTagList], function (err, rs) {
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

