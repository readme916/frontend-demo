
import request from '@/plugin/axios'
import setting from '@/setting'
export function resourceDetail (application,resource,id) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id,
    method: 'get'
  })
}
