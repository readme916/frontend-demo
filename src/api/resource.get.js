import request from '@/plugin/axios'
import setting from '@/setting'
export function resourceList (application,resource,params) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource,
    method: 'get',
    params
  })
}

export function subResourceList (application,resource,id,subResource){
  return request({
  url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id+"/"+subResource,
  method: 'get'
  })
}

export function resourceDetail (application,resource,id) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id,
    method: 'get'
  })
}


export function resourceHistory (id,page,size) {
  return request({
    url: setting.historyUrl +"/"+id+"?page="+page+"&size="+size,
    method: 'get'
  })
}

export function subResourceDetail (application,resource,id,subResource,subResourceId) {
  return request({
    url: setting.baseUrl +'/'+application + "/" + setting.restPath +"/" + resource+"/"+id+"/"+subResource+"/"+subResourceId,
    method: 'get'
  })
}