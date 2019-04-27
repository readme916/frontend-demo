import request from '@/plugin/axios'
import setting from '@/setting'
export  function getServer () {
  return request({
    url: setting.baseUrl,
    method: 'get'
  })
}
export  function postServerOnline (application) {
  return request({
    url: setting.baseUrl+"/eureka/"+application+"/online",
    method: 'post'
  })
}
export  function postServerOffline (application) {
  return request({
    url: setting.baseUrl+"/eureka/"+application+"/offline",
    method: 'post'
  })
}