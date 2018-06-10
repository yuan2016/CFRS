let sql = require('../../../sql/sqlMap')
let func = require('../../../sql/func')
let tableName = require('../../../config/tableName')
let {analysis} = require('../../../utils/utils')

module.exports = {
  //员工信息
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, null, 'w')
    let query = sql.privilegeManage.employeeList.selectAllFront + queries + sql.privilegeManage.employeeList.selectAllBack
    func.connPool1(query, [tableName.privilegeManage.employeeList, params.offset, params.limit], function (err, rs) {
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
  //员工条数
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, null, 'w')
    let query = sql.privilegeManage.employeeList.getCount + queries
    func.connPool1(query, tableName.privilegeManage.employeeList, function (err, rs) {
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
  //权限变更
  privilegeModify(req, res) {
    let params = req.body
    let ruleForm = params.ruleForm
    let tables = params.tables
    let tables1 = params.tables1
    let tables2 = params.tables2
    let tables3 = params.tables3
    let names = []
    if (tables) {
      names.push('开心钱包')
    }
    if (tables1) {
      names.push('企鹅抓娃娃')
    }
    if (tables2) {
      names.push('闪电卡')
    }
    if (tables3) {
      names.push('开心分期')
    }
    let productNames = names.join('|')
    let permission = params.permission
    let query = sql.privilegeManage.employeeList.privilegeModify
    func.connPool1(query, [tableName.privilegeManage.employeeList, tables, tables1, tables3, productNames, ruleForm.user_name, ruleForm.user_sex, ruleForm.department, ruleForm.user_mobile, permission,ruleForm.add_ip,ruleForm.user_email], function (err, rs) {
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
      if (rs.affectedRows === 1) {
        res.json(200)
      } else {
        res.json(500)
      }
    })
  },
  add(req, res) {
    let params = req.body
    let userPassword = '27b1ba1299ec7bdbf14b7bf740e13e59'
    let phone = params.mobile
    func.connPool1(sql.privilegeManage.employeeList.selectByPhone, [tableName.privilegeManage.employeeList, params.mobile], function (err, rs) {
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
      if (rs.length !== 0) {
        res.json({
          code: '120'
        })
        return false
      } else {
        let tables = params.tables
        let tables1 = params.tables1
        let tables2 = params.tables2
        let tables3 = params.tables3
        let names = []
        if (tables) {
          names.push('开心钱包')
        }
        if (tables1) {
          names.push('企鹅抓娃娃')
        }
        if (tables2) {
          names.push('闪电卡')
        }
        if (tables3) {
          names.push('开心分期')
        }
        let productNames = names.join('|')
        func.connPool1(sql.privilegeManage.employeeList.add, [tableName.privilegeManage.employeeList, productNames, tables, tables1, tables3, params.department, userPassword, params.name, params.sex, params.mobile, params.email, params.permission, params.addIp], function (err, rs) {
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
          if (rs.affectedRows === 1) {
            res.json(200)
          } else {
            res.json(500)
          }
        })
      }
    })
  },
  delete(req, res) {
    let params = req.body
    func.connPool1(sql.privilegeManage.employeeList.delete, [tableName.privilegeManage.employeeList, params.email], function (err, rs) {
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
      if (rs.affectedRows === 1) {
        res.json(200)
      } else {
        res.json(500)
      }
    })
  },
  modifyMultiple(req, res) {
    let condition = ''
    let params = req.body
    let tables = params.tables
    let tables1 = params.tables1
    let tables2 = params.tables2
    let tables3 = params.tables3
    let phones = params.phones.split('|')
    let names = []
    if (tables) {
      names.push('开心钱包')
    }
    if (tables1) {
      names.push('企鹅抓娃娃')
    }
    if (tables2) {
      names.push('闪电卡')
    }
    if (tables3) {
      names.push('开心分期')
    }
    let productNames = names.join('|')
    for (let i of phones) {
      condition += i + ','
    }
    condition = '(' + condition.substr(0, condition.length - 1) + ')'
    let query = sql.privilegeManage.employeeList.modifyMultiple + condition
    func.connPool1(query, [tableName.privilegeManage.employeeList, productNames, tables, tables1, tables2, tables3,params.addIp], function (err, rs) {
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
      if (rs.affectedRows >= 1) {
        res.json(200)
      } else {
        res.json(500)
      }
    })
  }
}
