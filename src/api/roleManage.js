import request from '@/utils/request'

const module = '/role'

export function getRoles(data) {
  return request({
    url: `${module}/search`,
    method: 'post',
    data,
  })
}

export function getMenus(data) {
  return request({
    url: `${module}/edit/need`,
    method: 'post',
    data,
  })
}

export function editRole(data) {
  return request({
    url: `${module}/edit`,
    method: 'post',
    data,
  })
}
