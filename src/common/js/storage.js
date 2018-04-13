export function saveToken (value) {
  let token = 'token'
  //更改token的过期时间
  let Days = 12 / 24
  setCookie(token, value, Days)
}

export function getToken () {
  let token = 'token'
  return getCookie(token)
}

export function clearToken () {
  let token = 'token'
  setCookie(token, '', -1)
}

export function saveAvailableTable (value) {
  let availableTable = 'availableTable'
  let Days = 1000
  setCookie(availableTable, value, Days)
}

export function getAvailableTable () {
  let availableTable = 'availableTable'
  return getCookie(availableTable)
}

export function clearAvailableTable () {
  let availableTable = 'availableTable'
  setCookie(availableTable, '', -1)
}

export function saveEmail (value) {
  let email = 'email'
  let Days = 1000
  setCookie(email, value, Days)
}

export function savePhone (value) {
  let phone = 'phone'
  let Days = 1000
  setCookie(phone, value, Days)
}

export function getPhone () {
  let phone = 'phone'
  return getCookie(phone)
}

export function getEmail () {
  let email = 'email'
  return getCookie(email)
}

export function saveName (value) {
  let name = 'name'
  let Days = 1000
  setCookie(name, value, Days)
}

export function getName () {
  let name = 'name'
  return getCookie(name)
}

export function saveHeight (value) {
  let tableHeight = 'tableHeight'
  let Days = 1000
  setCookie(tableHeight, value, Days)
}

export function getHeight () {
  let tableHeight = 'tableHeight'
  return getCookie(tableHeight)
}

function getCookie (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return arr[2]
  } else {
    return null
  }
}

function setCookie (name, value, exdays) {
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  let expires = 'expires=' + d.toUTCString()
  document.cookie = name + '=' + value + '; ' + expires
}

export function saveSelTables (value) {
  let SelTables = 'SelTables'
  let Days = 1000
  setCookie(SelTables, value, Days)
}

export function getSelTables () {
  let SelTables = 'SelTables'
  return getCookie(SelTables)
}
