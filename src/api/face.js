import request from '@/utils/request'

//人脸算法版本
export function getFaceVersion() {
  return request({
    url: '/face/version',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}

//SDK剩余天数
export function getFaceAvaDays() {
  return request({
    url: '/face/ava-days',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}

export function getFeatureSize() {
  return request({
    url: '/face/feature-size',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
  })
}



