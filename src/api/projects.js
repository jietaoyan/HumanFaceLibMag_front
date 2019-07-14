import request from '@/utils/request'

//项目列表
export function getList() {
  return request({
    url: '/project/list',
    method: 'get'
  })
}

//项目用户信息,params为"projectId=id&pageIndex=pageIndex&pageSize=size"
export function getUsersByProjectId(params) {
  return request({
    url: '/face/list-user-page?' + params,
    method: 'get'
  })
}

//项目用户信息,params为"projectId=id&userId=id"
export function deleteUserFromProject(params) {
  return request({
    url: '/face/delete-user?' + params,
    method: 'delete'
  })
}

//当前用户属于哪个项目的
export function prjOfMe() {
  return request({
    url: '/project/me',
    method: 'get'
  })
}
