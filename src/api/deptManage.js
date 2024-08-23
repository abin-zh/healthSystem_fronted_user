import request from '@/utils/request'

//获取科室列表(分页、模糊)
export function getDepts(data) {
  return request({
    url: '/dept/search',
    method: 'post',
    data,
  })
}

//编辑/添加科室
export function editDept(data) {
  return request({
    url: '/dept/edit',
    method: 'post',
    data,
  })
}

export function delDept(data) {
  return request({
    url: '/dept/del',
    method: 'post',
    data,
  })
}
