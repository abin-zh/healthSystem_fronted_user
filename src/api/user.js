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

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
