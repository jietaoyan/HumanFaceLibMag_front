import request from '@/utils/request'

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

//将用户设置为管理员,param为userId=id
export function setUserAdmin(param) {
  return request({
    url: '/admin/user/set-admin?' + param,
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
