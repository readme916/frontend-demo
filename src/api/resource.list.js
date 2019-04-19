import request from '@/plugin/axios'
import setting from '@/setting'
export function resourceList (params,application,resource) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource,
    method: 'get',
    params
  })
}
