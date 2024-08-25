import request from '@/utils/request'

const module = '/orders'

//获取用户订单
export function getUserOrders(data) {
  return request({
    url: `${module}/search/user`,
    method: 'post',
    data,
  })
}

//获取用户体检小结
export function getUserProjectSummaries(data) {
  return request({
    url: `${module}/project/user`,
    method: 'post',
    data,
  })
}

//获取用户体检小结
export function getUserCheckup(data) {
  return request({
    url: `${module}/checkup/user`,
    method: 'post',
    data,
  })
}

//创建订单
export function addUserBill(data) {
  return request({
    url: `${module}/user/add`,
    method: 'post',
    data,
  })
}

//获取订单信息(根据科室)
export function getDeptBill(data) {
  return request({
    url: `${module}/search/doctor/dept`,
    method: 'post',
    data,
  })
}

//获取对应项目的细项结果状态
export function getItemResultStatus(data) {
  return request({
    url: `${module}/doctor/dept/item/status`,
    method: 'post',
    data,
  })
}

//获取项目的所有细项
export function getProjectItems(data) {
  return request({
    url: `${module}/item/all`,
    method: 'post',
    data,
  })
}

//编辑细项结果信息
export function editItemResult(data) {
  return request({
    url: `${module}/doctor/dept/item/edit`,
    method: 'post',
    data,
  })
}

//编辑项目结果
export function editProjectSummary(data) {
  return request({
    url: `${module}/doctor/dept/project/edit`,
    method: 'post',
    data,
  })
}

//获取未评价的体检总结列表
export function getCheckupSummary(data) {
  return request({
    url: `${module}/chief/checkup/undo/all`,
    method: 'post',
    data,
  })
}

//获取订单的关联的所有项目
export function getAllOrderProjects(data) {
  return request({
    url: `${module}/chief/project/all`,
    method: 'post',
    data,
  })
}

export function editCheckupResult(data) {
  return request({
    url: `${module}/chief/checkup/edit`,
    method: 'post',
    data,
  })
}
