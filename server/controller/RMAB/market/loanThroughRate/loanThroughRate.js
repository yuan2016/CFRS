let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let tableName = require('../../../../config/tableName')

module.exports = {
  //借款通过率数据
  fetchAll (req, res) {
    let params = req.body
    func.connPool1(sql.RMAB.loanThroughRate.selectAll, tableName.loanThroughRate, function (err, rs) {
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
    func.connPool1(sql.RMAB.loanThroughRate.selectAll, tableName.loanThroughRateAll, function (err, rs) {
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
    }, 70000)
  }
}
