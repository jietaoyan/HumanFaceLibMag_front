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



