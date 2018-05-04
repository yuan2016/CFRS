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

const tHeader = [['', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', '招财猫', '新网', '合计', ''], ['日期', '当日催回率', '', '', '当日入催本金(元)', '', '',  '在催本金(元)', '', '',  'S1在催本金(元)', '', '',  'S1在催本金比例', '', '',  'S1总和催回率', '', '',  'S1当期催回率', '', '',  'S2在催本金(元)', '', '',  'S2在催本金比例', '', '',  'S2总和催回率', '', '',  'S2当期催回率', '', '',  'M2在催本金(元)', '', '',  'M2在催本金比例', '', '',  'M2总和催回率', '', '',  'M2当期催回率', '', '',  'M3在催本金(元)', '', '',  'M3在催本金比例', '', '',  'M3总和催回率', '', '',  'M3当期催回率', '', '',  'M3+在催本金(元)', '', '',  'M3+在催本金比例', '', '',  'M3+总和催回率', '', '',  'M3+当期催回率', '', '',  '在催滞纳金(元)', '', '',  'S1在催滞纳金(元)', '', '',  'S2在催滞纳金(元)', '', '',  'M3在催滞纳金(元)', '', '',  'M3+在催滞纳金(元)', '', '', '更新时间']]
const filterVal = ['D_DATE', 'OVERDUE_RATE_Z', 'OVERDUE_RATE_X', 'OVERDUE_RATE', 'COLLECTION_PRINCIPAL_DAY_Z', 'COLLECTION_PRINCIPAL_DAY_X', 'COLLECTION_PRINCIPAL_DAY', 'COLLECTION_PRINCIPAL_DOING_Z', 'COLLECTION_PRINCIPAL_DOING_X', 'COLLECTION_PRINCIPAL_DOING', 'COLLECTION_PRINCIPAL_DOING_S1_Z', 'COLLECTION_PRINCIPAL_DOING_S1_X', 'COLLECTION_PRINCIPAL_DOING_S1', 'COLLECTION_PRINCIPAL_DOING_RATE_S1_Z', 'COLLECTION_PRINCIPAL_DOING_RATE_S1_X', 'COLLECTION_PRINCIPAL_DOING_RATE_S1', 'COLLECTION_PRINCIPAL_RATE_S1_Z', 'COLLECTION_PRINCIPAL_RATE_S1_X', 'COLLECTION_PRINCIPAL_RATE_S1', 'CURRENT_COLLECTION_RATE_S1_Z', 'CURRENT_COLLECTION_RATE_S1_X', 'CURRENT_COLLECTION_RATE_S1', 'COLLECTION_PRINCIPAL_DOING_S2_Z', 'COLLECTION_PRINCIPAL_DOING_S2_X', 'COLLECTION_PRINCIPAL_DOING_S2', 'COLLECTION_PRINCIPAL_DOING_RATE_S2_Z', 'COLLECTION_PRINCIPAL_DOING_RATE_S2_X', 'COLLECTION_PRINCIPAL_DOING_RATE_S2', 'COLLECTION_PRINCIPAL_RATE_S2_Z', 'COLLECTION_PRINCIPAL_RATE_S2_X', 'COLLECTION_PRINCIPAL_RATE_S2', 'CURRENT_COLLECTION_RATE_S2_Z', 'CURRENT_COLLECTION_RATE_S2_X', 'CURRENT_COLLECTION_RATE_S2', 'COLLECTION_PRINCIPAL_DOING_M2_Z', 'COLLECTION_PRINCIPAL_DOING_M2_X', 'COLLECTION_PRINCIPAL_DOING_M2', 'COLLECTION_PRINCIPAL_DOING_RATE_M2_Z', 'COLLECTION_PRINCIPAL_DOING_RATE_M2_X', 'COLLECTION_PRINCIPAL_DOING_RATE_M2', 'COLLECTION_PRINCIPAL_RATE_S3_Z', 'COLLECTION_PRINCIPAL_RATE_S3_X', 'COLLECTION_PRINCIPAL_RATE_S3', 'CURRENT_COLLECTION_RATE_S3_Z', 'CURRENT_COLLECTION_RATE_S3_X', 'CURRENT_COLLECTION_RATE_S3', 'COLLECTION_PRINCIPAL_DOING_M3_Z', 'COLLECTION_PRINCIPAL_DOING_M3_X', 'COLLECTION_PRINCIPAL_DOING_M3', 'COLLECTION_PRINCIPAL_DOING_RATE_M3_Z', 'COLLECTION_PRINCIPAL_DOING_RATE_M3_X', 'COLLECTION_PRINCIPAL_DOING_RATE_M3', 'COLLECTION_PRINCIPAL_RATE_M3_Z', 'COLLECTION_PRINCIPAL_RATE_M3_X', 'COLLECTION_PRINCIPAL_RATE_M3', 'CURRENT_COLLECTION_RATE_M3_Z', 'CURRENT_COLLECTION_RATE_M3_X', 'CURRENT_COLLECTION_RATE_M3', 'COLLECTION_PRINCIPAL_DOING_M3PLUS_Z', 'COLLECTION_PRINCIPAL_DOING_M3PLUS_X', 'COLLECTION_PRINCIPAL_DOING_M3PLUS', 'COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_Z', 'COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS_X', 'COLLECTION_PRINCIPAL_DOING_RATE_M3PLUS', 'COLLECTION_PRINCIPAL_RATE_M3PLUS_Z', 'COLLECTION_PRINCIPAL_RATE_M3PLUS_X', 'COLLECTION_PRINCIPAL_RATE_M3PLUS', 'CURRENT_COLLECTION_RATE_M3PLUS_Z', 'CURRENT_COLLECTION_RATE_M3PLUS_X', 'CURRENT_COLLECTION_RATE_M3PLUS', 'COLLECTION_LATE_FEE_DOING_Z', 'COLLECTION_LATE_FEE_DOING_X', 'COLLECTION_LATE_FEE_DOING', 'COLLECTION_LATE_FEE_DOING_S1_Z', 'COLLECTION_LATE_FEE_DOING_S1_X', 'COLLECTION_LATE_FEE_DOING_S1', 'COLLECTION_LATE_FEE_DOING_S2_Z', 'COLLECTION_LATE_FEE_DOING_S2_X', 'COLLECTION_LATE_FEE_DOING_S2', 'COLLECTION_LATE_FEE_DOING_M2_Z', 'COLLECTION_LATE_FEE_DOING_M2_X', 'COLLECTION_LATE_FEE_DOING_M2', 'COLLECTION_LATE_FEE_DOING_M3_Z', 'COLLECTION_LATE_FEE_DOING_M3_X', 'COLLECTION_LATE_FEE_DOING_M3', 'COLLECTION_LATE_FEE_DOING_M3PLUS_Z', 'COLLECTION_LATE_FEE_DOING_M3PLUS_X', 'COLLECTION_LATE_FEE_DOING_M3PLUS', 'UPDATE_TIME']
//横坐标纵坐标
const merge = [[0, 0, 0, 1], [1, 0, 3, 0], [4, 0, 6, 0], [7, 0, 9, 0], [10, 0, 12, 0], [13, 0, 15, 0], [16, 0, 18, 0], [19, 0, 21, 0], [22, 0, 24, 0], [25, 0, 27, 0], [28, 0, 30, 0], [31, 0, 33, 0], [34, 0, 36, 0], [37, 0, 39, 0], [40, 0, 42, 0], [43, 0, 45, 0], [46, 0, 48, 0], [49, 0, 51, 0], [52, 0, 54, 0], [55, 0, 57, 0], [58, 0, 60, 0], [61, 0, 63, 0], [64, 0, 66, 0], [67, 0, 69, 0], [70, 0, 72, 0], [73, 0, 75, 0], [76, 0, 78, 0], [79, 0, 81, 0], [82, 0, 84, 0], [85, 0, 87, 0], [88, 0, 88, 1]]
const change = [['A1', '    日期'], ['B1', '      当日催回率'], ['E1', '        当日入催本金(元)'], ['H1', '          在催本金(元)'], ['K1', '          S1在催本金(元)'], ['N1', ' S1在催本金比例'], ['Q1', ' S1总和催回率'], ['T1', ' S1当期催回率'], ['W1', '         S2在催本金(元)'], ['Z1', ' S2在催本金比例'], ['AC1', ' S2总和催回率'], ['AF1', ' S2当期催回率'], ['AI1', 'M2在催本金(元)'], ['AL1', ' M2在催本金比例'], ['AO1', ' S3总和催回率'], ['AR1', ' S3当期催回率'], ['AU1', ' M3在催本金(元)'], ['AX1', ' M3在催本金比例'], ['BA1', ' M3总和催回率'], ['BD1', ' M3当期催回率'], ['BG1', ' M3+在催本金(元)'], ['BJ1', ' M3+在催本金比例'], ['BM1', ' M3+总和催回率'], ['BP1', ' M3+当期催回率'], ['BS1', '        在催滞纳金(元)'], ['BV1', '         S1在催滞纳金(元)'], ['BY1', '        S2在催滞纳金(元)'], ['CB1', ' M2在催滞纳金(元)'], ['CE1', ' M3在催滞纳金(元)'], ['CH1', ' M3+在催滞纳金(元)'], ['CK1', '     更新时间']]

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
