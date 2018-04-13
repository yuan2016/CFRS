let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let fs = require('fs')
let path = require('path')
let {exportJsonToExcel} = require('../../../../utils/excel')

const tHeader = [['', '', 'PV', 'UV', '注册数', '新用户充值人数', '新用户充值金额(元)', '老用户充值人数', '老用户充值金额(元)', '竞拍出价总次数', '参与竞拍人数', '新用户充值成本(元)', '总用户充值成本(元)', '单位毛利(元)', '总毛利(元)', 'PV', 'UV', '注册数', '新用户充值人数', '新用户充值金额(元)', '老用户充值人数', '老用户充值金额(元)', '竞拍出价总次数', '参与竞拍人数', '新用户充值成本(元)', '总用户充值成本(元)', '单位毛利(元)', '总毛利(元)', ''], ['日期', '渠道名称', '渠道日环比数据', '更新时间']]
const filterVal = ['d_date', 'channel_name', 'channel_pv', 'channel_uv', 'registration_num', 'nusercharge_num', 'nusercharge_amt', 'ousercharge_num', 'ousercharge_amt', 'bid_cnt', 'bidperson_cnt', 'nuser_recharge_cost', 'auser_recharge_cost', 'Unit_Maori', 'total_maori', 'channel_pv_ratio', 'channel_uv_ratio', 'registration_num_ratio', 'nusercharge_num_ratio', 'nusercharge_amt_ratio', 'ousercharge_num_ratio', 'ousercharge_amt_ratio', 'bid_cnt_ratio', 'bidperson_cnt_ratio', 'nuser_recharge_cost_ratio', 'auser_recharge_cost_ratio', 'Unit_Maori_ratio', 'total_maori_ratio', 'update_time']
const merge = [[0, 0, 0, 1], [1, 0, 1, 1], [2, 0, 14, 0], [15, 0, 27, 0], [28, 0, 28, 1]]

const change = [['A1', '日期'], ['B1', '               渠道名称'], ['C1', '               渠道日数据'], ['P1', '渠道日环比数据'], ['AC1', '更新时间']]

function formatData (rows) {
  return rows.map(row => {
    if (row.d_date) {
      row.d_date = moment(row.d_date).format('YYYY-MM-DD')
    }
    if (row.update_time) {
      row.update_time = moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.nusercharge_amt) {
      row.nusercharge_amt = formatCurrency(row.nusercharge_amt)
    }
    if (row.ousercharge_amt) {
      row.ousercharge_amt = formatCurrency(row.ousercharge_amt)
    }
    if (row.nuser_recharge_cost) {
      row.nuser_recharge_cost = formatCurrency(row.nuser_recharge_cost)
    }
    if (row.auser_recharge_cost) {
      row.auser_recharge_cost = formatCurrency(row.auser_recharge_cost)
    }
    if (row.Unit_Maori) {
      row.Unit_Maori = formatCurrency(row.Unit_Maori)
    }
    if (row.total_maori) {
      row.total_maori = formatCurrency(row.total_maori)
    }
    if (row.channel_pv) {
      row.channel_pv = formatInt(row.channel_pv)
    }
    if (row.channel_uv) {
      row.channel_uv = formatInt(row.channel_uv)
    }
    if (row.registration_num) {
      row.registration_num = formatInt(row.registration_num)
    }
    if (row.nusercharge_num) {
      row.nusercharge_num = formatInt(row.nusercharge_num)
    }
    if (row.ousercharge_num) {
      row.ousercharge_num = formatInt(row.ousercharge_num)
    }
    if (row.bid_cnt) {
      row.bid_cnt = formatInt(row.bid_cnt)
    }
    if (row.bidperson_cnt) {
      row.bidperson_cnt = formatInt(row.bidperson_cnt)
    }

    if (row.channel_pv_ratio) {
      row.channel_pv_ratio = (row.channel_pv_ratio * 100).toFixed(2) + '%'
    }
    if (row.channel_uv_ratio) {
      row.channel_uv_ratio = (row.channel_uv_ratio * 100).toFixed(2) + '%'
    }
    if (row.registration_num_ratio) {
      row.registration_num_ratio = (row.registration_num_ratio * 100).toFixed(2) + '%'
    }
    if (row.nusercharge_num_ratio) {
      row.nusercharge_num_ratio = (row.nusercharge_num_ratio * 100).toFixed(2) + '%'
    }
    if (row.nusercharge_amt_ratio) {
      row.nusercharge_amt_ratio = (row.nusercharge_amt_ratio * 100).toFixed(2) + '%'
    }
    if (row.ousercharge_num_ratio) {
      row.ousercharge_num_ratio = (row.ousercharge_num_ratio * 100).toFixed(2) + '%'
    }
    if (row.ousercharge_amt_ratio) {
      row.ousercharge_amt_ratio = (row.ousercharge_amt_ratio * 100).toFixed(2) + '%'
    }
    if (row.bid_cnt_ratio) {
      row.bid_cnt_ratio = (row.bid_cnt_ratio * 100).toFixed(2) + '%'
    }
    if (row.bidperson_cnt_ratio) {
      row.bidperson_cnt_ratio = (row.bidperson_cnt_ratio * 100).toFixed(2) + '%'
    }
    if (row.nuser_recharge_cost_ratio) {
      row.nuser_recharge_cost_ratio = (row.nuser_recharge_cost_ratio * 100).toFixed(2) + '%'
    }
    if (row.auser_recharge_cost_ratio) {
      row.auser_recharge_cost_ratio = (row.auser_recharge_cost_ratio * 100).toFixed(2) + '%'
    }
    if (row.Unit_Maori_ratio) {
      row.Unit_Maori_ratio = (row.Unit_Maori_ratio * 100).toFixed(2) + '%'
    }
    if (row.total_maori_ratio) {
      row.total_maori_ratio = (row.total_maori_ratio * 100).toFixed(2) + '%'
    }
    return row
  })
}

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

module.exports = {
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.auction.market.channelDODData.order
    let query = sql.auction.market.channelDODData.selectAll + queries + order + sql.auction.market.channelDODData.selectAllBack
    func.connPool1(query, [tableName.channelDODData, params.offset, params.limit], function (err, rs) {
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
      rs = formatData(rs)
      res.json(rs)
    })
  },
  getCount (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.auction.market.channelDODData.getCount + queries
    func.connPool1(query, [tableName.channelDODData], function (err, rs) {
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
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.auction.market.channelDODData.selectAll + queries
    func.connPool1(query, [tableName.channelDODData], function (err, rs) {
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
      rs = formatData(rs)
      const data = formatJson(filterVal, rs)
      let fileName = mosaicName()
      try {
        exportJsonToExcel(tHeader, data, fileName, merge, change)
      } catch (e) {
        console.log(e)
        res.sendFile(path.join(process.cwd(), 'error.html'))
        return
      }

      let currFilePath = path.join(process.cwd(), fileName)
      let options = {
        headers: {
          'Content-Disposition': 'attachment; filename=' + fileName
        }
      }
      res.sendFile(currFilePath, options, function () {
        if (err) {
          console.log(err)
          res.sendFile(path.join(process.cwd(), 'error.html'))
          return
        } else {
          console.log('Sent:', fileName)
          fs.unlink(currFilePath, function (err) {
            if (err) console.log(err)
            console.log('文件删除成功')
          })
        }
      })
    }, 180000)
  }
}
