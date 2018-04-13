let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let tableName = require('../../../../config/tableName')

module.exports = {
  //借款通过率数据
  fetchAll (req, res) {
    let params = req.body
    let loan_term = params.loan_term[0] || ''
    func.connPool1(sql.RMAB.loanOverdueRecallRate.selectAll, [tableName.loanOverdueRecallRate, loan_term], function (err, rs) {
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
