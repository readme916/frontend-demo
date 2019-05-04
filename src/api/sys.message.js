
import request from '@/plugin/axios'
import setting from '@/setting'
export  function hasReadMessageList () {
  return request({
    url: setting.hasReadMessageUrl,
    method: 'get'
  })
}
export  function notReadMessageList () {
  return request({
    url: setting.notReadMessageUrl,
    method: 'get'
  })
}