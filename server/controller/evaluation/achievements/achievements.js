let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis} = require('../../../utils/utils')
// let path = require('path')
// let fs = require('fs')
// let XLSXWriter = require('xlsx-writestream')

// function formatExcelData (rows) {
//   return rows.map(row => {
//     if (row.创建时间) {
//       row.创建时间 = moment(row.创建时间).format('YYYY-MM-DD HH:mm:ss')
//     }
//     return row
//   })
// }
function formatData (rows) {
  return rows.map(row => {
    if (row.creator === '11111') {
      row.creator = '自动化创建'
    }
    return row
  })
}

module.exports = {

  //绩效考评
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, '', 'w')
    let query = sql.evaluation.achievements.selectAllFront + queries + sql.evaluation.achievements.selectAllLimit
    func.connPool1(query, [tableName.evaluation.achievements, params.offset, params.limit], function (err, rs) {
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
      res.json(formatData(rs))
    })
  },
  //绩效考评总条数
  getCount (req, res) {
    let params = req.body
    let query = sql.evaluation.achievements.getCount
    func.connPool1(query, tableName.evaluation.achievements, function (err, rs) {
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
  }
//   getExcelData (req, res) {
//     let params = req.query
//     let queries = analysis(params, 't.created_at', 'a')
//     let query = sql.promotionManagement.promotionChannel.selectAllExcel + queries
//     func.connPool1(query, [tableName.promotionChannel.t, tableName.promotionChannel.t1], function (err, rs) {
//       if (err) {
//         console.log('[query] - :' + err)
//         if (err.message === 'Query inactivity timeout') {
//           res.json({
//             code: '1024'
//           })
//         } else {
//           res.json({
//             code: '404'
//           })
//         }
//         return
//       }
//       rs = formatExcelData(rs)
//       let fileName = mosaicName()
//       let currFilePath = path.join(process.cwd(), fileName)
//       let options = {
//         headers: {
//           'Content-Disposition': 'attachment; filename=' + fileName
//         }
//       }
//       let writer = new XLSXWriter(fileName, {})
//       let wirteStream = fs.createWriteStream(fileName)
//
// // After instantiation, you can grab the readstream at any time.
//       writer.getReadStream().pipe(wirteStream)
//       for (let i of rs) {
//         writer.addRow(i)
//       }
//       writer.finalize()
//       wirteStream.on('finish', function () {
//         // finish
//         res.sendFile(currFilePath, options, function () {
//           if (err) {
//             console.log(err)
//             res.sendFile(path.join(process.cwd(), 'error.html'))
//             return
//           } else {
//             console.log('Sent:', fileName)
//             fs.unlink(currFilePath, function (err) {
//               if (err) console.log(err)
//               console.log('文件删除成功')
//             })
//           }
//         })
//       })
//     }, 180000)
//   }
}

