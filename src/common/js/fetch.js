import axios from 'axios'
import router from '../../router'
import { Message, MessageBox } from 'element-ui'
import { getToken, clearToken } from './storage'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API  // api的base_url
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['X-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// function selectAction () {
//   MessageBox.confirm('此账号已在另一处登录,请重新登录', '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'warning'
//   }).then(() => {
//     clearToken()
//     router.push('/login')
//     Message({
//       message: '如果不是本人操作,请登陆后及时修改密码',
//       type: 'info',
//       duration: 3 * 1000
//     })
//   }).catch(() => {
//     clearToken()
//     Message({
//       message: '您将不能访问任何页面,请重新登录',
//       type: 'warning',
//       duration: 3 * 1000
//     })
//   })
// }

// respone拦截器
/*
* 404   搜索出现错误
* 1024  搜索超时
* 110   账号被挤掉
* */
service.interceptors.response.use(res => {
    if (res.data.code === '404') {
      router.push('/404')
    } else if (res.data.code === '1024') {
      res.data = []
      Message({
        message: '请求超时，请增加搜索条件以便搜索',
        type: 'warning',
        duration: 3 * 1000
      })
    } else if (res.data.code === '110') {
      clearToken()
      router.push('/login')
      Message({
        message: '此账号已在另一处登录,请重新登录',
        type: 'warning',
        duration: 2.5 * 1000
      })
    }
    return res
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
