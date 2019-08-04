import request from '@/utils/request'
// import excelRequset from '@/utils/excelRequest'

//项目列表
export function getList() {
  return request({
    url: '/project/list',
    method: 'get'
  })
}
//项目列表，带分页pageIndex=pageIndex&pageSize=size
export function getListPage(param) {
  return request({
    url: '/project/list-page?'+param,
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

//添加人脸信息
export function addUserFace(data) {
  return request({
    url: '/face/add-user',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
}

//导出姓名人脸Excel
export function exportPrjFaceExcel(prjId){
  return request({
    url:'/project/face/excel/'+prjId ,
    method:"get",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}