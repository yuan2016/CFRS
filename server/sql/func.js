let mysql = require('mysql')
let db = require('../config/db')
let pool1 = mysql.createPool(db.report)
let pool2 = mysql.createPool(db.xianjinkd)
const timeout = 20000

module.exports = {
  connPool1 (sql, val, cb, to = timeout) {
    pool1.getConnection((err, conn) => {
      if (err) {
        console.log('DB-获取数据库连接异常！')
        console.log(err.message)
      }
      let q = conn.query({sql: sql, timeout: to, values: val}, (err, rows) => {
        if (err) {
          console.log('DB-执行查询语句异常！')
          console.log(err.message)
        }
        cb(err, rows)
        // 返回连接池
        conn.release(function (err) {
          if (err) {
            console.log('DB-关闭数据库连接异常！')
            console.log(err.message)
          }
        })
      })
    })
  },
  connPool2 (sql, val, cb, to = timeout) {
    pool2.getConnection((err, conn) => {
      if (err) {
        console.log('DB-获取数据库连接异常！')
        console.log(err.message)
      }
      let q = conn.query({sql: sql, timeout: to, values: val}, (err, rows) => {
        if (err) {
          console.log('DB-执行查询语句异常！')
          console.log(err.message)
        }
        cb(err, rows)
        // 返回连接池
        conn.release(function (err) {
          if (err) {
            console.log('DB-关闭数据库连接异常！')
            console.log(err.message)
          }
        })
      })
    })
  },

  // json格式
  // writeJson (res, code = 200, msg = 'ok', data = null) {
  //   let obj = {code, msg, data}
  //
  //   if (!data) {
  //     delete obj.data
  //   }
  //   res.send(obj)
  // }
}
