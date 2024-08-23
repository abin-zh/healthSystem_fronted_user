import request from '@/utils/request'

const module = '/log'

export function getLogs(data) {
  return request({
    url: `${module}/search`,
    method: 'post',
    data,
  })
}
