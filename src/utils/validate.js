import verifyCardNum from './idCardValidate/idCardVerify'

/**
 * @author zxwk1998  （不想保留author可删除）
 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description 校验密码是否小于6位
 * @param str
 * @returns {boolean}
 */
export function isPassword(str) {
  return str.length >= 6
}

/**
 * @author zxwk1998  （不想保留author可删除）
 * @description 判断是否是字符串
 * @param str
 * @returns {boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @author zxwk1998  （不想保留author可删除）
 * @description 判断是否是数组
 * @param arg
 * @returns {arg is any[]|boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @author https://github.com/VincentSit/ChinaMobilePhoneNumberRegex/blob/master/README-CN.md
 * @description 判断是否是手机号
 * @param str
 * @returns {boolean}
 */
export function isPhone(str) {
  const reg =
    /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/
  return reg.test(str)
}

export const validPrice = (rule, value, callback) => {
  if (isNaN(value) || value < 0) {
    callback(new Error('价格需要正数值'))
  } else {
    callback()
  }
}

export const validPhone = (rule, value, callback) => {
  if (isNaN(value)) {
    callback(new Error('请输入数字'))
  } else if (!isPhone(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

export const validIdCard = (rule, value, callback) => {
  if (!verifyCardNum(value)) {
    callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}
