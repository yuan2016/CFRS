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
global.userRechargeTimeAnalysisCount = 0


function formatProperty (rs) {
  let result = {}
  result.a = []
  result.b = []
  if (rs.length > 0) {
    let a = []
    let b = []
    let keys = Object.keys(rs[0])
    rs.map(r => {
      a.push(r[keys[0]])
      b.push(r[keys[1]])
    })
    result.a = a
    result.b = b
  }
  return result
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let query = sql.toyGrab.market.userRechargeTimeAnalysis.getOnlineNumber
    func.connPool1(query, [tableName.userRechargeTimeAnalysis, params.date], function (err, rs) {
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
      res.json(formatProperty(rs))
    })
  }
}
