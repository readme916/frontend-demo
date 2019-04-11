// 菜单 顶栏

import {
  getMenu
} from '@api/sys.menu'

let menuData;
getMenu().then(res => {
  menuData = res.items.map(m => {
    return {
      title: m.name,
      icon: m.icon,
      path: m.url
    }
  })

})
export default [{
    path: '/index',
    title: '首页',
    icon: 'home'
  },
  {
    title: '演示页面',
    icon: 'folder-o',
    children: [{
        path: '/demo/page1',
        title: '页面 1'
      },
      {
        path: '/demo/page2',
        title: '页面 2'
      },
      {
        path: '/demo/page3',
        title: '页面 3'
      },
      {
        path: '/form',
        title: '表单功能'
      }
    ]
  },
  menuData
]