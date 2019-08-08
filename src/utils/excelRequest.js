import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/tokenCookie'

// create an axios instance
const service2 = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 0, // request timeout
  validateStatus: (status) => {
    return true // 默认的
  },
})

// request interceptor
service2.interceptors.request.use(
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
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service2.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   * Determine the request status by custom code
   */
  response => {
    return response.data
    
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 4 * 1000
    })
    return Promise.reject(error)
  }
)

export default service2
