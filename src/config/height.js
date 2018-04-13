import { saveHeight } from '../common/js/storage'

(function (doc, win) {
  let docEl = doc.documentElement.clientHeight
  let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  let recalc = function () {
    let tableHeight
    tableHeight = docEl - 280
    saveHeight(tableHeight)
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)
