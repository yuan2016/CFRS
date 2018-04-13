let XLSX = require('xlsx')

function datenum (v, date1904) {
  if (date1904) v += 1462
  let epoch = Date.parse(v)
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}

function sheetFromArrayOfArrays (data, opts) {
  let ws = {}
  let range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}}
  for (let R = 0; R !== data.length; ++R) {
    for (let C = 0; C !== data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R
      if (range.s.c > C) range.s.c = C
      if (range.e.r < R) range.e.r = R
      if (range.e.c < C) range.e.c = C
      let cell = {v: data[R][C]}
      if (cell.v === null) continue
      let cellRef = XLSX.utils.encode_cell({c: C, r: R})

      if (typeof cell.v === 'number') {
        cell.t = 'n'
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b'
      } else if (cell.v instanceof Date) {
        cell.t = 'n'
        cell.z = XLSX.SSF._table[14]
        cell.v = datenum(cell.v)
      } else {
        cell.t = 's'
      }

      ws[cellRef] = cell
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range)
  return ws
}

function Workbook () {
  if (!(this instanceof Workbook)) return new Workbook()
  this.SheetNames = []
  this.Sheets = {}
}

function s2ab (s) {
  let buf = new ArrayBuffer(s.length)
  let view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

exports.exportJsonToExcel = function (th, jsonData, defaultTitle, merge, change) {
  let data = jsonData
  for (let i of th) {
    if (Array.isArray(i)) {
      data.unshift(i)
    } else {
      data.unshift(th)
      break
    }
  }

  let wsName = 'SheetJS'

  let wb = new Workbook()
  let ws = sheetFromArrayOfArrays(data)
  if (merge) {
    let configs = []
    // 获取合并过的单元格
    for (let i of merge) {
      configs.push({
        s: {c: i[0], r: i[1]}, e: {c: i[2], r: i[3]}
      })
    }
    ws['!merges'] = configs
  }

  if (change) {
    for (let i of change) {
      ws[i[0]] = {v: i[1]}
    }
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(wsName)
  wb.Sheets[wsName] = ws

  XLSX.writeFile(wb, defaultTitle)
}
