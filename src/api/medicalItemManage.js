import request from '@/utils/request'

const moudle = '/medical_item/'

//获取体检细项列表(分页、模糊)
export function getMedicalItems(data) {
  return request({
    url: `${moudle}/search`,
    method: 'post',
    data,
  })
}

//添加/修改体检细项
export function editMedicalItems(data) {
  return request({
    url: `${moudle}/edit`,
    method: 'post',
    data,
  })
}

//删除体检细项
export function deleteMedicalItems(data) {
  return request({
    url: `${moudle}/del`,
    method: 'post',
    data,
  })
}
