import request from '@/plugin/axios'
import setting from '@/setting'
export default function getMenu () {
  return request({
    url: setting.menuUrl,
    method: 'get'
  })
}
