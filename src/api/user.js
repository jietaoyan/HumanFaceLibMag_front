import request from '@/utils/request'
import excelRequest from '@/utils/excelRequest'
//登录
export function login(data) {
  return request({
    url: '/admin/user/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

//获取注册用户，分页pageIndex=pageIndex&pageSize=size
export function getUsersFromAdmin(param) {
  return request({
    url: '/admin/user/list-page?' + param,
    method: 'get'
  })
}

//将用户设置为管理员,param为id=id
export function setUserAdmin(param) {
  return request({
    url: '/admin/user/set-admin?' + param,
    method: 'put'
  })
}

//将用户设置为普通用户,param为id=id
export function setUser2NormalUser(param) {
  return request({
    url: '/admin/user/cancel-admin?' + param,
    method: 'put'
  })
}

//重置密码(密码重置为手机后六位),param为userId=id
export function resetPwdByAdmin(param) {
  return request({
    url: '/admin/user/pwd/reset?' + param,
    method: 'put'
  })
}

//增加管理员,param为{}，‘name，password，userId’
export function addAdmin(param) {
  return request({
    url: '/admin/user/register',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: param
  })
}

//导出用户Excel
export function exportUsersExcel(type,start,end){
  return excelRequest({
    url:'/project/user/excel/'+type +'/'+start+'/'+end,
    method:"get",
    responseType: "arraybuffer",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}

//上传excel添加用户信息
export function uploadUsersExcel(type,data){
  return excelRequest({
    url:'/project/user/excel/upload/'+type,
    method:"post",
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  })
}

//管理员用户数量
export function adminUsersCount(){
  return request({
    url: '/user/project/user/excel/adminUsers',
    method: 'get'
  })
}

//普通用户数量
export function normalUserCount(){
  return request({
    url: '/user/project/user/excel/users',
    method: 'get'
  })
}

//按用户名查找对应的项目名（有的话用户userid和人脸userid是相同的）
export function getProjectNameByUserid(userid){
  return request({
    url: '/admin/user/project/' + userid,
    method: 'get'
  })
}

//删除用户，同时删除相同userid下的人脸数据
export function deleteUserByUseridAndPrjid(projectid,userid){
  return request({
    url: '/admin/user/delete?projectId='+projectid + '&userId='+userid,
    method: 'get'
  })
}