
import request from '@/plugin/axios'
import setting from '@/setting'
export function resourcePost (application,resource,id,data) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id,
    method: 'post',
    data:data
  })
}
