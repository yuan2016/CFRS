let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, formatInt, analysis, mosaicName} = require('../../../../utils/utils')
let {exportJsonToExcel} = require('../../../../utils/excel')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let path = require('path')
let fs = require('fs')

const tHeader = [['', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', ''], ['日期', '当前借款总数量', '', '', '当前借款总额(元)', '', '',  '已经还款总数量', '', '',  '已经还款总额(元)', '', '',  '逾期中数量', '', '',  '逾期中总额(元)', '', '',  '逾期十天以上总金额(元)', '', '',  'S1级逾期率(按金额)', '', '',  'S2级逾期率(按金额)', '', '',  'S3级逾期率(按金额)', '', '',  'M3级逾期率(按金额)', '', '',  'S1级逾期率(按单数)', '', '',  'S2级逾期率(按单数)', '', '',  'S3级逾期率(按单数)', '', '',  'M3级逾期率(按单数)', '', '', '更新时间']]
const filterVal = ['d_date', 'loan_amount_total_z', 'loan_amount_total_x', 'loan_amount_total', 'loan_money_total_z', 'loan_money_total_x', 'loan_money_total', 'repayment_amount_total_z', 'repayment_amount_total_x', 'repayment_amount_total', 'repayment_money_total_z', 'repayment_money_total_x', 'repayment_money_total', 'quantity_overdue_z', 'quantity_overdue_x', 'quantity_overdue', 'total_overdue_z', 'total_overdue_x', 'total_overdue', 'overdue_money_10d_z', 'overdue_money_10d_z', 'overdue_money_10d', 'overdue_money_10d_14_z', 'overdue_money_10d_14_z', 'overdue_money_10d_14', 'M_overdue_rate_s1_z', 'M_overdue_rate_s1_x', 'M_overdue_rate_s1', 'M_overdue_rate_s2_z', 'M_overdue_rate_s2_x', 'M_overdue_rate_s2_z', 'M_overdue_rate_s3_z', 'M_overdue_rate_s3_x', 'M_overdue_rate_s3', 'M_overdue_rate_m3_z', 'M_overdue_rate_m3_x', 'M_overdue_rate_m3_z', 'N_overdue_rate_s1_z', 'N_overdue_rate_s1_x', 'N_overdue_rate_s1', 'N_overdue_rate_s2_z', 'N_overdue_rate_s2_x', 'N_overdue_rate_s2', 'N_overdue_rate_s3_z', 'N_overdue_rate_s3_x', 'N_overdue_rate_s3', 'N_overdue_rate_m3_z', 'N_overdue_rate_m3_x', 'N_overdue_rate_m3', 'create_time']
//横坐标纵坐标
const merge = [[0, 0, 0, 1], [1, 0, 3, 0], [4, 0, 6, 0], [7, 0, 9, 0], [10, 0, 12, 0], [13, 0, 15, 0], [16, 0, 18, 0], [19, 0, 21, 0], [22, 0, 24, 0], [25, 0, 27, 0], [28, 0, 30, 0], [31, 0, 33, 0], [34, 0, 36, 0], [37, 0, 39, 0], [40, 0, 42, 0], [43, 0, 45, 0], [46, 0, 48, 0], [49, 0, 49, 0]]
const change = [['A1', '    日期'], ['B1', '  当前借款总数量'], ['E1', '  当前借款总额(元)'], ['H1', '  已经还款总数量'], ['K1', ' 已经还款总额(元)'], ['N1', ' 逾期中数量'], ['Q1', ' 逾期中总额(元)'], ['T1', ' 逾期十天以上总金额(元)'], ['W1', ' S1级逾期率(按金额)'], ['Z1', ' S2级逾期率(按金额)'], ['AC1', ' S3级逾期率(按金额)'], ['AF1', ' M3级逾期率(按金额)'], ['AI1', 'S1级逾期率(按单数)'], ['AL1', ' S2级逾期率(按单数)'], ['AO1', ' S3级逾期率(按单数)'], ['AR1', ' M3级逾期率(按单数)'], ['AU1', ' 更新时间']]

global.periodOverdueRepaymentStatisticsCount = 0

function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

function formatData(rows) {
  return rows.map(row => {
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD')
    }
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    // money
    if (row.COLLECTION_PRINCIPAL_DAY_Z) {
      row.COLLECTION_PRINCIPAL_DAY_Z = formatCurrency(row.COLLECTION_PRINCIPAL_DAY_Z)
    }
    if (row.COLLECTION_PRINCIPAL_DAY_X) {
      row.COLLECTION_PRINCIPAL_DAY_X = formatCurrency(row.COLLECTION_PRINCIPAL_DAY_X)
    }
    if (row.COLLECTION_PRINCIPAL_DAY) {
      row.COLLECTION_PRINCIPAL_DAY = formatCurrency(row.COLLECTION_PRINCIPAL_DAY)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_Z) {
      row.COLLECTION_PRINCIPAL_DOING_Z = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_Z)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_X) {
      row.COLLECTION_PRINCIPAL_DOING_X = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_X)
    }
    if (row.COLLECTION_PRINCIPAL_DOING) {
      row.COLLECTION_PRINCIPAL_DOING = formatCurrency(row.COLLECTION_PRINCIPAL_DOING)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_S1_Z) {
      row.COLLECTION_PRINCIPAL_DOING_S1_Z = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_S1_Z)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_S1_X) {
      row.COLLECTION_PRINCIPAL_DOING_S1_X = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_S1_X)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_S1) {
      row.COLLECTION_PRINCIPAL_DOING_S1 = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_S1)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_S2_Z) {
      row.COLLECTION_PRINCIPAL_DOING_S2_Z = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_S2_Z)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_S2_X) {
      row.COLLECTION_PRINCIPAL_DOING_S2_X = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_S2_X)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_S2) {
      row.COLLECTION_PRINCIPAL_DOING_S2 = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_S2)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M2_Z) {
      row.COLLECTION_PRINCIPAL_DOING_M2_Z = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M2_Z)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M2_X) {
      row.COLLECTION_PRINCIPAL_DOING_M2_X = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M2_X)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M2) {
      row.COLLECTION_PRINCIPAL_DOING_M2 = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M2)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M3_Z) {
      row.COLLECTION_PRINCIPAL_DOING_M3_Z = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M3_Z)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M3_X) {
      row.COLLECTION_PRINCIPAL_DOING_M3_X = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M3_X)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M3) {
      row.COLLECTION_PRINCIPAL_DOING_M3 = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M3)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M3PLUS_Z) {
      row.COLLECTION_PRINCIPAL_DOING_M3PLUS_Z = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M3PLUS_Z)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M3PLUS_X) {
      row.COLLECTION_PRINCIPAL_DOING_M3PLUS_X = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M3PLUS_X)
    }
    if (row.COLLECTION_PRINCIPAL_DOING_M3PLUS) {
      row.COLLECTION_PRINCIPAL_DOING_M3PLUS = formatCurrency(row.COLLECTION_PRINCIPAL_DOING_M3PLUS)
    }
    if (row.COLLECTION_LATE_FEE_DOING_Z) {
      row.COLLECTION_LATE_FEE_DOING_Z = formatCurrency(row.COLLECTION_LATE_FEE_DOING_Z)
    }
    if (row.COLLECTION_LATE_FEE_DOING_X) {
      row.COLLECTION_LATE_FEE_DOING_X = formatCurrency(row.COLLECTION_LATE_FEE_DOING_X)
    }
    if (row.COLLECTION_LATE_FEE_DOING) {
      row.COLLECTION_LATE_FEE_DOING = formatCurrency(row.COLLECTION_LATE_FEE_DOING)
    }
    if (row.COLLECTION_LATE_FEE_DOING_S1_Z) {
      row.COLLECTION_LATE_FEE_DOING_S1_Z = formatCurrency(row.COLLECTION_LATE_FEE_DOING_S1_Z)
    }
    if (row.COLLECTION_LATE_FEE_DOING_S1_X) {
      row.COLLECTION_LATE_FEE_DOING_S1_X = formatCurrency(row.COLLECTION_LATE_FEE_DOING_S1_X)
    }
    if (row.COLLECTION_LATE_FEE_DOING_S1) {
      row.COLLECTION_LATE_FEE_DOING_S1 = formatCurrency(row.COLLECTION_LATE_FEE_DOING_S1)
    }
    if (row.COLLECTION_LATE_FEE_DOING_S2_Z) {
      row.COLLECTION_LATE_FEE_DOING_S2_Z = formatCurrency(row.COLLECTION_LATE_FEE_DOING_S2_Z)
    }
    if (row.COLLECTION_LATE_FEE_DOING_S2_X) {
      row.COLLECTION_LATE_FEE_DOING_S2_X = formatCurrency(row.COLLECTION_LATE_FEE_DOING_S2_X)
    }
    if (row.COLLECTION_LATE_FEE_DOING_S2) {
      row.COLLECTION_LATE_FEE_DOING_S2 = formatCurrency(row.COLLECTION_LATE_FEE_DOING_S2)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M2_Z) {
      row.COLLECTION_LATE_FEE_DOING_M2_Z = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M2_Z)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M2_X) {
      row.COLLECTION_LATE_FEE_DOING_M2_X = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M2_X)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M2) {
      row.COLLECTION_LATE_FEE_DOING_M2 = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M2)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M3_Z) {
      row.COLLECTION_LATE_FEE_DOING_M3_Z = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M3_Z)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M3_X) {
      row.COLLECTION_LATE_FEE_DOING_M3_X = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M3_X)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M3) {
      row.COLLECTION_LATE_FEE_DOING_M3 = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M3)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M3PLUS_Z) {
      row.COLLECTION_LATE_FEE_DOING_M3PLUS_Z = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M3PLUS_Z)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M3PLUS_X) {
      row.COLLECTION_LATE_FEE_DOING_M3PLUS_X = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M3PLUS_X)
    }
    if (row.COLLECTION_LATE_FEE_DOING_M3PLUS) {
      row.COLLECTION_LATE_FEE_DOING_M3PLUS = formatCurrency(row.COLLECTION_LATE_FEE_DOING_M3PLUS)
    }
    //率
    if (row.OVERDUE_RATE_Z) {
      row.OVERDUE_RATE_Z = (row.OVERDUE_RATE_Z * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE_X) {
      row.OVERDUE_RATE_X = (row.OVERDUE_RATE_X * 100).toFixed(2) + '%'
    }
    if (row.OVERDUE_RATE) {
      row.OVERDUE_RATE = (row.OVERDUE_RATE * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_S1_Z) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_S1_Z = (row.COLLECTION_PRINCIPAL_DOING_RATE_S1_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_S1_X) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_S1_X = (row.COLLECTION_PRINCIPAL_DOING_RATE_S1_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_S1) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_S1 = (row.COLLECTION_PRINCIPAL_DOING_RATE_S1 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S1_Z) {
      row.COLLECTION_PRINCIPAL_RATE_S1_Z = (row.COLLECTION_PRINCIPAL_RATE_S1_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S1_X) {
      row.COLLECTION_PRINCIPAL_RATE_S1_X = (row.COLLECTION_PRINCIPAL_RATE_S1_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S1) {
      row.COLLECTION_PRINCIPAL_RATE_S1 = (row.COLLECTION_PRINCIPAL_RATE_S1 * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S1_Z) {
      row.CURRENT_COLLECTION_RATE_S1_Z = (row.CURRENT_COLLECTION_RATE_S1_Z * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S1_X) {
      row.CURRENT_COLLECTION_RATE_S1_X = (row.CURRENT_COLLECTION_RATE_S1_X * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S1) {
      row.CURRENT_COLLECTION_RATE_S1 = (row.CURRENT_COLLECTION_RATE_S1 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_S2_Z) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_S2_Z = (row.COLLECTION_PRINCIPAL_DOING_RATE_S2_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_S2_X) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_S2_X = (row.COLLECTION_PRINCIPAL_DOING_RATE_S2_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_S2) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_S2 = (row.COLLECTION_PRINCIPAL_DOING_RATE_S2 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S2_Z) {
      row.COLLECTION_PRINCIPAL_RATE_S2_Z = (row.COLLECTION_PRINCIPAL_RATE_S2_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S2_X) {
      row.COLLECTION_PRINCIPAL_RATE_S2_X = (row.COLLECTION_PRINCIPAL_RATE_S2_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S2) {
      row.COLLECTION_PRINCIPAL_RATE_S2 = (row.COLLECTION_PRINCIPAL_RATE_S2 * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S2_Z) {
      row.CURRENT_COLLECTION_RATE_S2_Z = (row.CURRENT_COLLECTION_RATE_S2_Z * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S2_X) {
      row.CURRENT_COLLECTION_RATE_S2_X = (row.CURRENT_COLLECTION_RATE_S2_X * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S2) {
      row.CURRENT_COLLECTION_RATE_S2 = (row.CURRENT_COLLECTION_RATE_S2 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M2_Z) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M2_Z = (row.COLLECTION_PRINCIPAL_DOING_RATE_M2_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M2_X) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M2_X = (row.COLLECTION_PRINCIPAL_DOING_RATE_M2_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M2) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M2 = (row.COLLECTION_PRINCIPAL_DOING_RATE_M2 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S3_Z) {
      row.COLLECTION_PRINCIPAL_RATE_S3_Z = (row.COLLECTION_PRINCIPAL_RATE_S3_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S3_X) {
      row.COLLECTION_PRINCIPAL_RATE_S3_X = (row.COLLECTION_PRINCIPAL_RATE_S3_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_S3) {
      row.COLLECTION_PRINCIPAL_RATE_S3 = (row.COLLECTION_PRINCIPAL_RATE_S3 * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S3_Z) {
      row.CURRENT_COLLECTION_RATE_S3_Z = (row.CURRENT_COLLECTION_RATE_S3_Z * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S3_X) {
      row.CURRENT_COLLECTION_RATE_S3_X = (row.CURRENT_COLLECTION_RATE_S3_X * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_S3) {
      row.CURRENT_COLLECTION_RATE_S3 = (row.CURRENT_COLLECTION_RATE_S3 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M3_Z) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M3_Z = (row.COLLECTION_PRINCIPAL_DOING_RATE_M3_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M3_X) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M3_X = (row.COLLECTION_PRINCIPAL_DOING_RATE_M3_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M3) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M3 = (row.COLLECTION_PRINCIPAL_DOING_RATE_M3 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_M3_Z) {
      row.COLLECTION_PRINCIPAL_RATE_M3_Z = (row.COLLECTION_PRINCIPAL_RATE_M3_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_M3_X) {
      row.COLLECTION_PRINCIPAL_RATE_M3_X = (row.COLLECTION_PRINCIPAL_RATE_M3_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_M3) {
      row.COLLECTION_PRINCIPAL_RATE_M3 = (row.COLLECTION_PRINCIPAL_RATE_M3 * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_M3_Z) {
      row.CURRENT_COLLECTION_RATE_M3_Z = (row.CURRENT_COLLECTION_RATE_M3_Z * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_M3_X) {
      row.CURRENT_COLLECTION_RATE_M3_X = (row.CURRENT_COLLECTION_RATE_M3_X * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_M3) {
      row.CURRENT_COLLECTION_RATE_M3 = (row.CURRENT_COLLECTION_RATE_M3 * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_Z) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_Z = (row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_X) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_X = (row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS) {
      row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS = (row.COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_M3PLUS_Z) {
      row.COLLECTION_PRINCIPAL_RATE_M3PLUS_Z = (row.COLLECTION_PRINCIPAL_RATE_M3PLUS_Z * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_M3PLUS_X) {
      row.COLLECTION_PRINCIPAL_RATE_M3PLUS_X = (row.COLLECTION_PRINCIPAL_RATE_M3PLUS_X * 100).toFixed(2) + '%'
    }
    if (row.COLLECTION_PRINCIPAL_RATE_M3PLUS) {
      row.COLLECTION_PRINCIPAL_RATE_M3PLUS = (row.COLLECTION_PRINCIPAL_RATE_M3PLUS * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_M3PLUS_Z) {
      row.CURRENT_COLLECTION_RATE_M3PLUS_Z = (row.CURRENT_COLLECTION_RATE_M3PLUS_Z * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_M3PLUS_X) {
      row.CURRENT_COLLECTION_RATE_M3PLUS_X = (row.CURRENT_COLLECTION_RATE_M3PLUS_X * 100).toFixed(2) + '%'
    }
    if (row.CURRENT_COLLECTION_RATE_M3PLUS) {
      row.CURRENT_COLLECTION_RATE_M3PLUS = (row.CURRENT_COLLECTION_RATE_M3PLUS * 100).toFixed(2) + '%'
    }
    return row
  })
}

module.exports = {
  //每日还款金额数据
  fetchAll(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.period.order
    let query = sql.period.selectAll + queries + order + sql.period.selectAllBack
    func.connPool1(query, [tableName.period.promptAmountData, params.offset, params.limit], function (err, rs) {
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
  //每日还款金额数据总条数
  getCount(req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.getCount + queries
    func.connPool1(query, [tableName.period.promptAmountData], function (err, rs) {
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
  refreshData(req, res) {
    if (global.periodOverdueRepaymentStatisticsCount === 0) {
      global.periodOverdueRepaymentStatisticsCount++
      pro.exec(shell.periodOverdueRepaymentStatistics, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期还款逾期记录shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.periodOverdueRepaymentStatisticsCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期还款逾期记录shell脚本执行成功')
          res.json({code: '200'})
          global.periodOverdueRepaymentStatisticsCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 开心分期还款逾期记录开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData(req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.period.selectAll + queries + sql.period.order
    func.connPool1(query, [tableName.period.promptAmountData], function (err, rs) {
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
          return false
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
