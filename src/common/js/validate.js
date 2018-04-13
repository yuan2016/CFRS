/* 是否是公司邮箱*/
export function isCfEmail (str) {
  const reg = /^[a-z0-9](?:[-_.+]?[a-z0-9]+)*@xianjinkd\.com$/i
  return reg.test(str.trim())
}
