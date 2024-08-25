import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

const module = '/user'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: `${module}/login`,
    method: 'post',
    data,
  })
}

export function getEmailCode(data) {
  return request({
    method: 'post',
    url: `${module}/email/code`,
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: `${module}/info`,
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register(data) {
  return request({
    url: `${module}/register`,
    method: 'post',
    data,
  })
}

export function getProjects(data) {
  return request({
    url: `${module}/project/search`,
    method: 'post',
    data,
  })
}

export function getPackages(data) {
  return request({
    url: `${module}/package/search`,
    method: 'post',
    data,
  })
}

/**
 * 用户充值
 */
export function userPay(data) {
  return request({
    url: `${module}/topup`,
    method: 'post',
    data,
  })
}

/**
 * 获取用户当前余额
 */
export function getUserBalance(data) {
  return request({
    url: `${module}/balance`,
    method: 'post',
    data,
  })
}

/**
 * 用户支付体检订单
 */
export function userPayCheckUp(data) {
  return request({
    url: `${module}/pay/checkup`,
    method: 'post',
    data,
  })
}
