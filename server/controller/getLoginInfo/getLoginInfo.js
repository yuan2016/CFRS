let sql = require('../../sql/sqlMap')
let func = require('../../sql/func')
let tableName = require('../../config/tableName')

module.exports = {
  //拉取登录信息
  getInfo (req, res) {
    let params = req.body
    let query = sql.userData.select
    func.connPool1(query, [tableName.login, params.phoneNumber], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      res.json(rs)
    })
  },
  getInfoEmail (req, res) {
    let params = req.body
    let query = sql.userData.select2
    func.connPool1(query, [tableName.login, params.email], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      res.json(rs)
    })
  },
  //修改用户信息
  modifyInfo (req, res) {
    let params = req.body.formData
    let query = sql.userData.update
    func.connPool1(query, [tableName.login, params.user_name, params.user_sex, params.user_mobile, params.department, params.user_email], function (err, rs) {
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
      if (rs.changedRows === 1) {
        res.json(200)
      } else {
        res.json(500)
      }
    })
  }
}
