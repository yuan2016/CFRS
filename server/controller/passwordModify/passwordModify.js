let sql = require('../../sql/sqlMap')
let func = require('../../sql/func')
let tableName = require('../../config/tableName')

function judgment (rs, password) {
  if (rs.length > 0) {
    let realPwd = rs[0].user_password
    if (realPwd === password) {
      return 200
    }
  } else {
    return 500
  }
}

module.exports = {
//修改密码
  confirm (req, res) {
    let params = req.body
    let query = sql.passwordModify.getPass
    let password = params.password
    func.connPool1(query, [tableName.passwordModify, params.email], function (err, rs) {
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
      let result = judgment(rs, password)
      res.json(result)
    })
  },
  modify (req, res) {
    console.log('开始修改密码')
    let params = req.body
    let query = sql.passwordModify.modifyPass
    func.connPool1(query, [tableName.passwordModify, params.password, params.email], function (err, rs) {
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

