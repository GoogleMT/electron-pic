import Vue from 'vue'
import axios from 'axios'
import Router from '../router'

const MyHttp = axios.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 2000
})
MyHttp.interceptors.request.use((config) => {
  if (localStorage.getItem('token')) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
  }
  return config
}, error => {
  Vue.prototype.$message({
    type: 'error',
    message: 'REQUEST FAILED TAY AGIN'
  })
  return Promise.reject(error)
})

MyHttp.interceptors.response.use(res => {
  return res.data
}, error => {
  let errStatus = error.response.status
  switch (errStatus) {
    case 401:
      Vue.prototype.$message({
        type: 'error',
        message: 'Request parameter error'
      })
      break
    case 403:
      Vue.prototype.$message({
        type: 'error',
        message: 'Token authentication failed'
      })
      let timer = setTimeout(() => {
        Router.push({path: '/'})
        clearTimeout(timer)
        localStorage.clear()
      }, 200)
      break
    case 500:
      Vue.prototype.$message({
        type: 'error',
        message: 'Server error'
      })
      break
    default:
      Vue.prototype.$message({
        type: 'error',
        message: 'Unknown error'
      })
      break
  }
  return Promise.reject(error)
})
export default MyHttp
