import request from '@/utils/request'

export function getList() {
  return request({
    url: '/project/list',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}

