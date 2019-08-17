import request from '@/utils/request'
import excelRequest from '@/utils/excelRequest'

//获取项目分组,param为projectId=projectid
export function getGroupsList(param) {
  return request({
    url: '/project/group/list?' + param,
    method: 'get'
  })
}

//获取项目分组带分页,param为projectId=projectid&pageIndex=pageIndex&pageSize=size
export function getGroupsListPage(param) {
  return request({
    url: '/project/group/list-page?' + param,
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

//获取分组用户带分页,projectId=id&groupId=id&pageIndex=pageIndex&pageSize=size
export function getGroupUsersPage(param) {
  return request({
    url: '/project/group/user-list-page?' + param,
    method: 'get'
  })
}

//删除分组内用户
// {
//   "groupId": 0,
//   "projectId": "string",
//   "userIds": [
//     "string"
//   ]
// }
export function deleteUserInGroup(data){
  return request({
    url: '/project/group/remove-users',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}
//添加用户到分组
// {
//   "groupId": 0,
//   "projectId": "string",
//   "userIds": [
//     "string"
//   ]
// }
export function addUserInGroup(data){
  return request({
    url: '/project/group/insert-users',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

//获取该分组下用户id
export function getGroupUserId(groupid) {
  return request({
    url: '/project/group/userIds/'+groupid,
    method: 'get'
  })
}

//导出姓名人脸Excel
export function exportGroupFaceExcel(groupid,start,end){
  return excelRequest({
    url:'/project/group/face/excel/'+groupid +'/'+start+'/'+end,
    method:"get",
    responseType: "arraybuffer",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}

//上传excel添加人脸信息
export function uploadUsersFaces2Group(projectid,groupid,data){
  return excelRequest({
    url:'/project/group/face/upload/'+projectid+'/'+groupid,
    method:"post",
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
}