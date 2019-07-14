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
