import request from '@/utils/request'

const module = '/user'

export function getUsers(data) {
  return request({
    url: `${module}/search`,
    method: 'post',
    data,
  })
}

//添加/编辑用户信息
export function editUser(data) {
  return request({
    url: `${module}/edit`,
    method: 'post',
    data,
  })
}

//删除用户
export function deleteUser(data) {
  return request({
    url: `${module}/del`,
    method: 'post',
    data,
  })
}

//获取用户模板
export function getUserTemplate() {
  return request({
    url: `${module}/template/export`,
    method: 'get',
    responseType: 'blob',
  })
}

//获取用户模板
export function addUsers(data) {
  return request({
    url: `${module}/add/multiple`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'post',
    data,
  })
}
