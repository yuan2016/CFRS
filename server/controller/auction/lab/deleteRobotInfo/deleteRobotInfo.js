let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
// let tableName = require('../../../../config/tableName')
// let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')

function format(rows) {
  let options = [{value: '', label: '不限'}]
  for (let row of rows) {
    let option = {}
    option.value = row['Tables_in_report']
    option.label = row['Tables_in_report']
    options.push(option)
  }
  return options
}

module.exports = {
  fetchAll(req, res) {
    let query = sql.global.allTables
    func.connPool1(query, [], function (err, rs) {
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
      res.json(format(rs))
    })
  },
  getOne (req, res) {
    let params = req.body
    let query = sql.global.selectOne
    func.connPool1(query, [params.tableName, params.offset, params.limit], function (err, rs) {
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
  getOneNum (req, res) {
    let params = req.body
    let query = sql.global.selectOneNum
    func.connPool1(query, [params.tableName], function (err, rs) {
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
}
