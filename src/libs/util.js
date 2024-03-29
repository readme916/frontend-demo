import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import setting from '@/setting'

const util = {
  cookies,
  db,
  log
}

util.menuConverter = function (menu, recursion) {

  if(Object.keys(menu).length === 0){
    return []
  }
  if (!recursion) {
    return menu.map(m => {
      return {
        uuid: m.uuid,
        title: m.name,
        icon: m.icon,
        path: m.url
      }
    })
  } else {
    return menu.map(m => {
      if (m.children && Object.keys(menu).length !== 0) {
        return {
          uuid: m.uuid,
          title: m.name,
          icon: m.icon,
          path: m.url,
          children: util.menuConverter(m.children,true)
        }
      } else {
        return {
          uuid: m.uuid,
          title: m.name,
          icon: m.icon,
          path: m.url
        }
      }
    })
  }
}


/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  
  window.document.title = setting.title
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

export default util