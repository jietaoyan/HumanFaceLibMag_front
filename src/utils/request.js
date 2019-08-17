import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/tokenCookie'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
  validateStatus: (status) => {
    return true // 默认的
  },
  cancelToken: new axios.CancelToken((cancel) => {})
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['User-Token'] is a custom headers key
      config.headers['User-Token'] = getToken()
    }
    return config
  },
  error => {
    //console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   * Determine the request status by custom code
   */
  response => {
    const res = response.data
    // if the custom code is not 0, it is judged as an error.
    if (res.code && res.code !== 0) {
      Message({
        message: res.message || '请求出错',
        type: 'error',
        duration: 4 * 1000
      })

      return Promise.reject(new Error(res.message || '请求出错'))
    } else {
      return res
    }
  },
  error => {
    //console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 4 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
