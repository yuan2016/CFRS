let sql = require('../../sql/sqlMap')
let func = require('../../sql/func')
let moment = require('moment')
let express = require('express')
let tableName = require('../../config/tableName')
let jwt = require('jwt-simple')
let redis = require('redis')
let db = require('../../config/db')
let notp = require('notp')
let request = require('request')
let jsonXml = require('../../utils/json_xml')
let sms = require('../../config/sms')
let {getNowFormatDate} = require('../../utils/utils')
let md5 = require('js-md5')
let svgCaptcha = require('svg-captcha')

let app = express()
app.use(jsonXml.middleware)
app.set('jwtTokenSecret', 'tokenContent')

let expires = moment().add(7, 'days').calendar().valueOf()

//存储redis
function saveToRedis (key, value, s = 43200) {
  let client = redis.createClient(db.redisProp.port, db.redisProp.host)
  client.set(key, value, 'EX', s, function (error, res) {
    if (error) {
      console.log('redis error:' + error)
      return false
    }
    //操作完成，关闭redis连接
    client.quit()
  })
}

//向第三方发送请求
function sendCodeInfo (phoneNumber, code, response) {
  //组装请求
  let timeStamp = getNowFormatDate()
  let lastTimeKey = phoneNumber + '-lastTime'
  let content = '【灿福集团】尊敬的用户，本次验证码为' + code + '请勿泄露，5分钟内有效！'
  let batchNum = sms.nonce_str + timeStamp
  let missionNum = 'CFRStest'
  let sign = md5('app_key=' + sms.app_key + '&batch_num=' + batchNum + '&content=' + content + '&dest_id=' + phoneNumber + '&mission_num=' + missionNum + '&nonce_str=' + sms.nonce_str + '&sms_type=' + sms.sms_type + '&time_stamp=' + timeStamp + '&app_secret=' + sms.app_secret)
  let xmlStr = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<xml>' +
    '<head>' +
    '<app_key>' + sms.app_key + '</app_key>' +
    '<time_stamp>' + timeStamp + '</time_stamp>' +
    '<nonce_str>' + sms.nonce_str + '</nonce_str>' +
    '<sign>' + sign + '</sign>' +
    '</head>' +
    '<body>' +
    '<dests>' +
    '<dest>' +
    '<mission_num>' + missionNum + '</mission_num>' +
    '<dest_id>' + phoneNumber + '</dest_id>' +
    '</dest>' +
    '</dests>' +
    '<batch_num>' + batchNum + '</batch_num>' +
    '<sms_type>' + sms.sms_type + '</sms_type>' +
    '<content>' + content + '</content>' +
    '</body>' +
    '</xml>'
  //发送请求
  request.post({
    url: sms.sms_send_url,
    body: xmlStr,
    headers: {'Content-Type': 'text/xml'}
  }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
      let errorCode = jsonXml.xml2json(body).xml.head.error_code
      let errorMsg = jsonXml.xml2json(body).xml.head.error_msg
      if (errorCode === '000000') {
        saveToRedis(lastTimeKey, 1, 60)
        response.json({
          code: 0
        })
      } else if (errorCode === '100008') {
        console.log(errorMsg + '号码为:' + phoneNumber)
        response.json({
          code: 100008,
          msg: errorMsg
        })
      } else if (errorCode === '200008') {
        console.log(errorMsg + '号码为:' + phoneNumber)
        response.json({
          code: 200008,
          msg: errorMsg
        })
      } else {
        response.json({
          code: 4000
        })
      }
    } else {
      response.json({
        code: 4000
      })
    }
  })
}

function generateToken (rs, phoneNumber) {
  let payload = {
    name: rs[0].user_name,
    phoneNumber: phoneNumber,
    date: new Date().getTime()
  }
  let secret = 'CFRSTokenRule'
  let token = jwt.encode(payload, secret)
  saveToRedis(phoneNumber + 'token', token)
  return token
}

function judgment2 (rs, password, email) {
  let result
  if (rs.length !== 0) {
    let realPwd = rs[0].user_password
    if (realPwd === password) {
      let payload = {
        name: rs[0].user_name,
        email: email,
        availableTable: rs[0].available_table,
        date: new Date().getTime()
      }
      let secret = 'CFRSTokenRule'
      let token = jwt.encode(payload, secret)
      result = token
      saveToRedis(email, token)
    } else {
      result = 300
    }
  } else {
    result = 400
  }
  return result
}

module.exports = {
  //登录验证
  login (req, response) {
    let params = req.body
    let phoneNumber = params.phoneNumber
    let codeId = params.codeId
    let picCode = params.picCode
    let messageCode = params.messageCode
    let query = sql.login.select
    func.connPool1(query, [tableName.login, params.phoneNumber], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
        response.json({
          code: 1020
        })
      } else {
        if (rs.length < 1) {
          response.json({
            code: 1021
          })
        } else if (rs.length > 1) {
          response.json({
            code: 1022
          })
        } else {
          let client = redis.createClient(db.redisProp.port, db.redisProp.host)

          //这里是个异步操作
          client.get(codeId, function (error, res) {
            if (error) {
              console.log(error)
              client.quit()
              response.json({
                code: 2000
              })
            } else {
              client.quit()
              if (!res) {
                response.json({
                  code: 3001
                })
                return
              }
              if (res.toLowerCase() !== picCode.toLowerCase()) {
                //验证码错误
                response.json({
                  code: 3000
                })
              } else {
                let client1 = redis.createClient(db.redisProp.port, db.redisProp.host)
                client1.get(phoneNumber, function (error, re) {
                  if (error) {
                    console.log(error)
                    client1.quit()
                    response.json({
                      code: 2000
                    })
                  } else {
                    client1.quit()
                    if (!re) {
                      response.json({
                        code: 4001
                      })
                      return
                    }
                    if (re !== messageCode) {
                      response.json({
                        code: 4000
                      })
                    } else {
                      let result = generateToken(rs, phoneNumber)
                      response.json({token: result, name: rs[0].user_name})
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  //短信验证码处理
  getVerificationCode (req, response) {
    let params = req.body
    let phoneNumber = params.phoneNumber
    let lastTimeKey = phoneNumber + '-lastTime'

    let client = redis.createClient(db.redisProp.port, db.redisProp.host)

    //这里是个异步操作
    client.get(phoneNumber, function (error, res) {
      if (error) {
        console.log(error)
        client.quit()
        response.json({
          code: 2000
        })
        return false
      }
      //操作完成，关闭redis连接
      client.quit()
      let client1 = redis.createClient(db.redisProp.port, db.redisProp.host)
      client1.get(lastTimeKey, function (error, result) {
        if (error) {
          console.log(error)
          client1.quit()
          response.json({
            code: 2000
          })
          return false
        }
        if (res && result) {
          client1.quit()
          response.json({
            code: 4002
          })
        } else {
          client1.quit()
          let code = notp.totp.gen(new Date().getTime().toString(), phoneNumber)
          saveToRedis(phoneNumber, code, 300)
          sendCodeInfo(phoneNumber, code, response)
        }
      })
    })
  },
  //图形验证码
  getPicCode (req, res) {
    let codeId = req.query.codeId
    svgCaptcha.options.width = 130
    svgCaptcha.options.height = 35
    svgCaptcha.options.fontSize = 35
    let captcha = svgCaptcha.create()
    saveToRedis(codeId, captcha.text, 300)

    res.type('svg')
    res.status(200).send(captcha.data)
  },
  getRoles (req, res) {
    let params = req.body
    let query = sql.login.select
    func.connPool1(query, [tableName.login, params.email], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      res.json(rs)
    })
  },
  loginEmail (req, res) {
    let params = req.body
    let query = sql.login.select2
    func.connPool1(query, [tableName.login, params.email], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      let result = judgment2(rs, params.password, params.email)
      let final
      if (result === 300 || result === 400) {
        final = result
      } else {
        final = {token: result, name: rs[0].user_name, availableTable: rs[0].available_table}
      }
      res.json(final)
    })
  },
  updateColors(req, res) {
    let params = req.body
    let colors = []
    colors.push(params.colors.backgroundColor)
    colors.push(params.colors.textColor)
    colors.push(params.colors.activeColor)
    let query = sql.login.updateColor
    func.connPool1(query, [tableName.login, colors.join('|||'), params.phone], function (err, rs) {
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
  },
  getColors(req, res) {
    let params = req.body
    let phone = params.phone
    let query = sql.login.getColors
    func.connPool1(query, [tableName.login, phone], function (err, rs) {
      if (err) {
        console.log('[query] - :' + err)
      }
      res.json(rs)
    })
  }
}
/**
 * Created by Administrator on 2017/7/10.
 */
