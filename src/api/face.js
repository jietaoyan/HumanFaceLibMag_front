import request from '@/utils/request'

//人脸算法版本
export function getFaceVersion() {
  return request({
    url: '/face/version',
    method: 'get'
  })
}

//SDK剩余天数
export function getFaceAvaDays() {
  return request({
    url: '/face/ava-days',
    method: 'get'
  })
}

export function getFeatureSize() {
  return request({
    url: '/face/feature-size',
    method: 'get'
  })
}

//返回code=1，待定使用
export function faceCopmare(data) {
  return request({
    url: 'face/compare',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },

  })
}
