import request from '@/utils/request'

//获取项目分组,param为projectId=projectid
export function getGroupsList(param) {
  return request({
    url: '/project/group/list?' + param,
    method: 'get'

  })
}

//删除分组，param为projectId=projectid&groupId=id
export function deleteGroup(param) {
  return request({
    url: '/project/group/delete?' + param,
    method: 'delete'
  })
}

//添加分组，projectId=id&name=name
export function addGroup(param){
  return request({
    url: '/project/group/create?' + param,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}

//获取分组用户,projectId=id&groupId=id
export function getGroupUsers(param) {
  return request({
    url: '/project/group/user-list?' + param,
    method: 'get'
  })
}
