import { z } from 'zod/v4'

export function isEmpty(value: string) {
  if (value === null || value === '' || value === undefined || value === 'undefined') {
    return true
  }
  return false
}

export function isHttp(url: string) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str: string) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validURL(url: string) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export function validLowerCase(str: string) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

export function validUpperCase(str: string) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

export function validAlphabets(str: string) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validEmail(email: string) {
  const reg = z.regexes.email
  return reg.test(email)
}

export function isString(str: any) {
  return typeof str === 'string' || str instanceof String
}

export function isArray(arg: any) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
