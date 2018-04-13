let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let moment = require('moment')
let tableName = require('../../../config/tableName')
let {analysis} = require('../../../utils/utils')

function formatData (rows) {
  return rows.map(row => {
    if (row.create_time) {
      row.create_time = moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    return row
  })
}

module.exports = {
  //用户实名认证数据
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'a')
    let order = params.order || ''
    let query = sql.userInformationManagement.userNameAuthenticationList.selectAllFront + queries + order + sql.userInformationManagement.userNameAuthenticationList.selectAllBack
    func.connPool2(query, [tableName.userNameAuthenticationList, params.offset, params.limit], function (err, rs) {
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
      rs = formatData(rs)
      res.json(rs)
    })
  },
  //用户实名认证总条数
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, null, 'a')
    let query = sql.userInformationManagement.userNameAuthenticationList.getCount + queries
    func.connPool2(query, tableName.userNameAuthenticationList, function (err, rs) {
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
  }
}
/**
 * Created by Administrator on 2017/7/10.
 */
