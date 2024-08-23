import request from '@/utils/request'

const module = '/medical_project'

//获取体检项目列表
export function getMedicalProjects(data) {
  return request({
    url: `${module}/search`,
    method: 'post',
    data,
  })
}

//获取体检项目列表
export function getAllProjects(data) {
  return request({
    url: `${module}/all`,
    method: 'post',
    data,
  })
}

//获取所有科室和所有细项(用于查询和添加编辑)
export function getAllDeptsAndItems(data) {
  return request({
    url: `${module}/edit/need`,
    method: 'post',
    data,
  })
}

//获取体检项目的体检细项列表
export function getMedicalProjectItems(data) {
  return request({
    url: `${module}/item`,
    method: 'post',
    data,
  })
}

//添加/编辑体检项目
export function editMedicalProject(data) {
  return request({
    url: `${module}/edit`,
    method: 'post',
    data,
  })
}

//删除体检项目
export function deleteMedicalProjects(data) {
  return request({
    url: `${module}/del`,
    method: 'post',
    data,
  })
}
