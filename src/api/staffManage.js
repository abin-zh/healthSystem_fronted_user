import request from '@/utils/request'

export function getStaffs(data) {
  return request({
    url: '/staff/search',
    method: 'post',
    data,
  })
}

export function getRolesAndDepts(data) {
  return request({
    url: '/staff/edit/need',
    method: 'get',
    data,
  })
}

export function editStaff(data) {
  return request({
    url: '/staff/edit',
    method: 'post',
    data,
  })
}
