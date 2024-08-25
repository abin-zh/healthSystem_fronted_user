import request from '@/utils/request'

const module = '/medical_package'

//获取套餐列表(全部、模糊)
export function getMedicalPackages(data) {
  return request({
    url: `${module}/search`,
    method: 'post',
    data,
  })
}

export function getExistMedicalPackages(data) {
  return request({
    url: `${module}/search/exist`,
    method: 'post',
    data,
  })
}

//获取体检套餐的体检项目列表
export function getMedicalPackageProjects(data) {
  return request({
    url: `${module}/project`,
    method: 'post',
    data,
  })
}

//获取所有的体检项目
export function getAllProjects(data) {
  return request({
    url: `${module}/edit/need`,
    method: 'post',
    data,
  })
}

//添加/编辑套餐列表
export function editMedicalPackage(data) {
  return request({
    url: `${module}/edit`,
    method: 'post',
    data,
  })
}

//删除套餐列表
export function deleteMedicalPackages(data) {
  return request({
    url: `${module}/del`,
    method: 'post',
    data,
  })
}

//获取所有套餐(不分页)
export function getAllPackages(data) {
  return request({
    url: `${module}/all`,
    method: 'post',
    data,
  })
}
