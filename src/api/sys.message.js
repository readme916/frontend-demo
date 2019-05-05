import request from '@/plugin/axios'
import setting from '@/setting'
export function hasReadMessageList(page, size) {
  return request({
    url: setting.hasReadMessageUrl + "?page=" + page + "&size=" + size,
    method: 'get'
  })
}
export function notReadMessageList() {
  return request({
    url: setting.notReadMessageUrl,
    method: 'get'
  })
}

export function readMessage(uuid) {
  return request({
    url: setting.readMessageUrl + "/" + uuid,
    method: 'get'
  })
}