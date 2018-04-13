let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let tableName = require('../../../../config/tableName')
let {analysis} = require('../../../../utils/utils')

module.exports = {
  //借款通过率数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'w')
    let query = sql.RMAB.riskControlFactorAnalysis.selectAll + queries
    func.connPool1(query, tableName.riskControlFactorAnalysis, function (err, rs) {
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
