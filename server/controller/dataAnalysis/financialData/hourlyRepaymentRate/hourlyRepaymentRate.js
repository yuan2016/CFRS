let sql = require('../../../../sql/sqlMap')
let func = require('../../../../sql/func')
let moment = require('moment')
let tableName = require('../../../../config/tableName')
let {formatCurrency, analysis, mosaicName} = require('../../../../utils/utils')
let shell = require('../../../../config/shell')
let pro = require('child_process')
let fs = require('fs')
let path = require('path')
let {exportJsonToExcel} = require('../../../../utils/excel')
const names = ['f21_repaymented_amount', 'f21_rate_repaymented', 'fv21_repaymented_amount', 'fv21_rate_repaymented']
global.hourlyRepaymentRateCount = 0

const tHeader = [['', '0时', '1时','2时','3时','4时','5时','6时','7时','8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时','0时', '1时','2时','3时','4时','5时','6时','7时','8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时','0时', '1时','2时','3时','4时','5时','6时','7时','8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时','0时', '1时','2时','3时','4时','5时','6时','7时','8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时', ''], ['日期', '21天分期还款率', '21天分期提额还款率', '21天分期还款金额', '21天分期提额还款金额', '更新时间']]
const filterVal = ['D_DATE',
  'F21_RATE_REPAYMENTED_00','F21_RATE_REPAYMENTED_01','F21_RATE_REPAYMENTED_02','F21_RATE_REPAYMENTED_03','F21_RATE_REPAYMENTED_04','F21_RATE_REPAYMENTED_05','F21_RATE_REPAYMENTED_06','F21_RATE_REPAYMENTED_07','F21_RATE_REPAYMENTED_08','F21_RATE_REPAYMENTED_09','F21_RATE_REPAYMENTED_10','F21_RATE_REPAYMENTED_11','F21_RATE_REPAYMENTED_12','F21_RATE_REPAYMENTED_13','F21_RATE_REPAYMENTED_14','F21_RATE_REPAYMENTED_15','F21_RATE_REPAYMENTED_16','F21_RATE_REPAYMENTED_17','F21_RATE_REPAYMENTED_18','F21_RATE_REPAYMENTED_19','F21_RATE_REPAYMENTED_20','F21_RATE_REPAYMENTED_21','F21_RATE_REPAYMENTED_22','F21_RATE_REPAYMENTED_23',
  'FV21_RATE_REPAYMENTED_00','FV21_RATE_REPAYMENTED_01','FV21_RATE_REPAYMENTED_02','FV21_RATE_REPAYMENTED_03','FV21_RATE_REPAYMENTED_04','FV21_RATE_REPAYMENTED_05','FV21_RATE_REPAYMENTED_06','FV21_RATE_REPAYMENTED_07','FV21_RATE_REPAYMENTED_08','FV21_RATE_REPAYMENTED_09','FV21_RATE_REPAYMENTED_10','FV21_RATE_REPAYMENTED_11','FV21_RATE_REPAYMENTED_12','FV21_RATE_REPAYMENTED_13','FV21_RATE_REPAYMENTED_14','FV21_RATE_REPAYMENTED_15','FV21_RATE_REPAYMENTED_16','FV21_RATE_REPAYMENTED_17','FV21_RATE_REPAYMENTED_18','FV21_RATE_REPAYMENTED_19','FV21_RATE_REPAYMENTED_20','FV21_RATE_REPAYMENTED_21','FV21_RATE_REPAYMENTED_22','FV21_RATE_REPAYMENTED_23', 'F21_REPAYMENTED_AMOUNT_00','F21_REPAYMENTED_AMOUNT_01','F21_REPAYMENTED_AMOUNT_02','F21_REPAYMENTED_AMOUNT_03','F21_REPAYMENTED_AMOUNT_04','F21_REPAYMENTED_AMOUNT_05','F21_REPAYMENTED_AMOUNT_06','F21_REPAYMENTED_AMOUNT_07','F21_REPAYMENTED_AMOUNT_08','F21_REPAYMENTED_AMOUNT_09','F21_REPAYMENTED_AMOUNT_10','F21_REPAYMENTED_AMOUNT_11','F21_REPAYMENTED_AMOUNT_12','F21_REPAYMENTED_AMOUNT_13','F21_REPAYMENTED_AMOUNT_14','F21_REPAYMENTED_AMOUNT_15','F21_REPAYMENTED_AMOUNT_16','F21_REPAYMENTED_AMOUNT_17','F21_REPAYMENTED_AMOUNT_18','F21_REPAYMENTED_AMOUNT_19','F21_REPAYMENTED_AMOUNT_20','F21_REPAYMENTED_AMOUNT_21','F21_REPAYMENTED_AMOUNT_22','F21_REPAYMENTED_AMOUNT_23',
  'FV21_REPAYMENTED_AMOUNT_00','FV21_REPAYMENTED_AMOUNT_01','FV21_REPAYMENTED_AMOUNT_02','FV21_REPAYMENTED_AMOUNT_03','FV21_REPAYMENTED_AMOUNT_04','FV21_REPAYMENTED_AMOUNT_05','FV21_REPAYMENTED_AMOUNT_06','FV21_REPAYMENTED_AMOUNT_07','FV21_REPAYMENTED_AMOUNT_08','FV21_REPAYMENTED_AMOUNT_09','FV21_REPAYMENTED_AMOUNT_10','FV21_REPAYMENTED_AMOUNT_11','FV21_REPAYMENTED_AMOUNT_12','FV21_REPAYMENTED_AMOUNT_13','FV21_REPAYMENTED_AMOUNT_14','FV21_REPAYMENTED_AMOUNT_15','FV21_REPAYMENTED_AMOUNT_16','FV21_REPAYMENTED_AMOUNT_17','FV21_REPAYMENTED_AMOUNT_18','FV21_REPAYMENTED_AMOUNT_19','FV21_REPAYMENTED_AMOUNT_20','FV21_REPAYMENTED_AMOUNT_21','FV21_REPAYMENTED_AMOUNT_22','FV21_REPAYMENTED_AMOUNT_23','UPDATE_TIME']
const merge = [[0, 0, 0, 1], [1, 0, 24, 0], [25, 0, 48, 0], [49, 0, 72, 0], [73, 0, 96, 0], [97, 0, 97, 1]]
const change = [['A1', '  日期'], ['B1', '     21天分期还款率'],['Z1', '     21天分期提额还款率'], ['AX1', '     21天分期还款金额'],['BV1', '     21天分期提额还款金额'], ['CT1', '更新时间']]

function formatDataP (rows, qs) {
  let date = []
  let f21RepaymentedAmount = []
  let f21RateRepaymented = []
  let fv21RepaymentedAmount = []
  let fv21RateRepaymented = []
  let arr = []
  for (let row of rows) {
    if (row.d_date) {
      date.push(moment(row.d_date).format('MM-DD'))
    }
    if (row[qs[0]]) {
      f21RepaymentedAmount.push(row[qs[0]])
    } else {
      f21RepaymentedAmount.push(0)
    }
    if (row[qs[1]]) {
      f21RateRepaymented.push((row[qs[1]] * 100).toFixed(2))
    } else {
      f21RateRepaymented.push(0)
    }
    if (row[qs[2]]) {
      fv21RepaymentedAmount.push(row[qs[2]])
    } else {
      fv21RepaymentedAmount.push(0)
    }
    if (row[qs[3]]) {
      fv21RateRepaymented.push((row[qs[3]] * 100).toFixed(2))
    } else {
      fv21RateRepaymented.push(0)
    }
  }
  arr.push(date)
  arr.push(f21RepaymentedAmount)
  arr.push(f21RateRepaymented)
  arr.push(fv21RepaymentedAmount)
  arr.push(fv21RateRepaymented)
  return arr
}

function formatData (rows) {
  return rows.map(row => {
    if (row.UPDATE_TIME) {
      row.UPDATE_TIME = moment(row.UPDATE_TIME).format('YYYY-MM-DD HH:mm:ss')
    }
    if (row.D_DATE) {
      row.D_DATE = moment(row.D_DATE).format('YYYY-MM-DD')
    }

    if (row.F21_RATE_REPAYMENTED_00) {
      row.F21_RATE_REPAYMENTED_00 = (row.F21_RATE_REPAYMENTED_00 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_01) {
      row.F21_RATE_REPAYMENTED_01 = (row.F21_RATE_REPAYMENTED_01 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_02) {
      row.F21_RATE_REPAYMENTED_02 = (row.F21_RATE_REPAYMENTED_02 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_03) {
      row.F21_RATE_REPAYMENTED_03 = (row.F21_RATE_REPAYMENTED_03 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_04) {
      row.F21_RATE_REPAYMENTED_04 = (row.F21_RATE_REPAYMENTED_04 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_05) {
      row.F21_RATE_REPAYMENTED_05 = (row.F21_RATE_REPAYMENTED_05 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_06) {
      row.F21_RATE_REPAYMENTED_06 = (row.F21_RATE_REPAYMENTED_06 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_07) {
      row.F21_RATE_REPAYMENTED_07 = (row.F21_RATE_REPAYMENTED_07 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_08) {
      row.F21_RATE_REPAYMENTED_08 = (row.F21_RATE_REPAYMENTED_08 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_09) {
      row.F21_RATE_REPAYMENTED_09 = (row.F21_RATE_REPAYMENTED_09 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_10) {
      row.F21_RATE_REPAYMENTED_10 = (row.F21_RATE_REPAYMENTED_10 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_11) {
      row.F21_RATE_REPAYMENTED_11 = (row.F21_RATE_REPAYMENTED_11 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_12) {
      row.F21_RATE_REPAYMENTED_12 = (row.F21_RATE_REPAYMENTED_12 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_13) {
      row.F21_RATE_REPAYMENTED_13 = (row.F21_RATE_REPAYMENTED_13 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_14) {
      row.F21_RATE_REPAYMENTED_14 = (row.F21_RATE_REPAYMENTED_14 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_15) {
      row.F21_RATE_REPAYMENTED_15 = (row.F21_RATE_REPAYMENTED_15 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_16) {
      row.F21_RATE_REPAYMENTED_16 = (row.F21_RATE_REPAYMENTED_16 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_17) {
      row.F21_RATE_REPAYMENTED_17 = (row.F21_RATE_REPAYMENTED_17 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_18) {
      row.F21_RATE_REPAYMENTED_18 = (row.F21_RATE_REPAYMENTED_18 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_19) {
      row.F21_RATE_REPAYMENTED_19 = (row.F21_RATE_REPAYMENTED_19 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_20) {
      row.F21_RATE_REPAYMENTED_20 = (row.F21_RATE_REPAYMENTED_20 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_21) {
      row.F21_RATE_REPAYMENTED_21 = (row.F21_RATE_REPAYMENTED_21 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_22) {
      row.F21_RATE_REPAYMENTED_22 = (row.F21_RATE_REPAYMENTED_22 * 100).toFixed(2) + '%'
    }
    if (row.F21_RATE_REPAYMENTED_23) {
      row.F21_RATE_REPAYMENTED_23 = (row.F21_RATE_REPAYMENTED_23 * 100).toFixed(2) + '%'
    }

    if (row.FV21_RATE_REPAYMENTED_00) {
      row.FV21_RATE_REPAYMENTED_00 = (row.FV21_RATE_REPAYMENTED_00 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_01) {
      row.FV21_RATE_REPAYMENTED_01 = (row.FV21_RATE_REPAYMENTED_01 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_02) {
      row.FV21_RATE_REPAYMENTED_02 = (row.FV21_RATE_REPAYMENTED_02 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_03) {
      row.FV21_RATE_REPAYMENTED_03 = (row.FV21_RATE_REPAYMENTED_03 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_04) {
      row.FV21_RATE_REPAYMENTED_04 = (row.FV21_RATE_REPAYMENTED_04 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_05) {
      row.FV21_RATE_REPAYMENTED_05 = (row.FV21_RATE_REPAYMENTED_05 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_06) {
      row.FV21_RATE_REPAYMENTED_06 = (row.FV21_RATE_REPAYMENTED_06 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_07) {
      row.FV21_RATE_REPAYMENTED_07 = (row.FV21_RATE_REPAYMENTED_07 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_08) {
      row.FV21_RATE_REPAYMENTED_08 = (row.FV21_RATE_REPAYMENTED_08 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_09) {
      row.FV21_RATE_REPAYMENTED_09 = (row.FV21_RATE_REPAYMENTED_09 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_10) {
      row.FV21_RATE_REPAYMENTED_10 = (row.FV21_RATE_REPAYMENTED_10 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_11) {
      row.FV21_RATE_REPAYMENTED_11 = (row.FV21_RATE_REPAYMENTED_11 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_12) {
      row.FV21_RATE_REPAYMENTED_12 = (row.FV21_RATE_REPAYMENTED_12 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_13) {
      row.FV21_RATE_REPAYMENTED_13 = (row.FV21_RATE_REPAYMENTED_13 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_14) {
      row.FV21_RATE_REPAYMENTED_14 = (row.FV21_RATE_REPAYMENTED_14 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_15) {
      row.FV21_RATE_REPAYMENTED_15 = (row.FV21_RATE_REPAYMENTED_15 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_16) {
      row.FV21_RATE_REPAYMENTED_16 = (row.FV21_RATE_REPAYMENTED_16 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_17) {
      row.FV21_RATE_REPAYMENTED_17 = (row.FV21_RATE_REPAYMENTED_17 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_18) {
      row.FV21_RATE_REPAYMENTED_18 = (row.FV21_RATE_REPAYMENTED_18 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_19) {
      row.FV21_RATE_REPAYMENTED_19 = (row.FV21_RATE_REPAYMENTED_19 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_20) {
      row.FV21_RATE_REPAYMENTED_20 = (row.FV21_RATE_REPAYMENTED_20 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_21) {
      row.FV21_RATE_REPAYMENTED_21 = (row.FV21_RATE_REPAYMENTED_21 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_22) {
      row.FV21_RATE_REPAYMENTED_22 = (row.FV21_RATE_REPAYMENTED_22 * 100).toFixed(2) + '%'
    }
    if (row.FV21_RATE_REPAYMENTED_23) {
      row.FV21_RATE_REPAYMENTED_23 = (row.FV21_RATE_REPAYMENTED_23 * 100).toFixed(2) + '%'
    }

    if (row.F21_REPAYMENTED_AMOUNT_00) {
      row.F21_REPAYMENTED_AMOUNT_00 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_00)
    }
    if (row.F21_REPAYMENTED_AMOUNT_01) {
      row.F21_REPAYMENTED_AMOUNT_01 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_01)
    }
    if (row.F21_REPAYMENTED_AMOUNT_02) {
      row.F21_REPAYMENTED_AMOUNT_02 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_02)
    }
    if (row.F21_REPAYMENTED_AMOUNT_03) {
      row.F21_REPAYMENTED_AMOUNT_03 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_03)
    }
    if (row.F21_REPAYMENTED_AMOUNT_04) {
      row.F21_REPAYMENTED_AMOUNT_04 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_04)
    }
    if (row.F21_REPAYMENTED_AMOUNT_05) {
      row.F21_REPAYMENTED_AMOUNT_05 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_05)
    }
    if (row.F21_REPAYMENTED_AMOUNT_06) {
      row.F21_REPAYMENTED_AMOUNT_06 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_06)
    }
    if (row.F21_REPAYMENTED_AMOUNT_07) {
      row.F21_REPAYMENTED_AMOUNT_07 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_07)
    }
    if (row.F21_REPAYMENTED_AMOUNT_08) {
      row.F21_REPAYMENTED_AMOUNT_08 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_08)
    }
    if (row.F21_REPAYMENTED_AMOUNT_09) {
      row.F21_REPAYMENTED_AMOUNT_09 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_09)
    }
    if (row.F21_REPAYMENTED_AMOUNT_10) {
      row.F21_REPAYMENTED_AMOUNT_10 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_10)
    }
    if (row.F21_REPAYMENTED_AMOUNT_11) {
      row.F21_REPAYMENTED_AMOUNT_11 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_11)
    }
    if (row.F21_REPAYMENTED_AMOUNT_12) {
      row.F21_REPAYMENTED_AMOUNT_12 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_12)
    }
    if (row.F21_REPAYMENTED_AMOUNT_13) {
      row.F21_REPAYMENTED_AMOUNT_13 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_13)
    }
    if (row.F21_REPAYMENTED_AMOUNT_14) {
      row.F21_REPAYMENTED_AMOUNT_14 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_14)
    }
    if (row.F21_REPAYMENTED_AMOUNT_15) {
      row.F21_REPAYMENTED_AMOUNT_15 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_15)
    }
    if (row.F21_REPAYMENTED_AMOUNT_16) {
      row.F21_REPAYMENTED_AMOUNT_16 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_16)
    }
    if (row.F21_REPAYMENTED_AMOUNT_17) {
      row.F21_REPAYMENTED_AMOUNT_17 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_17)
    }
    if (row.F21_REPAYMENTED_AMOUNT_18) {
      row.F21_REPAYMENTED_AMOUNT_18 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_18)
    }
    if (row.F21_REPAYMENTED_AMOUNT_19) {
      row.F21_REPAYMENTED_AMOUNT_19 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_19)
    }
    if (row.F21_REPAYMENTED_AMOUNT_20) {
      row.F21_REPAYMENTED_AMOUNT_20 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_20)
    }
    if (row.F21_REPAYMENTED_AMOUNT_21) {
      row.F21_REPAYMENTED_AMOUNT_21 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_21)
    }
    if (row.F21_REPAYMENTED_AMOUNT_22) {
      row.F21_REPAYMENTED_AMOUNT_22 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_22)
    }
    if (row.F21_REPAYMENTED_AMOUNT_23) {
      row.F21_REPAYMENTED_AMOUNT_23 = formatCurrency(row.F21_REPAYMENTED_AMOUNT_23)
    }

    if (row.FV21_REPAYMENTED_AMOUNT_00) {
      row.FV21_REPAYMENTED_AMOUNT_00 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_00)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_01) {
      row.FV21_REPAYMENTED_AMOUNT_01 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_01)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_02) {
      row.FV21_REPAYMENTED_AMOUNT_02 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_02)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_03) {
      row.FV21_REPAYMENTED_AMOUNT_03 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_03)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_04) {
      row.FV21_REPAYMENTED_AMOUNT_04 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_04)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_05) {
      row.FV21_REPAYMENTED_AMOUNT_05 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_05)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_06) {
      row.FV21_REPAYMENTED_AMOUNT_06 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_06)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_07) {
      row.FV21_REPAYMENTED_AMOUNT_07 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_07)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_08) {
      row.FV21_REPAYMENTED_AMOUNT_08 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_08)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_09) {
      row.FV21_REPAYMENTED_AMOUNT_09 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_09)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_10) {
      row.FV21_REPAYMENTED_AMOUNT_10 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_10)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_11) {
      row.FV21_REPAYMENTED_AMOUNT_11 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_11)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_12) {
      row.FV21_REPAYMENTED_AMOUNT_12 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_12)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_13) {
      row.FV21_REPAYMENTED_AMOUNT_13 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_13)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_14) {
      row.FV21_REPAYMENTED_AMOUNT_14 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_14)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_15) {
      row.FV21_REPAYMENTED_AMOUNT_15 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_15)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_16) {
      row.FV21_REPAYMENTED_AMOUNT_16 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_16)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_17) {
      row.FV21_REPAYMENTED_AMOUNT_17 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_17)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_18) {
      row.FV21_REPAYMENTED_AMOUNT_18 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_18)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_19) {
      row.FV21_REPAYMENTED_AMOUNT_19 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_19)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_20) {
      row.FV21_REPAYMENTED_AMOUNT_20 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_20)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_21) {
      row.FV21_REPAYMENTED_AMOUNT_21 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_21)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_22) {
      row.FV21_REPAYMENTED_AMOUNT_22 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_22)
    }
    if (row.FV21_REPAYMENTED_AMOUNT_23) {
      row.FV21_REPAYMENTED_AMOUNT_23 = formatCurrency(row.FV21_REPAYMENTED_AMOUNT_23)
    }

    return row
  })
}

function formatJson (filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

module.exports = {
  fetchAllP (req, res) {
    let params = req.body
    let date = params.date
    let hour = params.hour
    let queryNames = []
    for (let name of names) {
      queryNames.push(name + hour)
    }
    let query = 'select d_date,' + queryNames.join(',') + ' from ?? where d_date <="' + date + '" order by d_date limit 15'
    func.connPool1(query, tableName.hourlyRepaymentRate, function (err, rs) {
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
      res.json(formatDataP(rs, queryNames))
    })
  },
  fetchAll (req, res) {
    let params = req.body
    let queries = analysis(params, 'd_date', 'w')
    let order = params.order || sql.dataAnalysis.order
    let query = sql.dataAnalysis.selectAll + queries + order + sql.dataAnalysis.selectAllBack
    func.connPool1(query, [tableName.hourlyRepaymentRate, params.offset, params.limit], function (err, rs) {
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
    let query = sql.dataAnalysis.getCount + queries
    func.connPool1(query, [tableName.hourlyRepaymentRate], function (err, rs) {
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
  refreshData (req, res) {
    if (global.hourlyRepaymentRateCount === 0) {
      global.hourlyRepaymentRateCount++
      pro.exec(shell.hourlyRepaymentRate, function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error)
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 分时段还款率shell脚本执行失败')
          res.json({code: '500'})
          console.log("failed")
          global.hourlyRepaymentRateCount = 0
        } else {
          console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 分时段还款率shell脚本执行成功')
          res.json({code: '200'})
          global.hourlyRepaymentRateCount = 0
        }
      })
      console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ' 分时段还款率开始执行shell脚本')
    } else {
      res.json({code: '400'})
    }
  },
  getExcelData (req, res) {
    let params = req.query
    let queries = analysis(params, 'd_date', 'w')
    let query = sql.dataAnalysis.selectAll + queries + sql.dataAnalysis.order
    func.connPool1(query, [tableName.hourlyRepaymentRate], function (err, rs) {
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
