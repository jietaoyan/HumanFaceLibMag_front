import request from '@/utils/request'

export function getList() {
  return request({
    url: '/project/list',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}


export function getUsersByProjectId(params){
  return request({
    url: '/face/list-user-page?' + params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}