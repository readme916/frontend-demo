import request from '@/plugin/axios'
import setting from '@/setting'
export function AccountLogin (data) {
  return request({
    url: setting.oauth2LoginUrl,
    method: 'post',
    params: {
      'grant_type': setting.grantType,
      'scope': setting.scope,
      ...data
    },
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    auth: {
      username: setting.clientId,
      password: setting.clientSecret
    }
  })
}
