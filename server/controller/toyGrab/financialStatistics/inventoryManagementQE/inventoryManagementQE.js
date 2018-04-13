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
global.inventoryManagementQECount = 0


function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.y_unit_price) {
      row.y_unit_price = formatCurrency(row.y_unit_price)
    }
    if (row.y_amt) {
      row.y_amt = formatCurrency(row.y_amt)
    }
    if (row.r_unit_price) {
      row.r_unit_price = formatCurrency(row.r_unit_price)
    }
    if (row.r_amt) {
      row.r_amt = formatCurrency(row.r_amt)
    }
    if (row.c_unit_price) {
      row.c_unit_price = formatCurrency(row.c_unit_price)
    }
    if (row.c_amt) {
      row.c_amt = formatCurrency(row.c_amt)
    }
    if (row.t_unit_price) {
      row.t_unit_price = formatCurrency(row.t_unit_price)
    }
    if (row.t_amt) {
      row.t_amt = formatCurrency(row.t_amt)
    }
    //num
    if (row.y_num) {
      row.y_num = formatInt(row.y_num)
    }
    if (row.r_num) {
      row.r_num = formatInt(row.r_num)
    }
    if (row.c_num) {
      row.c_num = formatInt(row.c_num)
    }
    if (row.t_num) {
      row.t_num = formatInt(row.t_num)
    }

    return row
  })
}

function formatExcelData (rows) {
  return rows.map(row => {
    if (row.日期) {
      row.日期 = moment(row.日期).format('YYYY-MM-DD')
    }

    if (row['昨日单价(元)']) {
      row['昨日单价(元)'] = formatCurrency(row['昨日单价(元)'])
    }
    if (row['昨日库存金额(元)']) {
      row['昨日库存金额(元)'] = formatCurrency(row['昨日库存金额(元)'])
    }
    if (row['入库单价(元)']) {
      row['入库单价(元)'] = formatCurrency(row['入库单价(元)'])
    }
    if (row['入库金额(元)']) {
      row['入库金额(元)'] = formatCurrency(row['入库金额(元)'])
    }
    if (row['出库单价(元)']) {
      row['出库单价(元)'] = formatCurrency(row['出库单价(元)'])
    }
    if (row['出库金额(元)']) {
      row['出库金额(元)'] = formatCurrency(row['出库金额(元)'])
    }
    if (row['今日库存单价(元)']) {
      row['今日库存单价(元)'] = formatCurrency(row['今日库存单价(元)'])
    }
    if (row['今日库存金额(元)']) {
      row['今日库存金额(元)'] = formatCurrency(row['今日库存金额(元)'])
    }
    //num
    if (row.昨日数量) {
      row.昨日数量 = formatInt(row.昨日数量)
    }
    if (row.入库数量) {
      row.入库数量 = formatInt(row.入库数量)
    }
    if (row.出库数量) {
      row.出库数量 = formatInt(row.出库数量)
    }
    if (row.今日库存数量) {
      row.今日库存数量 = formatInt(row.今日库存数量)
    }
    return row
  })
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.financeAnalysis.inventoryManagementQE.order
    let query = sql.financeAnalysis.inventoryManagementQE.selectAll + queries + order + sql.financeAnalysis.inventoryManagementQE.selectAllBack
    func.connPool1(query, [tableName.inventoryManagementQE, params.offset, params.limit], function (err, rs) {
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
    let query = sql.financeAnalysis.inventoryManagementQE.getCount + queries
    func.connPool1(query, [tableName.inventoryManagementQE], function (err, rs) {
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
    if (global.inventoryManagementQECount === 0) {
      global.inventoryManagementQECount++
      pro.exec(shell.inventoryManagementQE, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 企鹅进销存明细表统计shell脚本执行失败')
          res.json({code: '500'})
          global.inventoryManagementQECount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 企鹅进销存明细表统计shell脚本执行成功')
          res.json({code: '200'})
          global.inventoryManagementQECount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 企鹅进销存明细表统计开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.financeAnalysis.inventoryManagementQE.selectAllExcel + queries + sql.financeAnalysis.inventoryManagementQE.order
    func.connPool1(query, [tableName.inventoryManagementQE], function (err, rs) {
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
