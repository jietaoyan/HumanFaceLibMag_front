import request from '@/utils/request'

//项目列表
export function getList() {
  return request({
    url: '/project/list',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}

//项目用户信息,params为"projectId=id&pageIndex=pageIndex&pageSize=size"
export function getUsersByProjectId(params){
  return request({
    url: '/face/list-user-page?' + params,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}

//当前用户属于哪个项目的
export function prjOfMe() {
  return request({
    url: '/project/me',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}