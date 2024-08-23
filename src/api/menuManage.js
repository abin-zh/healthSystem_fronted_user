import request from '@/utils/request'

const module = '/menu'

export function getMenus(data) {
  return request({
    url: `${module}/search`,
    method: 'post',
    data,
  })
}

export function editMenu(data) {
  return request({
    url: `${module}/edit`,
    method: 'post',
    data,
  })
}
