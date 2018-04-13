/**
 * Created by Administrator on 2017/7/11.
 */

function add (m) {
  return m < 10 ? '0' + m : m
}

function getYesterday (e, n) {
  let seperator = '-'
  let day = new Date(e)
  day.setTime(day.getTime() + n * 24 * 60 * 60 * 1000)
  let month = day.getMonth() + 1
  let strDate = day.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return day.getFullYear() + seperator + month + seperator + strDate
}

function handleTime (p, s, e, m) {
  let str,
    today,
    f = e
  if (m) {
    today = getYesterday(new Date(), 0)
    f = getYesterday(e, 1)
  }
  if (!s && !e) {
    return ''
  } else if (!s && e) {
    if (today && today === e) {
      return ''
    }
    str = '(' + p + '<="' + f + '")'
  } else if (s && !e) {
    str = '(' + p + '>="' + s + '")'
  } else {
    str = '(' + p + '>="' + s + '" and ' + p + '<="' + f + '")'
  }
  return str
}

function handleProperty (params, con) {
  let str = ''
  let arr = Object.values(params).filter(function (n) {
    return n
  })
  let len = arr.length
  if (len > 0) {
    if (con === 'or') {
      str = arr.slice(0, len).join(' or ')
    } else {
      str = arr.slice(0, len).join(' and ')
    }
  } else {
    str = ''
  }
  return str
}

function addZero (value) {
  if (value >= 0 && value <= 9) {
    value = '0' + value
  }
  return value
}

function concatQuery(p, q, c) {
  if (c === 'like') {
    return '(' + p + ' ' + c +' "%' + q + '%")'
  } else {
    return '(' + p + ' ' + c +' "' + q + '")'
  }
}

exports.analysis = function (params, date, con, table) {
  let optionsArr = Object.entries(params),
    queries = [],
    speArr = ['limit','offset','order'],
    startTime, endTime, msec
  let timeIndex = new Set()
  let timeArr = [[],[],[],[],[]]
  for (let param in optionsArr) {
    let query,
      p = optionsArr[param][0],
      q = optionsArr[param][1]
    if (speArr.indexOf(p) > -1) { continue }    //排除特定字段 需在最前面
    if (!Array.isArray(q)) { //excel导出方法中的值都是字符串
      q = q.replace(/\"/g,'').split(',')
    }
    if (table) { p = table + '.' + p }
    if (q[2] && q[2] === 'NONE') {
      continue
    }
    if (q[0] && q[0].length > 0) {
      if (q[1] === 'INPUT') {
        if (!q[2]) {
          query = concatQuery(p, q[0], 'like')
        } else if (q[2] === 'E') {
          query = concatQuery(p, q[0], '=')
        }
      } else if (q[1] === 'SELECT') {
        if (Array.isArray(q[0])) {         //多选为数组类型
          let queryArr = []
          for (let item of q[0]) {
            queryArr.push(concatQuery(p, item, '='))
          }
          query = '(' + queryArr.join(' or ') + ')'
        } else {                           //单选为字符串类型
          query = concatQuery(p, q[0], '=')
        }
      } else if (q[1] === 'DATE') {
        if (date) {
          if (!Array.isArray(date)) {        //字符串格式 单个日期
            if (p.indexOf('startTime') > -1) {
              startTime = q[0]
              continue
            } else if (p.indexOf('endTime') > -1) {
              endTime = q[0]
              if (q[2] && q[2] === 'M') { msec = true } //时间精确到毫秒
              continue
            }
          } else if (Array.isArray(date)) {     //数组形式 单个日期或多个日期
            let num = p.slice(p.length - 1)
            timeIndex.add(num)
            let i = Array.from(timeIndex).indexOf(num)
            if (p.indexOf('startTime') > -1) {
              timeArr[i].push({startTime: q})
              continue
            } else if (p.indexOf('endTime') > -1) {
              timeArr[i].push({endTime: q})
              if (q[2] && q[2] === 'M') { msec = true }
              continue
            }
          } else if (q[2] && q[2].indexOf('S') === 0) { //单个特殊日期 奇数是开始时间，偶数是结束时间 例:S1 S2
            let num = Number(q[2].slice(1)) % 2
            if (num === 1) {
              query = concatQuery(p, q[0], '>=')
            } else if (num === 0) {
              query = concatQuery(p, getYesterday(q[0], 1), '<')
            }
          }
        } else if (q[2] && q[2].indexOf('E') === 0) { //选择日期
          query = concatQuery(p, q[0], '=')
        }
      } else if (q[1] === 'MONTH') {
        let month = parseInt(q[0].slice(5, 7))
        if (p === 'startTime') {
          query = '(' + date + '>=' + month + ')'
        } else {
          query = '(' + date + '<=' + month + ')'
        }
      } else if (q[1] === 'RADIO') {
        query = concatQuery(p, q[0], '=')
      } else if (q[1] === 'CHECKBOX') {
        let queryArr = []
        for (let item of q[0]) {
          queryArr.push(concatQuery(p, item, '='))
        }
        query = '(' + queryArr.join(' or ') + ')'
      }
    }
    queries.push(query)
  }
  if (date && !Array.isArray(date)) {
    let dTime = handleTime(date, startTime, endTime, msec)
    if (dTime) {
      queries.push(dTime)
    }
  } else {
    let dateNew = []
    for (let item of timeIndex) {
      dateNew.push(date[item-1])
    }
    for (let i in dateNew) {
      let start = ''
      let end = ''
      if (timeArr[i][0].startTime) {
        start = timeArr[i][0].startTime || ''
      }
      if (!start) {
        if (timeArr[i][0].length === 1) {
          end= timeArr[i][0].endTime || ''
        }
      } else {
        if (timeArr[i].length ===2) {
          end= timeArr[i][1].endTime || ''
        }
      }
      let dTime = handleTime(dateNew[i], start, end, msec)
      if (dTime) {
        queries.push(dTime)
      }
    }
  }
  queries = handleProperty(queries)
  if (queries) {
    if (con === 'w') {
      queries = ' where ' + queries
    } else if (con === 'a') {
      queries = ' and ' + queries
    }
  }
  return queries
}

exports.mosaic = function (params, key, table, value) {
  let add,
    keyN = key
  if (table) {
    keyN = table + '.' + keyN
  }
  let arr = params[key]
  if (arr && !Array.isArray(arr)) { //excel导出方法中的值都是字符串
    arr = arr.replace(/\"/g,'').split(',')
  }
  if (value) {
    if (arr && arr[0]) {
      if (arr[0] === value) {
        add = '(' + keyN + ' = "' + value + '")'
      } else {
        add = '(' + keyN + ' <> "' + value + '")'
      }
    } else {
      add = '(' + keyN + ' IS NULL OR ' + keyN + ' LIKE "%%")'
    }
  } else {
    if (arr) {
      if (!arr[0]) {
        add = '(' + keyN + ' IS NULL OR ' + keyN + ' LIKE "%%")'
      } else {
          if (arr[1] && arr[1] === 'INPUT' && !arr[2]) {
            add = '(' + keyN + ' LIKE "%' + arr[0] + '%")'
          } else {
            add = '(' + keyN + ' = "' + arr[0] + '")'
          }
      }
    }
  }
  return add
}

exports.formatCurrency = function (s, n) {
  n = n > 0 && n <= 20 ? n : 2
  let k = false
  if (parseFloat(s) < 0) {
    k = true
  }
  s = parseFloat((Math.abs(s) + '').replace(/[^\d\.-]/g, '')) + ''
  let l = s.split('.')[0].split('').reverse()
  let r = s.split('.')[1]
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '')
  }
  if (!r) {
    r = '0'
  }
  if (r.length < n) {
    for (var i = r.length; i < n; i++) {
      r += '0'
    }
  } else {
    r = r.substr(0, n)
  }
  let result = t.split('').reverse().join('') + '.' + r
  if (k) {
    result = '-' + result
  }
  return result
}

exports.formatInt = function (s) {
  let result = []
  let counter = 0
  s = (s || 0).toString().split('')
  for (let i = s.length - 1; i >= 0; i--) {
    counter++
    result.unshift(s[i])
    if (!(counter % 3) && i !== 0) { result.unshift(',') }
  }
  return result.join('')
}

exports.mosaicName = function () {
  let time = new Date()
  let y = time.getFullYear()
  let m = time.getMonth() + 1
  let d = time.getDate()
  let h = time.getHours()
  let mm = time.getMinutes()
  let s = time.getSeconds()

  return y + add(m) + add(d) + add(h) + add(mm) + add(s) + '.xlsx'
}

exports.getNowFormatDate = function () {
  let date = new Date()
  let seperator = '-'
  let month = date.getMonth() + 1
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }

  let current = date.getFullYear() + seperator + month + seperator + addZero(date.getDate()) + seperator + addZero(date.getHours()) + seperator + addZero(date.getMinutes()) + seperator + addZero(date.getSeconds())
  return current.split('-').join('')
}

