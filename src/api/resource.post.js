
import request from '@/plugin/axios'
import setting from '@/setting'
export function resourcePost (application,resource,id,data) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id,
    method: 'post',
    data:data
  })
}


export function subResourceCreate (application,resource,id,subResource,data) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id+"/"+subResource,
    method: 'post',
    data:data
  })
}

export function subResourceUpdate (application,resource,id,subResource,subResourceId,data) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id+"/"+subResource+"/"+subResourceId,
    method: 'post',
    data:data
  })
}
export function subResourceDelete (application,resource,id,subResource,subResourceId) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id+"/"+subResource+"/"+subResourceId,
    method: 'delete',
    
  })
}